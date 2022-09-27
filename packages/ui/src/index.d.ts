import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     *
     * public: free access to the page
     * onlyGuest: only guests can access the page
     * onlyAuth: only authenticated users can access the page
     * onlyAllowed: only users with the specified permission can access the page, i.e. userEnableMFA requires a verification code
     */
    canAccess?: 'public' | 'onlyGuest' | 'onlyAuth' | 'onlyAllowed';
  }
}
