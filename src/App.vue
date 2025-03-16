<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './components/layouts/DefaultLayout.vue';
import StudentLayout from './components/layouts/StudentLayout.vue';

const route = useRoute();

const useStudentLayout = computed(() => {
  // 경로가 /student로 시작하는지 확인
  return route.path.startsWith('/student');
});

const useDefaultLayout = computed(() => {
  // student 경로가 아닌 경우에만 기본 레이아웃 사용
  return !useStudentLayout.value;
});
</script>

<template>
  <DefaultLayout v-if="useDefaultLayout">
    <router-view />
  </DefaultLayout>
  <StudentLayout v-else-if="useStudentLayout">
    <router-view />
  </StudentLayout>
  <router-view v-else />
</template>