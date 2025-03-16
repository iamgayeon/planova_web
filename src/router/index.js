import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import authRotes from './auth';
import boardRotes from './board';
import informationRoutes from './information';
import supportRoutes from './support';
import StudentRoutes from './student';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    ...authRotes,
    ...boardRotes,
    ...informationRoutes,
    ...supportRoutes,
    ...StudentRoutes
  ],
});

export default router;
