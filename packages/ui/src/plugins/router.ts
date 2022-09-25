import DefaultLayout from '@/layouts/default.vue';
import { createRouter, createWebHistory, RouterOptions } from 'vue-router';
import { useAuthStore } from '../features/auth/stores/register.store';
import { User } from '../features/auth/types';

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
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('Running guard...');

  const requiresAuth = to.matched.some(
    (record) => record.meta.canAccess === 'onlyAuth'
  );

  const authStore = useAuthStore();
  const localString = localStorage.getItem('user');
  if (localString) {
    const storedUser: User = JSON.parse(localString);

    authStore.$patch({ user: storedUser });
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    const requiresGuest = to.matched.some(
      (record) => record.meta.canAccess === 'onlyGuest'
    );

    if (requiresGuest && authStore.isAuthenticated) {
      next({ name: 'Profile' });
    } else {
      next();
    }
  }
});
