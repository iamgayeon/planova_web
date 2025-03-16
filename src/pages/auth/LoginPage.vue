<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);

const login = async () => {
  try {
    isLoading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('isAuthenticated', 'true');
    
    router.push({ name: 'studentMain' });
  } catch (error) {
    console.error('로그인 실패:', error);
    
  } finally {
    isLoading.value = false;
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
        
        <form @submit.prevent="login">
          <div class="kakao-button-container">
            <img 
              src="@/assets/images/kakao_login_large_wide.png" 
              alt="카카오 로그인" 
              class="kakao-login-image" 
              @click="login"
              :class="{ 'disabled': isLoading }"
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