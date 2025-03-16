<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  router.push('/auth/login');
};
</script>

<template>
  <header class="student-header">
    <div class="logo-space">
    </div>
    <div class="right-section">
      <div class="header-links">
        <a href="#" class="header-link">이용권 구매</a>
        <a href="#" class="header-link">기업 제휴</a>
      </div>
      <div class="user-profile" @click="logout">
        <img src="@/assets/images/student-profile.png" alt="프로필" class="profile-image" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.student-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}

.logo-space {
  flex: 1;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-links {
  display: flex;
  gap: 20px;
}

.header-link {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.header-link:hover {
  color: #F37322;
}

.user-profile {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-profile:hover {
  transform: scale(1.05);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-image:not([src]) {
  background-color: #000;
}
</style>