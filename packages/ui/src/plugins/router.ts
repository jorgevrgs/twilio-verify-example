import DefaultLayout from '@/layouts/default.vue';
import { createRouter, createWebHistory, RouterOptions } from 'vue-router';
import { useAuthStore } from '../features/auth/stores';
import { User } from '../features/auth/types';
import { httpClient } from '../utils/http-client';

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
        meta: { canAccess: 'onlyAuth' },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const requiresAuth = to.matched.some(
    (record) => record.meta.canAccess === 'onlyAuth'
  );

  const authStore = useAuthStore();
  try {
    const { data: authenticatedUser } = await httpClient.get<User>(
      '/api/users/me'
    );
    authStore.$patch({ user: authenticatedUser });
  } catch (error) {
    // Ignore error
  }

  if (to.name === 'Profile' && authStore.isPhoneVerificationInProgress) {
    return { name: 'Verification' };
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' };
  }

  const requiresGuest = to.matched.some(
    (record) => record.meta.canAccess === 'onlyGuest'
  );

  if (requiresGuest && authStore.isAuthenticated) {
    return { name: 'Profile' };
  }
});
