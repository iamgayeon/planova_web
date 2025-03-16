export default [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue'),
  },
  {
    path: '/student/main',
    name: 'studentMain',
    component: () => import('../pages/student/StudentMainPage.vue'),
    meta: { requiresAuth: true }
  },
];