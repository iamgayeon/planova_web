<script setup>
import { ref, reactive } from 'vue';
</script>

<template>
  <div class="contact-section">
    <div class="contact-container">
      <div class="contact-text">
        <h2 class="title">더 궁금한 것이 있다면 플래노바<br>고객센터로 연락주세요.</h2>
        <button class="contact-button">플래노바팀에 문의하기</button>
      </div>
      
      <div class="contact-info">
        <p class="contact-type">대표전화</p>
        <p class="phone-number">010-9843-6764</p>
        
        <p class="hours-title">운영시간</p>
        <p class="hours">평일 오전 10:00 ~ 오후 6:00 KST</p>
        <p class="lunch-time">점심시간 : 오후 1:00 ~ 오후 2:00 KST</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-section {
  background-color: #FFF1E5;
  width: 100vw; 
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
  padding: 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.contact-text {
  flex: 1;
  padding-right: 40px;
  margin-top: 0;
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
  margin-top: 0;
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