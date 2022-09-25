import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    canAccess?: 'public' | 'onlyGuest' | 'onlyAuth';
  }
}
