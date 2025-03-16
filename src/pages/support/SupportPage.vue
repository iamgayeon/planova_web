<script setup>
import { ref, reactive } from 'vue';

const faqItems = ref([
  {
    id: 1,
    question: 'PLANOVA AI 튜터는 무엇인가요?',
    answer: 'PLANOVA AI 튜터는 인공지능을 활용한 학습 도우미로, 개인 맞춤형 학습 계획 수립과 문제 해결에 도움을 드립니다.',
    isOpen: false
  },
  {
    id: 2,
    question: 'PLANOVA AI 튜터 멤버십은 어떤 혜택가 있나요?',
    answer: '멤버십에 가입하시면 무제한 문제 생성, PDF 요약본 생성, LLM 용량 제공 등 다양한 혜택을 누리실 수 있습니다.',
    isOpen: false
  },
  {
    id: 3,
    question: 'PLANOVA AI 튜터는 어떤 사람들에게 추천하나요?',
    answer: '학습에 어려움을 느끼는 학생, 개인 맞춤형 학습을 원하는 분, 효율적인 학습 방법을 찾고 계신 분들께 추천합니다.',
    isOpen: false
  },
  {
    id: 4,
    question: '다른 영어 학습과의, PLANOVA AI 튜터는 어떤 점이 다른가요?',
    answer: '인공지능 기반 개인 맞춤형 학습, 실시간 피드백, 다양한 학습 자료 제공 등이 차별화된 특징입니다.',
    isOpen: false
  },
  {
    id: 5,
    question: 'PLANOVA AI 튜터도 무료 체험을 할 수 있나요?',
    answer: '네, 신규 가입 시 7일간의 무료 체험 기간을 제공해 드립니다.',
    isOpen: false
  },
  {
    id: 6,
    question: 'PLANOVA AI 튜터 멤버십 결제는 어떻게 하나요?',
    answer: '홈페이지에서 멤버십 플랜을 선택한 후, 다양한 결제 방법(신용카드, 계좌이체 등)으로 결제하실 수 있습니다.',
    isOpen: false
  },
  {
    id: 7,
    question: 'PLANOVA AI 튜터 멤버십 결제 수단을 변경할 수 있나요?',
    answer: '네, 마이페이지 > 결제 관리에서 언제든지 결제 수단을 변경하실 수 있습니다.',
    isOpen: false
  },
  {
    id: 8,
    question: 'PLANOVA AI 튜터 멤버십은 자동 결제(구독형) 방식인가요?',
    answer: '네, 편의를 위해 자동 결제 방식으로 운영되며, 마이페이지에서 언제든지 해지 가능합니다.',
    isOpen: false
  },
  {
    id: 9,
    question: '중간에 PLANOVA AI 튜터 멤버십 종류를 변경할 수 있나요?',
    answer: '네, 마이페이지 > 멤버십 관리에서 언제든지 플랜을 업그레이드하거나 다운그레이드하실 수 있습니다.',
    isOpen: false
  },
  {
    id: 10,
    question: 'PLANOVA AI 튜터 서비스 결제시, 현금 영수증 사용이 가능한가요?',
    answer: '네, 결제 시 현금 영수증 신청이 가능하며, 마이페이지에서도 발급 신청하실 수 있습니다.',
    isOpen: false
  }
]);

const activeCategory = ref('자주 묻는 질문');

const toggleFaq = (id) => {
  const updatedItems = faqItems.value.map(item => {
    if (item.id === id) {
      return { ...item, isOpen: !item.isOpen };
    } else {
      return { ...item, isOpen: false };
    }
  });
  
  faqItems.value = updatedItems;
};

const categories = ref([
  { id: 'payment', name: '결제/환불' },
  { id: 'attendance', name: '수업권' },
  { id: 'cancel', name: '계정' },
  { id: 'tutor', name: 'PLANOVA AI 튜터' },
  { id: 'etc', name: '기타' }
]);
</script>

<template>
  <div class="faq-section">
    <div class="search-container">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="궁금한 질문 검색해보세요." class="search-input">
      </div>
    </div>
    
    <div class="tab-container">
      <div class="tabs">
        <button class="tab" :class="{ active: activeCategory === '전체' }">전체</button>
        <button class="tab" :class="{ active: activeCategory === '고객 후기' }">고객 후기</button>
        <button class="tab" :class="{ active: activeCategory === 'PLANOVA 가이드' }">PLANOVA 가이드</button>
        <button class="tab" :class="{ active: activeCategory === '자주 묻는 질문' }">자주 묻는 질문</button>
        <button class="tab" :class="{ active: activeCategory === '공지사항' }">공지사항</button>
      </div>
    </div>
    
    <div class="category-filter">
      <button 
        v-for="category in categories" 
        :key="category.id" 
        class="category-btn"
        :class="{ active: category.name === 'PLANOVA AI 튜터' }"
      >
        {{ category.name }}
      </button>
    </div>
    
    <div class="faq-container">
      <div 
        v-for="item in faqItems" 
        :key="item.id" 
        class="faq-item"
        :class="{ 'active': item.isOpen }"
      >
        <div class="faq-question" @click="toggleFaq(item.id)">
          <span class="question-icon">Q</span>
          <span class="question-text">{{ item.question }}</span>
          <span class="arrow-icon">{{ item.isOpen ? '▲' : '▼' }}</span>
        </div>
        <div class="faq-answer" v-if="item.isOpen">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="contact-section">
    <div class="contact-container">
      <div class="contact-text">
        <h2 class="title">더 궁금한 것이 있다면 플래노바<br>고객센터로 연락주세요.</h2>
        <button class="contact-button">플래노바팀에 문의하기</button>
      </div>
      
      <div class="contact-info">
        <p class="contact-type">대표전화</p>
        <p class="phone-number">02-1234-1234</p>
        
        <p class="hours-title">운영시간</p>
        <p class="hours">평일 오전 10:00 ~ 오후 6:00 KST</p>
        <p class="lunch-time">점심시간 : 오후 1:00 ~ 오후 2:00 KST</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0 30px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #eee;
  border-radius: 25px;
  background-color: #f7f7f7;
  font-size: 16px;
  outline: none;
}

.tab-container {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.tabs {
  display: flex;
  justify-content: space-around;
  max-width: 800px;
  margin: 0 auto;
}

.tab {
  padding: 15px 20px;
  font-size: 16px;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  color: #888;
}

.tab.active {
  color: #000;
  font-weight: bold;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.category-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn.active {
  background-color: #FF6B01;
  color: white;
  border-color: #FF6B01;
}

.category-btn:hover {
  background-color: #f5f5f5;
}

.category-btn.active:hover {
  background-color: #e35f00;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto 50px;
}

.faq-item {
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.faq-question {
  display: flex;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;
}

.question-icon {
  color: #FF6B01;
  font-weight: bold;
  font-size: 18px;
  margin-right: 15px;
}

.question-text {
  flex: 1;
  font-size: 16px;
}

.arrow-icon {
  font-size: 12px;
  color: #999;
}

.faq-answer {
  padding: 0 0 20px 35px;
  color: #666;
  line-height: 1.6;
}

.faq-item.active .faq-question {
  color: #FF6B01;
  font-weight: bold;
}

.contact-section {
  background-color: #FFF1E5;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  min-height: 300px;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.contact-text {
  flex: 1;
  padding-right: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #FF6B01;
  line-height: 1.4;
  margin-bottom: 40px;
}

.contact-button {
  background-color: #FFE4D0;
  border: none;
  color: #FF6B01;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.contact-button:hover {
  background-color: #FFD6BA;
}

.contact-info {
  flex: 1;
  margin-top: 20px;
  margin-bottom: 20px;
}

.contact-type {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.phone-number {
  font-size: 28px;
  font-weight: bold;
  color: #FF6B01;
  margin-bottom: 40px;
}

.hours-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.hours {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.lunch-time {
  font-size: 16px;
  color: #333;
}

@media (max-width: 768px) {
  .tabs {
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0 10px;
  }
  
  .tab {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .category-filter {
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0 10px;
  }
  
  .category-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .contact-container {
    flex-direction: column;
    padding: 60px 20px;
  }
  
  .contact-text {
    padding-right: 0;
    margin-bottom: 40px;
  }
}
</style>