<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('personal');
const setActiveTab = (tab) => {
  activeTab.value = tab;
  console.log('탭 변경됨:', activeTab.value);
};

const personalPlans = [
  {
    id: 'premium',
    name: '프리미엄',
    days: 30,
    originalPrice: 31800,
    price: 15900,
    discount: 50,
    features: [
      { text: 'TEAM SPACE 개설(1개)', icon: 'People.png' },
      { text: 'LLM 30MB 용량 제공', icon: 'Data.png' },
      { text: 'PDF 요약본 1개 생성', icon: 'Pdf.png' },
      { text: '최대 5개 문제 생성 가능', icon: 'TestPassed.png' }
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    days: 30,
    originalPrice: 59800,
    price: 29900,
    discount: 50,
    features: [
      { text: 'TEAM SPACE 개설(5개)', icon: 'People.png' },
      { text: 'LLM 200MB 용량 제공', icon: 'Data.png' },
      { text: 'PDF 요약본 무제한 생성', icon: 'Pdf.png' },
      { text: '무제한 문제 생성 가능', icon: 'TestPassed.png' }
    ]
  }
];

const teamPlans = [
  {
    id: 'team-basic',
    name: '베이직',
    days: 30,
    originalPrice: 31800,
    price: 15900,
    discount: 50,
    features: [
      { text: 'TEAM SPACE 개설(1개)', icon: 'People.png' },
      { text: 'LLM 30MB 용량 제공', icon: 'Data.png' },
      { text: 'PDF 요약본 1개 생성', icon: 'Pdf.png' },
      { text: '최대 5개 문제 생성 가능', icon: 'TestPassed.png' }
    ]
  },
  {
    id: 'team-pro',
    name: '프로',
    days: 30,
    originalPrice: 59800,
    price: 29900,
    discount: 50,
    features: [
      { text: 'TEAM SPACE 개설(5개)', icon: 'People.png' },
      { text: 'LLM 200MB 용량 제공', icon: 'Data.png' },
      { text: 'PDF 요약본 무제한 생성', icon: 'Pdf.png' },
      { text: '무제한 문제 생성 가능', icon: 'TestPassed.png' }
    ]
  }
];

const plans = computed(() => {
  console.log('계산 중인 activeTab:', activeTab.value);
  return activeTab.value === 'personal' ? personalPlans : teamPlans;
});

import PeopleIcon from '@/assets/images/People.png';
import DataIcon from '@/assets/images/Data.png';
import PdfIcon from '@/assets/images/Pdf.png';
import TestPassedIcon from '@/assets/images/TestPassed.png';

const iconMap = {
  'People.png': PeopleIcon,
  'Data.png': DataIcon,
  'Pdf.png': PdfIcon,
  'TestPassed.png': TestPassedIcon
};

const handlePurchase = (planId) => {
  console.log(`${planId} 플랜 구매`);
};
</script>

<template>
  <div class="subscription-container">
    <div class="header-section">
      <img src="@/assets/images/purchase-pass.png" alt="학습 구독권 헤더" class="header-image">
    </div>
    
    <div class="subscription-tabs">
      <div class="tab-container">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'personal' }"
          @click="setActiveTab('personal')"
        >
          개인 맞춤 플랜
          <div class="tab-description">더 이상 혼자 고민할 필요 없는 나만을 위한 학습 튜터</div>
        </button>
        
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'team' }"
          @click="setActiveTab('team')"
        >
          팀 워크 플랜
          <div class="tab-description">혼자가 아닌, 팀과 함께 하는 학습의 새로운 패러다임</div>
        </button>
      </div>
    </div>
    
    <div class="subscription-plans">
      <div v-for="plan in plans" :key="plan.id" class="plan-card">
        <div class="plan-header">
          <div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-duration">{{ plan.days }}일</p>
          </div>
          <div class="plan-price-container">
            <div class="price-top">
              <span class="plan-discount">{{ plan.discount }}%</span>
              <span class="plan-original-price">₩{{ plan.originalPrice.toLocaleString() }}</span>
            </div>
            <div class="plan-price">{{ plan.price.toLocaleString() }}원</div>
          </div>
        </div>
        
        <div class="plan-features">
          <div v-for="(feature, index) in plan.features" :key="index" class="feature-item">
            <div class="feature-box">
              <img 
                :src="iconMap[feature.icon]" 
                :alt="feature.text" 
                class="feature-icon"
              >
              <span class="feature-text">{{ feature.text }}</span>
            </div>
          </div>
        </div>
        
        <button 
          class="purchase-button"
          :class="{ 'solid-button': plan.id === 'premium' || plan.id === 'team-basic' }"
          @click="handlePurchase(plan.id)"
        >
          구매
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-container {
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
}

.header-section {
  margin-bottom: 30px;
  text-align: center;
}

.header-image {
  width: 100%;
  border-radius: 2px;
}

.subscription-tabs {
  margin-bottom: 30px;
}

.tab-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.tab-button {
  flex: 1;
  background-color: #F9F9F9;
  border: none;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #948E8E;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: #FFF0E6;
  color: #F37322;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid;
}

.tab-description {
  font-size: 0.85rem;
  font-weight: normal;
  margin-top: 8px;
  color: #948E8E;
}

.tab-button.active .tab-description {
  color: #F37322;
}

.subscription-plans {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.plan-card {
  flex: 1;
  min-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 40px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.plan-duration {
  color: #666;
  margin: 0;
}

.plan-price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-top {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.plan-discount {
  background-color: #FF4D4D;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-right: 5px;
}

.plan-original-price {
  text-decoration: line-through;
  color: #888;
  font-size: 0.9rem;
}

.plan-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #F37322;
  text-align: right;
}

.plan-features {
  margin-bottom: 25px;
}

.feature-item {
  margin-bottom: 15px;
}

.feature-box {
  display: flex;
  align-items: center;
  background-color: #FFF8F4;
  border-radius: 8px;
  padding: 12px 15px;
  width: 100%;
  min-height: 54px;
}

.feature-icon {
  width: 30px;
  height: 30px;
  min-width: 30px;
  margin-right: 15px;
  object-fit: contain;
  opacity: 0.7;
}

.feature-text {
  font-size: 1rem;
  color: #666;
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  flex: 1;
}

.purchase-button {
  width: 100%;
  padding: 15px;
  border: 2px solid #F37322;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  color: #F37322;
}

.solid-button {
  background-color: #F37322;
  color: white;
}

.purchase-button:hover {
  background-color: #F37322;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .tab-container {
    flex-direction: column;
  }
  
  .plan-card {
    width: 100%;
  }
}
</style>