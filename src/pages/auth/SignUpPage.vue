<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const activeTab = ref('email'); // 'email' 또는 'kakao'

// 이메일 회원가입 관련 변수
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phoneNumber = ref('');
const agreeTerms = ref(false);
const agreePrivacy = ref(false);
const agreeMarketing = ref(false);
const agreeAll = ref(false);
const signupError = ref('');
const signupSuccess = ref(false);

// 환경변수에서 카카오 키 읽기 (Vite 방식과 Vue 방식 모두 시도)
const KAKAO_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || 
                  import.meta.env.VUE_APP_KAKAO_JAVASCRIPT_KEY || 
                  'f4c7f7a5fe0b155d15b0fc65f67f94ec'; // 백업용 키

// 디버그용 변수
const debug = ref({
  kakaoKey: KAKAO_KEY,
  isKakaoLoaded: false,
  isInitialized: false
});

// 폼 유효성 검사
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

const isPasswordValid = computed(() => {
  return password.value.length >= 6;
});

const isConfirmPasswordValid = computed(() => {
  return confirmPassword.value === password.value;
});

const isNameValid = computed(() => {
  return name.value.trim().length >= 2;
});

const isPhoneNumberValid = computed(() => {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phoneNumber.value);
});

const isFormValid = computed(() => {
  return isEmailValid.value && 
         isPasswordValid.value && 
         isConfirmPasswordValid.value && 
         isNameValid.value &&
         isPhoneNumberValid.value &&
         agreeTerms.value &&
         agreePrivacy.value;
});

// 전화번호 자동 하이픈 추가
const formatPhoneNumber = () => {
  let number = phoneNumber.value.replace(/[^0-9]/g, '');
  
  if (number.length <= 3) {
    phoneNumber.value = number;
  } else if (number.length <= 7) {
    phoneNumber.value = number.substring(0, 3) + '-' + number.substring(3);
  } else {
    phoneNumber.value = number.substring(0, 3) + '-' + 
                     number.substring(3, 7) + '-' + 
                     number.substring(7, 11);
  }
};

// 약관 전체 동의 처리
const toggleAgreeAll = () => {
  if (agreeAll.value) {
    agreeTerms.value = true;
    agreePrivacy.value = true;
    agreeMarketing.value = true;
  } else {
    agreeTerms.value = false;
    agreePrivacy.value = false;
    agreeMarketing.value = false;
  }
};

// 약관 동의 상태 감시하여 전체 동의 상태 업데이트
watch([agreeTerms, agreePrivacy, agreeMarketing], () => {
  agreeAll.value = agreeTerms.value && agreePrivacy.value && agreeMarketing.value;
});

// 약관 보기 모달 표시 함수들
const showTerms = () => {
  alert('서비스 이용약관 모달이 표시됩니다.');
  // 실제로는 모달 표시 로직 구현
};

const showPrivacy = () => {
  alert('개인정보 수집 및 이용 동의 모달이 표시됩니다.');
  // 실제로는 모달 표시 로직 구현
};

const showMarketing = () => {
  alert('마케팅 정보 수신 동의 모달이 표시됩니다.');
  // 실제로는 모달 표시 로직 구현
};

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

// 이메일 회원가입 처리
const emailSignup = async () => {
  if (!isFormValid.value) {
    signupError.value = '모든 필수 항목을 올바르게 입력해주세요.';
    return;
  }

  try {
    isLoading.value = true;
    signupError.value = '';
    
    // 여기에 실제 회원가입 API 호출 추가
    // 예: const response = await axios.post('/api/signup', { 
    //   email: email.value, 
    //   password: password.value,
    //   name: name.value,
    //   phoneNumber: phoneNumber.value,
    //   agreeMarketing: agreeMarketing.value
    // });
    
    // 임시로 성공 처리 (실제 구현에서는 서버 응답에 따라 처리)
    console.log('회원가입 시도:', {
      email: email.value,
      name: name.value,
      phoneNumber: phoneNumber.value,
      agreeMarketing: agreeMarketing.value
    });
    
    // 회원가입 성공 시 처리
    setTimeout(() => {
      signupSuccess.value = true;
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push({ name: 'login' });
      }, 3000);
    }, 1000); // 실제 구현에서는 이 지연을 제거하고 실제 API 응답 후 처리
    
  } catch (error) {
    console.error('회원가입 실패:', error);
    signupError.value = '회원가입에 실패했습니다. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};

// 카카오 회원가입 처리
const kakaoSignup = async () => {
  console.log('=== 카카오 회원가입 시도 ===');
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
    
    // 카카오 로그인 실행 (회원가입 목적)
    window.Kakao.Auth.login({
      success: async (authObj) => {
        console.log('카카오 인증 성공', authObj);
        
        // 사용자 정보 요청
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (userData) => {
            console.log('사용자 정보', userData);
            
            // 여기서 서버에 카카오 회원가입 API 호출
            // 예: axios.post('/api/kakao-signup', { 
            //   kakaoId: userData.id,
            //   email: userData.kakao_account?.email,
            //   name: userData.kakao_account?.profile?.nickname,
            //   profileImage: userData.kakao_account?.profile?.profile_image_url
            // });
            
            // 임시로 성공 처리
            setTimeout(() => {
              signupSuccess.value = true;
              
              // 3초 후 로그인 페이지로 이동
              setTimeout(() => {
                router.push({ name: 'login' });
              }, 3000);
            }, 1000);
          },
          fail: (error) => {
            console.error('사용자 정보 요청 실패', error);
            alert('사용자 정보를 가져오는데 실패했습니다.');
          }
        });
      },
      fail: (error) => {
        console.error('카카오 인증 실패', error);
        alert('인증에 실패했습니다. 다시 시도해주세요.');
      }
    });
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert('회원가입 중 오류가 발생했습니다: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-box">
      <div class="signup-background"></div>
      
      <div class="signup-content">
        <div class="logo-container">
          <img 
            src="@/assets/images/planova-small-logo.jpg"
            alt="PLANOVA 로고" 
            class="logo-image"
            @click="goToLogin"
          />
        </div>
        
        <h1 class="signup-title">
          PLANOVA에 가입하고<br>
          <span class="highlight">스마트한 학습을 시작하세요!</span>
        </h1>
        
        <!-- 회원가입 성공 메시지 -->
        <div v-if="signupSuccess" class="success-message">
          <div class="success-icon">✓</div>
          <h3>회원가입이 완료되었습니다!</h3>
          <p>잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
        
        <div v-else>
          <!-- 회원가입 탭 메뉴 -->
          <div class="signup-tabs">
            <button 
              @click="activeTab = 'email'" 
              :class="{ active: activeTab === 'email' }"
              class="tab-button"
            >
              이메일로 가입
            </button>
            <button 
              @click="activeTab = 'kakao'" 
              :class="{ active: activeTab === 'kakao' }"
              class="tab-button"
            >
              카카오로 가입
            </button>
          </div>
          
          <!-- 이메일 회원가입 폼 -->
          <div v-if="activeTab === 'email'" class="tab-content email-form">
            <form @submit.prevent="emailSignup">
              <div class="form-group">
                <label for="email">이메일 <span class="required">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  placeholder="이메일 주소를 입력하세요"
                  :class="{ 'input-error': email && !isEmailValid }"
                  required
                />
                <small v-if="email && !isEmailValid" class="error-text">
                  유효한 이메일 주소를 입력해주세요.
                </small>
              </div>
              
              <div class="form-group">
                <label for="password">비밀번호 <span class="required">*</span></label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="password" 
                  placeholder="비밀번호를 입력하세요 (6자 이상)"
                  :class="{ 'input-error': password && !isPasswordValid }"
                  required
                />
                <small v-if="password && !isPasswordValid" class="error-text">
                  비밀번호는 최소 6자 이상이어야 합니다.
                </small>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">비밀번호 확인 <span class="required">*</span></label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  placeholder="비밀번호를 다시 입력하세요"
                  :class="{ 'input-error': confirmPassword && !isConfirmPasswordValid }"
                  required
                />
                <small v-if="confirmPassword && !isConfirmPasswordValid" class="error-text">
                  비밀번호가 일치하지 않습니다.
                </small>
              </div>
              
              <div class="form-group">
                <label for="name">이름 <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="name" 
                  placeholder="이름을 입력하세요"
                  :class="{ 'input-error': name && !isNameValid }"
                  required
                />
                <small v-if="name && !isNameValid" class="error-text">
                  이름은 2자 이상 입력해주세요.
                </small>
              </div>
              
              <div class="form-group">
                <label for="phoneNumber">휴대폰 번호 <span class="required">*</span></label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  v-model="phoneNumber" 
                  placeholder="010-0000-0000"
                  @input="formatPhoneNumber"
                  :class="{ 'input-error': phoneNumber && !isPhoneNumberValid }"
                  required
                />
                <small v-if="phoneNumber && !isPhoneNumberValid" class="error-text">
                  올바른 휴대폰 번호 형식으로 입력해주세요.
                </small>
              </div>
              
              <div class="agreement-section">
                <h4>약관 동의</h4>
                
                <div class="agreement-item">
                  <input type="checkbox" id="agreeAll" v-model="agreeAll" @change="toggleAgreeAll" />
                  <label for="agreeAll" class="bold-label">전체 동의</label>
                </div>
                
                <div class="agreement-item">
                  <input type="checkbox" id="agreeTerms" v-model="agreeTerms" />
                  <label for="agreeTerms">
                    <span class="required">*</span> 
                    서비스 이용약관 동의 
                    <a href="#" @click.prevent="showTerms" class="terms-link">[보기]</a>
                  </label>
                </div>
                
                <div class="agreement-item">
                  <input type="checkbox" id="agreePrivacy" v-model="agreePrivacy" />
                  <label for="agreePrivacy">
                    <span class="required">*</span> 
                    개인정보 수집 및 이용 동의
                    <a href="#" @click.prevent="showPrivacy" class="terms-link">[보기]</a>
                  </label>
                </div>
                
                <div class="agreement-item">
                  <input type="checkbox" id="agreeMarketing" v-model="agreeMarketing" />
                  <label for="agreeMarketing">
                    마케팅 정보 수신 동의 (선택)
                    <a href="#" @click.prevent="showMarketing" class="terms-link">[보기]</a>
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                class="signup-button"
                :disabled="isLoading || !isFormValid"
              >
                <span v-if="!isLoading">회원가입</span>
                <div v-else class="button-spinner"></div>
              </button>
              
              <div v-if="signupError" class="signup-error">
                {{ signupError }}
              </div>
              
              <div class="login-link">
                이미 계정이 있으신가요? <a href="#" @click.prevent="goToLogin">로그인</a>
              </div>
            </form>
          </div>
          
          <!-- 카카오 회원가입 -->
          <div v-if="activeTab === 'kakao'" class="tab-content">
            <div class="kakao-info">
              <p>카카오 계정으로 간편하게 가입하세요!</p>
              <ul>
                <li>별도의 정보 입력 없이 빠르게 가입할 수 있습니다.</li>
                <li>카카오 계정의 이메일과 프로필 정보가 사용됩니다.</li>
                <li>가입 후 추가 정보를 입력할 수 있습니다.</li>
              </ul>
            </div>
            
            <div class="agreement-section kakao-agreement">
              <div class="agreement-item">
                <input type="checkbox" id="kakaoAgreeTerms" v-model="agreeTerms" />
                <label for="kakaoAgreeTerms">
                  <span class="required">*</span> 
                  서비스 이용약관 동의 
                  <a href="#" @click.prevent="showTerms" class="terms-link">[보기]</a>
                </label>
              </div>
              
              <div class="agreement-item">
                <input type="checkbox" id="kakaoAgreePrivacy" v-model="agreePrivacy" />
                <label for="kakaoAgreePrivacy">
                  <span class="required">*</span> 
                  개인정보 수집 및 이용 동의
                  <a href="#" @click.prevent="showPrivacy" class="terms-link">[보기]</a>
                </label>
              </div>
            </div>
            
            <div class="kakao-button-container">
              <img 
                src="@/assets/images/kakao_login_large_wide.png" 
                alt="카카오로 시작하기" 
                class="kakao-signup-image" 
                @click="kakaoSignup"
                :class="{ 
                  'disabled': isLoading || !debug.isInitialized || !(agreeTerms && agreePrivacy) 
                }"
              />
              <div v-if="isLoading" class="loading-overlay">
                <div class="loading-spinner"></div>
                <span>회원가입 중...</span>
              </div>
            </div>
            
            <div class="login-link kakao-login-link">
              이미 계정이 있으신가요? <a href="#" @click.prevent="goToLogin">로그인</a>
            </div>
          </div>
        </div>
        
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
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 30px 20px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  background-color: #f9f9f9;
}

.signup-box {
  width: 100%;
  max-width: 520px;
  position: relative;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.signup-background {
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

.signup-content {
  position: relative;
  padding: 40px 35px;
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
  cursor: pointer;
}

.logo-image:hover {
  transform: scale(1.05);
}

.signup-title {
  text-align: left;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
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

/* 성공 메시지 스타일 */
.success-message {
  background-color: #e8f5e9;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease-out;
}

.success-icon {
  width: 60px;
  height: 60px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 15px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.success-message h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 10px;
}

.success-message p {
  color: #388e3c;
  font-size: 16px;
}

/* 회원가입 탭 스타일 */
.signup-tabs {
  display: flex;
  margin-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab-button.active {
  color: #F37322;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #F37322;
}

.tab-content {
  margin-bottom: 30px;
}

/* 이메일 회원가입 폼 스타일 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  border-color: #F37322;
  box-shadow: 0 0 0 2px rgba(243, 115, 34, 0.1);
}

.input-error {
  border-color: #e53935 !important;
}

.error-text {
  color: #e53935;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.required {
  color: #e53935;
  font-weight: bold;
}

.agreement-section {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.agreement-section h4 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}

.agreement-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.agreement-item input {
  margin-right: 10px;
}

.agreement-item label {
  font-size: 14px;
  color: #444;
}

.bold-label {
  font-weight: 600;
  color: #333;
}

.terms-link {
  color: #666;
  margin-left: 5px;
  font-size: 13px;
  text-decoration: none;
}

.terms-link:hover {
  color: #F37322;
  text-decoration: underline;
}

.signup-button {
  width: 100%;
  padding: 14px;
  background-color: #F37322;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-button:hover:not(:disabled) {
  background-color: #e05e0a;
  transform: translateY(-2px);
}

.signup-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.signup-error {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #F37322;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.kakao-login-link {
  margin-top: 15px;
}

/* 카카오 회원가입 스타일 */
.kakao-info {
  background-color: #fff9e6;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.kakao-info p {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 15px;
}

.kakao-info ul {
  padding-left: 20px;
  margin-bottom: 0;
}

.kakao-info li {
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.kakao-agreement {
  margin-bottom: 20px;
}

.kakao-button-container {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.kakao-button-container:hover {
  transform: translateY(-3px);
}

.kakao-signup-image {
  width: 100%;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.kakao-signup-image:hover:not(.disabled) {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.kakao-signup-image.disabled {
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

/* 구분선 및 하단 기능 스타일 */
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .signup-content {
    padding: 30px 20px;
  }
  
  .logo-image {
    width: 70px;
  }
  
  .signup-title {
    font-size: 22px;
    margin-bottom: 25px;
  }
  
  .tab-button {
    font-size: 14px;
    padding: 10px 0;
  }
  
  .form-group input {
    padding: 10px;
  }
  
  .agreement-section {
    padding: 12px 10px;
  }
  
  .benefit-item {
    padding: 0 5px;
  }
  
  .icon-background {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
  
  .benefit-text {
    font-size: 12px;
  }
}
</style>