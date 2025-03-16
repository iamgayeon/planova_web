<template>
  <div class="membership-page">
    <div class="page-container">
      <div class="special-offer-badge">
        오픈특가 한정
      </div>
      
      <div class="left-section">
        <div class="timing-info">
          이용 시작하기 최적의 타이밍 ⏰
        </div>
        
        <div class="offer-card">
          <div class="offer-title">
            프리미엄 이용권 1개월
            <div class="bonus">+ <span class="highlight">1개월 추가</span> 제공</div>
          </div>
          <div class="usage-time">이용기간 60일</div>
          
          <div class="price-info">
            <div class="original-price">정가 <span class="price-strike">59,800원</span></div>
            <div class="discount-price">
              <div class="discount-rate">50%</div>
              <div class="final-price">
                할인가 <span class="price-highlight">29,900원</span>
              </div>
            </div>
          </div>
        </div>
        
        <button class="purchase-button">
          이용권 구매하기
        </button>
      </div>
      
      <div class="right-section">
        <div class="user-info-card">
          <h2 class="greeting">안녕하세요 한가연님!</h2>
          <div class="subscription-info">이용권 함께 1일째</div>
          
          <div class="info-item">
            <div class="info-label">내 이용권</div>
            <div class="info-value">사용중인 이용권이 없습니다.</div>
          </div>
          
          <div class="info-item">
            <div class="info-label">포인트</div>
            <div class="info-value">0P</div>
          </div>
          
          <div class="info-item">
            <div class="info-label">쿠폰</div>
            <div class="info-value">0</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <h2 class="features-title">이름이 처음이라면 아래 목록을 진행해보세요!</h2>
      
      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-icon pdf-icon"></div>
          <div class="feature-text">학습 PDF 업로드하기</div>
          <div class="check-icon checked"></div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon calendar-icon"></div>
          <div class="feature-text">캘린더에 학습 일정 등록하기</div>
          <div class="check-icon checked"></div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon ai-icon"></div>
          <div class="feature-text">AI튜터에게 질문하기</div>
          <div class="check-icon checked"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 사용자 정보 (추후 API에서 가져올예정)
const userName = ref('한가연');
const daysUsed = ref(1);
const hasActiveSubscription = ref(false);
const points = ref(0);
const coupons = ref(0);

const purchaseSubscription = () => {
  console.log('이용권 구매 처리');
};
</script>

<style scoped>
.membership-page {
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 20px;
  color: #333;
}

.page-container {
  display: flex;
  gap: 20px;
  position: relative;
  margin-bottom: 60px;
}

.special-offer-badge {
  position: absolute;
  top: -30px;
  left: 0;
  background-color: #F76707;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  z-index: 1;
}

.left-section {
  flex: 3;
  background-color: #FFFAF4;
  border-radius: 12px;
  padding: 40px;
  position: relative;
}

.timing-info {
  color: #F76707;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 30px;
}

.offer-card {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.offer-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.bonus {
  display: inline;
  font-size: 18px;
}

.highlight {
  color: #F76707;
}

.usage-time {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.price-info {
  margin-top: 20px;
}

.original-price {
  text-align: right;
  color: #999;
  font-size: 15px;
  margin-bottom: 5px;
}

.price-strike {
  text-decoration: line-through;
}

.discount-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.discount-rate {
  color: #F76707;
  font-size: 24px;
  font-weight: bold;
}

.final-price {
  font-size: 16px;
}

.price-highlight {
  font-size: 28px;
  font-weight: bold;
  color: #000;
}

.purchase-button {
  width: 100%;
  padding: 16px;
  background-color: #F76707;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.purchase-button:hover {
  background-color: #E55E00;
}

.right-section {
  flex: 2;
}

.user-info-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.greeting {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subscription-info {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.info-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #F0F0F0;
}

.info-label {
  color: #666;
  font-size: 15px;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
}

.features-section {
  margin-top: 40px;
}

.features-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 20px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  background-color: #FFF3E8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-icon::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #F76707;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center;
}

.calendar-icon::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #F76707;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat center;
}

.ai-icon::before {
  content: "";
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #F76707;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E") no-repeat center;
}

.feature-text {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.check-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #F1F1F1;
}

.check-icon.checked {
  background-color: #F76707;
  position: relative;
}

.check-icon.checked::before {
  content: "";
  position: absolute;
  width: 14px;
  height: 8px;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg) translate(-50%, -50%);
  left: 50%;
  top: 40%;
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }
  
  .right-section {
    margin-top: 30px;
  }
  
  .special-offer-badge {
    position: static;
    display: inline-block;
    margin-bottom: 20px;
  }
  
  .left-section {
    padding: 25px;
  }
}
</style>