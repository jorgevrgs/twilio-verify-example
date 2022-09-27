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
        meta: { canAccess: 'onlyAllowed' },
      },
      {
        path: 'profile/change-password',
        name: 'ChangePassword',
        component: () => import('@/pages/ChangePasswordPage.vue'),
        meta: { canAccess: 'onlyAllowed' },
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
  const authStore = useAuthStore();
  try {
    const { data: authenticatedUser } = await httpClient.get<User>(
      '/api/users/me'
    );
    authStore.$patch({ user: authenticatedUser });
  } catch (error) {
    // Ignore error
  }

  /**
   * If the user is not authenticated and the route requires authentication, redirect to the login page
   */
  const requiresAuth = to.matched.some(
    (record) => record.meta.canAccess === 'onlyAuth'
  );

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' };
  }

  /**
   * Access to protected pages redirects to the verification page for MFA enabled users
   */
  const requiresPermission = to.matched.some(
    (record) => record.meta.canAccess === 'onlyAllowed'
  );

  if (requiresPermission && authStore.isVerificationRequired) {
    return { name: 'Verification', query: { redirect: to.fullPath } };
  }

  /**
   * Access to login/register redirects to profile page
   */
  const requiresGuest = to.matched.some(
    (record) => record.meta.canAccess === 'onlyGuest'
  );

  if (requiresGuest && authStore.isAuthenticated) {
    return { name: 'Profile' };
  }
});
