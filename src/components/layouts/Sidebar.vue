<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['menu-click']);

const handleMenuClick = (menuName) => {
  emit('menu-click', menuName);
};

const hoveredItem = ref(null);

const setHovered = (menuName) => {
  hoveredItem.value = menuName;
};

const clearHovered = () => {
  hoveredItem.value = null;
};
</script>

<template>
  <aside class="sidebar">
    <div class="logo-container">
      <img src="@/assets/images/planova-small-logo.jpg" alt="로고" class="logo">
    </div>
    
    <nav class="nav-menu">
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'home' }"
        @click="handleMenuClick('home')"
        @mouseenter="setHovered('home')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'home' || hoveredItem === 'home'
            ? '/sidebar-home-click.png' 
            : '/sidebar-home.png'" 
          class="icon-image"
        />
      </div>
        <div class="nav-text">홈</div>
      </div>
      
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'pdf' }"
        @click="handleMenuClick('pdf')"
        @mouseenter="setHovered('pdf')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'pdf' || hoveredItem === 'pdf'
            ? '/sidebar-pdf-click.png' 
            : '/sidebar-pdf.png'" 
          class="icon-image"
        />
      </div>
        <div class="nav-text">학습</div>
      </div>
      
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'ai-tutor' }"
        @click="handleMenuClick('ai-tutor')"
        @mouseenter="setHovered('ai-tutor')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'ai-tutor' || hoveredItem === 'ai-tutor'
            ? '/sidebar-aitutor-click.png' 
            : '/sidebar-aitutor.png'" 
          class="icon-image"
        />
      </div>
         
        <div class="nav-text">AI 튜터</div>
      </div>
      
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'calendar' }"
        @click="handleMenuClick('calendar')"
        @mouseenter="setHovered('calendar')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'calendar' || hoveredItem === 'calendar'
            ? '/sidebar-calendar-click.png' 
            : '/sidebar-calendar.png'" 
          class="icon-image"
        />
      </div>
        <div class="nav-text">캘린더</div>
      </div>
      
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'myroom' }"
        @click="handleMenuClick('myroom')"
        @mouseenter="setHovered('myroom')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'myroom' || hoveredItem === 'myroom'
            ? '/sidebar-myroom-click.png' 
            : '/sidebar-myroom.png'" 
          class="icon-image"
        />
      </div>
        <div class="nav-text">마이룸</div>
      </div>
      
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'faq' }"
        @click="handleMenuClick('faq')"
        @mouseenter="setHovered('faq')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'faq' || hoveredItem === 'faq'
            ? '/sidebar-faq-click.png' 
            : '/sidebar-faq.png'" 
          class="icon-image"
        />
      </div>
        <div class="nav-text">FAQ</div>
      </div>
      
      <div 
        class="nav-item" 
        :class="{ active: activeMenu === 'support' }"
        @click="handleMenuClick('support')"
        @mouseenter="setHovered('support')"
        @mouseleave="clearHovered"
      >
      <div class="nav-icon">
        <img 
          :src="activeMenu === 'support' || hoveredItem === 'support'
            ? '/sidebar-support-click.png' 
            : '/sidebar-support.png'" 
          class="icon-image-support"
        />
      </div>
      <div class="nav-text">고객지원</div>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 100px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  height: 100vh;
  z-index: 1000;
}

.logo-container {
  margin-bottom: 30px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 5px 0;
}

.nav-icon {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  transition: color 0.2s ease;
}

.active-icon {
  color: #F76707;
}

.icon-image {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.icon-image-support {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.nav-text {
  font-size: 12px;
  color: #666;
  transition: color 0.2s ease;
  margin-top: 4px;
}

.nav-item.active .nav-text {
  color: #F76707;
  font-weight: 500;
}

.nav-item:hover .nav-text {
  color: #F76707;
}
</style>