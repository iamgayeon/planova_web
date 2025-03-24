<template>
  <div class="membership-page">
    <div class="page-container">
      <div class="left-section">
        <div class="offer-card">
          <div class="special-offer-badge">
            오픈특가 한정
          </div>
          <div class="offer-header">
            <div class="offer-title">프리미엄 이용권 1개월</div>
            <div class="bonus-info">
              <div class="plus-icon">+</div>
              <div>이용권 1개월(30일) 추가제공</div>
            </div>
          </div>
          
          <div class="price-info">
            <div class="original-price">정가 <span class="price-strike">59,800원</span></div>
            <div class="discount-price">
              <div class="discount-badge">50%</div>
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
          <div class="subscription-info">PLANOVA와 함께 1일째</div>
          
          <!-- v-calendar 컴포넌트 -->
          <div class="calendar-container">
            <v-calendar 
              :attributes="calendarAttributes"
              :is-expanded="true"
              :columns="1"
              :rows="1"
              title-position="left"
              class="custom-calendar"
              color="indigo"
              :masks="masks"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <div class="features-header">
        <div class="glow-effect"></div>
        <h2 class="features-title">처음이라면 아래 목록을 진행해보세요!</h2>
      </div>  
      
      <div class="feature-cards">
        <div class="feature-card">
          <div class="feature-icon pdf-icon"></div>
          <div class="feature-text">학습 PDF 업로드하기</div>
          <div class="check-icon checked"></div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon calendar-icon"></div>
          <div class="feature-text">캘린더에 학습 일정 등록하기</div>
          <div class="check-icon"></div>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon ai-icon"></div>
          <div class="feature-text">AI튜터에게 질문하기</div>
          <div class="check-icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import 'v-calendar/dist/style.css';

export default {
  setup() {
    const masks = {
      title: 'YYYY년 M월'
    };

    const events = ref([
      { date: new Date(2025, 2, 18), title: '학교 수업', type: 'class' },
      { date: new Date(2025, 2, 20), title: '영어 학습', type: 'study' }
    ]);

    const calendarAttributes = computed(() => [
      {
        key: 'today',
        highlight: {
          color: 'indigo',
          fillMode: 'solid'
        },
        dates: new Date()
      },
      ...events.value.filter(event => event.type === 'class').map(event => ({
        key: `class-${event.date.toString()}`,
        dates: event.date,
        popover: {
          label: event.title
        }
      })),
      ...events.value.filter(event => event.type === 'study').map(event => ({
        key: `study-${event.date.toString()}`,
        dates: event.date,
        popover: {
          label: event.title
        }
      }))
    ]);

    return {
      calendarAttributes,
      masks
    };
  }
}
</script>

<style scoped>
.membership-page {
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 40px;
  padding: 20px;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.page-container {
  display: flex;
  gap: 30px;
  position: relative;
  margin-bottom: 70px;
}

.special-offer-badge {
  background: linear-gradient(135deg, #FF6B00, #FF9500);
  color: white;
  padding: 10px 30px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 5px 15px rgba(255, 103, 7, 0.3);
  display: inline-block;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}

.left-section {
  flex: 3;
  background: linear-gradient(135deg, #FFFAF4, #FFF6E8);
  border-radius: 20px;
  padding: 35px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  border: none;
}

.offer-card {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  padding-top: 60px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
  position: relative;
  overflow: visible; 
  border: none;
  transform: translateY(0);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
}

.offer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.offer-card:hover .special-offer-badge {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 103, 7, 0.4);
}

.offer-header {
  text-align: center;
  margin-bottom: 25px;
  margin-top: 15px;
}

.offer-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #ff6a00;
  position: relative;
  display: inline-block;
}

.bonus-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(to right, #FFF3E0, #FFE0B2);
  padding: 12px 20px;
  border-radius: 50px;
  margin: 0 auto;
  width: fit-content;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  box-shadow: 0 4px 10px rgba(247, 103, 7, 0.15);
  transition: all 0.3s ease;
  border-left: none;
  position: relative;
  overflow: hidden;
}

.bonus-info::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.offer-card:hover .bonus-info::before {
  transform: translateX(100%);
}

.plus-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #F76707, #FF9500);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 3px 8px rgba(247, 103, 7, 0.3);
}

.price-info {
  margin-top: 25px;
  background-color: #FFFAF4;
  padding: 20px;
  border-radius: 12px;
  border: 1px dashed #FFE0B2;
  position: relative;
  overflow: hidden;
}

.price-info::before {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(247, 103, 7, 0.05), transparent);
  top: -100px;
  right: -100px;
  border-radius: 50%;
}

.original-price {
  text-align: right;
  color: #888;
  font-size: 15px;
  margin-bottom: 10px;
}

.price-strike {
  text-decoration: line-through;
  margin-left: 5px;
}

.discount-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
}

.discount-badge {
  background: linear-gradient(135deg, #F76707, #FF9500);
  color: white;
  font-size: 22px;
  font-weight: bold;
  padding: 4px 16px;
  border-radius: 50px;
  box-shadow: 0 4px 10px rgba(247, 103, 7, 0.2);
  position: relative;
  overflow: hidden;
}

.discount-badge::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-25deg);
}

.final-price {
  font-size: 18px;
  font-weight: 600;
}

.price-highlight {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #F76707, #FF9500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: 8px;
  position: relative;
}

.purchase-button {
  width: 100%;
  padding: 18px;
  background: #FFFAF4;
  color: #F76707;
  border: 2px solid #F76707;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(247, 103, 7, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
}

.purchase-button:hover::before {
  left: 100%;
}

.right-section {
  flex: 2;
}

.user-info-card {
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.greeting {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #222;
  position: relative;
  display: inline-block;
}

.subscription-info {
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.calendar-container {
  margin-top: 10px;
  width: 100%;
}

:deep(.custom-calendar) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background-color: white;
  width: 100%;
}

:deep(.vc-title) {
  font-weight: bold;
  font-size: 20px;
  background-color: white;
}

:deep(.vc-weekday) {
  color: #888;
  font-size: 14px;
  font-weight: normal;
}

:deep(.vc-day) {
  font-size: 14px;
  color: #333;
  height: 50px;
}

:deep(.vc-day-content) {
  height: 45px;
  width: 45px;
  align-items: center;
  justify-content: center;
}

:deep(.vc-container) {
  border: none;
}

:deep(.vc-highlight) {
  background-color: #ff7300
}

:deep(.vc-day.is-today) {
  font-weight: bold;
}

:deep(.vc-day.is-not-in-month) {
  opacity: 0.4;
}

.calendar-legend {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

:deep(.vc-arrow) {
  font-size: 18px;
  color: #888;
}

.features-section {
  margin-top: 50px;
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  border: none;
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: "";
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(247, 103, 7, 0.05), transparent);
  top: -150px;
  right: -150px;
  border-radius: 50%;
}

.features-header {
  position: relative;
  margin-bottom: 50px;
  text-align: center;
  padding: 20px 0;
  overflow: hidden;
}

.glow-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(circle, rgba(247, 103, 7, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
  animation: pulse-glow 3s infinite;
}

@keyframes pulse-glow {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.features-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  position: relative;
  display: inline-block;
  padding: 0 15px;
}

.features-title::before,
.features-title::after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 30px;
  background: linear-gradient(to bottom, #F76707, #FF9500);
  border-radius: 3px;
}

.features-title::before {
  left: -30px;
}

.features-title::after {
  right: -30px;
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 16px;
  padding: 25px 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  border: none;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, background-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: "";
  position: absolute;
  background: linear-gradient(90deg, rgba(247, 103, 7, 0.1), transparent);
  width: 30%;
  height: 100%;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 1.5s ease;
}

.feature-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  background-color: #FFFAF4;
}

.feature-card:hover::before {
  transform: translateX(300%);
}

.feature-icon {
  width: 30px;
  height: 30px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.pdf-icon::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/studentmain-pdf.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.calendar-icon::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/studentmain-calendar.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.ai-icon::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/studentmain-ai.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.feature-text {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.check-icon {
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/images/studentmain-noncheck.png');
  transition: transform 0.3s ease;
}

.check-icon.checked {
  background-image: url('@/assets/images/studentmain-check.png');
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }
  
  .right-section {
    margin-top: 40px;
  }
  
  .left-section {
    padding: 25px;
  }
  
  .offer-title {
    font-size: 22px;
  }
  
  .price-highlight {
    font-size: 28px;
  }
}
</style>