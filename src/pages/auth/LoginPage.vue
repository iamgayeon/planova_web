<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);

// 환경변수에서 카카오 키 읽기 (Vite 방식과 Vue 방식 모두 시도)
const KAKAO_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || 
                  import.meta.env.VUE_APP_KAKAO_JAVASCRIPT_KEY || 
                  'f4c7f7a5fe0b155d15b0fc65f67f94ec'; // 백업용 키

console.log('환경변수 확인:');
console.log('VITE_KAKAO_JAVASCRIPT_KEY:', import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
console.log('VUE_APP_KAKAO_JAVASCRIPT_KEY:', import.meta.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
console.log('최종 사용 키:', KAKAO_KEY);

// 디버그용 변수
const debug = ref({
  kakaoKey: KAKAO_KEY,
  isKakaoLoaded: false,
  isInitialized: false
});

// 카카오 SDK 초기화
onMounted(async () => {
  console.log('=== 디버그 정보 ===');
  console.log('카카오 키:', debug.value.kakaoKey);
  console.log('window.Kakao 존재 여부:', !!window.Kakao);
  
  // 카카오 SDK가 로드될 때까지 기다림
  let retryCount = 0;
  const maxRetries = 10;
  
  const waitForKakao = () => {
    return new Promise((resolve) => {
      const checkKakao = () => {
        if (window.Kakao && window.Kakao.isInitialized !== undefined) {
          resolve(true);
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`카카오 SDK 로딩 대기 중... (${retryCount}/${maxRetries})`);
          setTimeout(checkKakao, 100);
        } else {
          resolve(false);
        }
      };
      checkKakao();
    });
  };
  
  const kakaoLoaded = await waitForKakao();
  
  if (kakaoLoaded && window.Kakao) {
    debug.value.isKakaoLoaded = true;
    
    // 이제 안전하게 isInitialized 호출 가능
    if (window.Kakao.isInitialized && !window.Kakao.isInitialized()) {
      console.log('카카오 SDK 초기화 중... 키:', KAKAO_KEY);
      
      if (KAKAO_KEY === '카카오_JavaScript_키를_여기에_입력') {
        console.error('⚠️ 실제 카카오 키를 설정해주세요!');
        alert('카카오 키가 설정되지 않았습니다. 코드에서 KAKAO_KEY 변수에 실제 키를 입력해주세요.');
        return;
      }
      
      try {
        window.Kakao.init(KAKAO_KEY);
        debug.value.isInitialized = true;
        console.log('✅ 카카오 SDK 초기화 성공');
      } catch (error) {
        console.error('❌ 카카오 SDK 초기화 실패:', error);
        alert('카카오 SDK 초기화에 실패했습니다. 키를 확인해주세요.');
      }
    } else if (window.Kakao.isInitialized && window.Kakao.isInitialized()) {
      debug.value.isInitialized = true;
      console.log('✅ 카카오 SDK 이미 초기화됨');
    }
  } else {
    console.error('❌ 카카오 SDK가 로드되지 않았습니다.');
  }
});

const login = async () => {
  console.log('=== 로그인 시도 ===');
  console.log('카카오 로드 여부:', debug.value.isKakaoLoaded);
  console.log('카카오 초기화 여부:', debug.value.isInitialized);
  
  if (!window.Kakao) {
    alert('카카오 SDK가 로드되지 않았습니다.');
    return;
  }
  
  if (!window.Kakao.isInitialized()) {
    alert('카카오 SDK가 초기화되지 않았습니다.');
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 카카오 로그인 실행
    window.Kakao.Auth.login({
      success: async (authObj) => {
        console.log('카카오 로그인 성공', authObj);
        
        // 사용자 정보 요청
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (userData) => {
            console.log('사용자 정보', userData);
            
            // 로그인 정보 저장
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('kakaoToken', authObj.access_token);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            
            // 학생 메인 페이지로 이동
            router.push({ name: 'studentMain' });
          },
          fail: (error) => {
            console.error('사용자 정보 요청 실패', error);
            alert('사용자 정보를 가져오는데 실패했습니다.');
          }
        });
      },
      fail: (error) => {
        console.error('카카오 로그인 실패', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    });
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('로그인 중 오류가 발생했습니다: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// 카카오 로그아웃 (옵션)
const logout = () => {
  if (window.Kakao?.Auth.getAccessToken()) {
    window.Kakao?.API.request({
      url: '/v1/user/unlink',
      success: () => {
        console.log('카카오 로그아웃 성공');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('kakaoToken');
        localStorage.removeItem('userInfo');
      },
      fail: (error) => {
        console.error('카카오 로그아웃 실패', error);
      }
    });
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-background"></div>
      
      <div class="login-content">
        <div class="logo-container">
          <img 
            src="@/assets/images/planova-small-logo.jpg"
            alt="PLANOVA 로고" 
            class="logo-image"
          />
        </div>
        
        <h1 class="login-title">
          프리미엄 AI 튜터와 함께<br>
          <span class="highlight">학습의 여정을 시작하세요!</span>
        </h1>
        
        <!-- 디버그 정보 (개발 중에만 표시)
        <div class="debug-info">
          <small>
            카카오 키: {{ debug.kakaoKey ? '설정됨 ✓' : '설정 안됨 ✗' }}<br>
            SDK 로드: {{ debug.isKakaoLoaded ? '✓' : '✗' }}<br>
            초기화: {{ debug.isInitialized ? '✓' : '✗' }}
          </small>
        </div> -->
        
        <form @submit.prevent="login">
          <div class="kakao-button-container">
            <img 
              src="@/assets/images/kakao_login_large_wide.png" 
              alt="카카오 로그인" 
              class="kakao-login-image" 
              @click="login"
              :class="{ 'disabled': isLoading || !debug.isInitialized }"
            />
            <div v-if="isLoading" class="loading-overlay">
              <div class="loading-spinner"></div>
              <span>로그인 중...</span>
            </div>
          </div>
        </form>
        
        <div class="divider">
          <span>PLANOVA만의 특별한 기능</span>
        </div>
        
        <div class="benefits">
          <div class="benefit-item">
            <div class="benefit-icon">
              <div class="icon-background">
                <span>🎓</span>
              </div>
            </div>
            <div class="benefit-text">맞춤형 학습 계획</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <div class="icon-background">
                <span>📊</span>
              </div>
            </div>
            <div class="benefit-text">학습 통계 분석</div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <div class="icon-background">
                <span>🤖</span>
              </div>
            </div>
            <div class="benefit-text">AI 튜터 서비스</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.debug-info {
  background-color: #f0f8ff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

.login-box {
  width: 100%;
  max-width: 480px;
  position: relative;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.login-background {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 180px;
  background: linear-gradient(135deg, #ffb23f 0%, #ff6f00 100%);
  border-radius: 0 0 0 100px;
  opacity: 0.8;
  transform: translateY(-60%);
}

.login-content {
  position: relative;
  padding: 50px 40px;
  z-index: 1;
}

.logo-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  margin-left: -10px;
}

.logo-image {
  width: 80px;
  height: auto;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.login-title {
  text-align: left;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 35px;
  color: #1a1a1a;
  line-height: 1.4;
  letter-spacing: -0.5px;
}

.highlight {
  position: relative;
  display: inline-block;
  color: #F37322;
  z-index: 1;
}

.highlight::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30%;
  background-color: rgba(255, 156, 63, 0.2);
  z-index: -1;
  border-radius: 3px;
}

.kakao-button-container {
  position: relative;
  width: 100%;
  margin-bottom: 45px;
  transition: transform 0.3s ease;
}

.kakao-button-container:hover {
  transform: translateY(-3px);
}

.kakao-login-image {
  width: 100%;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.kakao-login-image:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.kakao-login-image.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  font-weight: 600;
  color: #333;
  gap: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(243, 115, 34, 0.3);
  border-radius: 50%;
  border-top-color: #F37322;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  position: relative;
  margin: 0 0 30px;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
}

.divider span {
  position: relative;
  display: inline-block;
  padding: 0 15px;
  background-color: white;
  color: #666;
  font-size: 15px;
  font-weight: 500;
}

.benefits {
  display: flex;
  justify-content: space-between;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 8px;
}

.benefit-icon {
  margin-bottom: 12px;
}

.icon-background {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #fff4eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.icon-background:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(243, 115, 34, 0.15);
}

.benefit-text {
  text-align: center;
  font-size: 14px;
  color: #444;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 40px 25px;
  }
  
  .logo-image {
    width: 100px;
  }
  
  .login-title {
    font-size: 22px;
    margin-top: 10px;
  }
  
  .benefit-item {
    padding: 0 5px;
  }
  
  .icon-background {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}
</style>