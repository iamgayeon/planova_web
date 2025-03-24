import StudentLayout from '../components/layouts/StudentLayout.vue';

export default [
  {
    path: '/student',
    meta: { layout: 'StudentLayout', requiresAuth: true },
    children: [
      {
        path: 'main',
        name: 'studentMain',
        component: () => import('../pages/student/StudentMainPage.vue'),
        meta: { layout: 'StudentLayout' }
      },
      {
        path: 'aitutor',
        name: 'studentAitutor',
        component: () => import('../pages/student/StudentAiTutorPage.vue'),
        meta: { layout: 'StudentLayout' }
      },
      {
        path: 'calendar',
        name: 'studentCalendar',
        component: () => import('../pages/student/StudentCalendarPage.vue'),
        meta: { layout: 'StudentLayout' }
      },
      {
        path: 'pdf',
        name: 'studentPdf',
        component: () => import('../pages/student/StudentPdfPage.vue'),
        meta: { layout: 'StudentLayout' }
      },
      {
        path: 'myroom',
        name: 'studentMyRoom',
        component: () => import('../pages/student/StudentMyroomPage.vue'),
        meta: { layout: 'StudentLayout' }
      },
      {
        path: 'faq',
        name: 'studentFaq',
        component: () => import('../pages/student/StudentFaqPage.vue'),
        meta: { layout: 'StudentLayout' }
      },
      {
        path: 'support',
        name: 'studentSupport',
        component: () => import('../pages/student/StudentSupportPage.vue'),
        meta: { layout: 'StudentLayout' }
      }
      
    ]
  }
];