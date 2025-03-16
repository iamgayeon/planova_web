<script setup>
import config from '@/config';
</script>

<template>
  <div class="banner-wrapper">
    <div class="top-banner">지금 가입하고 프리미엄 기능을 <span class="highlight">무료 체험</span> 해보세요!</div>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
}
</style>

<style scoped>
.banner-wrapper {
  width: 100vw;
  margin: 0;
  padding: 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.top-banner {
  background: #FF8538;
  color: white;
  text-align: center;
  padding: 10px 0;
  font-size: 18px;
  width: 100%;
  margin: 0;
}

.highlight {
  color: black;
  font-size: 18px;
  font-weight: 600;
}
</style>