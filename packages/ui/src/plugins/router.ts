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
  console.log(
    `Running guard from ${from.name?.toString()} to ${to.name?.toString()}`
  );

  const authStore = useAuthStore();
  try {
    await authStore.getCurrentUser();
  } catch (error) {
    // Ignore error
  }

  console.log('Current store', authStore.formData, authStore.action);

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

  console.log({
    requiresAuth,
    requiresGuest,
    requiresForm,
    isAuthenticated: authStore.isAuthenticated,
    formData: authStore.formData,
    action: authStore.action,
    boolFormData: !Boolean(authStore.formData),
  });

  // If the form is not generated, redirecto to the origin page
  if (requiresForm && !Boolean(authStore.formData)) {
    console.log('Guard 1');
    return from.fullPath;
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('Guard 2');
    return { name: 'Login' };
  }

  if (requiresAuth && authStore.verificationState === 'pending') {
    console.log('Guard 3');
    return { name: 'Verification', query: { redirect: to.fullPath } };
  }

  if (requiresGuest && authStore.isAuthenticated) {
    console.log('Guard 4');
    return { name: 'Profile' };
  }

  console.log('Guard 5');
});
