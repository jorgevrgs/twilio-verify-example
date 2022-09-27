import DefaultLayout from '@/layouts/default.vue';
import { createRouter, createWebHistory, RouterOptions } from 'vue-router';
import { useAuthStore } from '../features/auth/stores';

const routes: RouterOptions['routes'] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { canAccess: 'public' },
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { canAccess: 'onlyGuest' },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/RegisterPage.vue'),
        meta: { canAccess: 'onlyGuest' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { canAccess: 'onlyAuth' },
      },
      {
        path: 'profile/change-password',
        name: 'ChangePassword',
        component: () => import('@/pages/ChangePasswordPage.vue'),
        meta: { canAccess: 'onlyAuth' },
      },
      {
        path: 'verification',
        name: 'Verification',
        component: () => import('@/pages/VerificationPage.vue'),
        meta: { canAccess: 'onlyForm' },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  try {
    await authStore.getCurrentUser();
  } catch (error) {
    // Ignore error
  }

  /**
   * Check access
   */
  const requiresAuth = to.matched.some(
    (record) => record.meta.canAccess === 'onlyAuth'
  );
  const requiresGuest = to.matched.some(
    (record) => record.meta.canAccess === 'onlyGuest'
  );
  const requiresForm = to.matched.some(
    (record) => record.meta.canAccess === 'onlyForm'
  );

  // If the form is not generated, redirecto to the origin page
  if (requiresForm && !Boolean(authStore.formData)) {
    return from.fullPath;
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' };
  }

  if (requiresAuth && authStore.verificationState === 'pending') {
    return { name: 'Verification', query: { redirect: to.fullPath } };
  }

  if (requiresGuest && authStore.isAuthenticated) {
    return { name: 'Profile' };
  }
});
