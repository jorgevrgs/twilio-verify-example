import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     *
     * public: free access to the page
     * onlyGuest: only guests can access the page
     * onlyAuth: only authenticated users can access the page
     * onlyVerified: only users with the specified permission can access the page, i.e. userEnableMFA requires a verification code
     * onlyForm: only after submiting the form, the user can access the page
     */
    canAccess?: 'public' | 'onlyGuest' | 'onlyAuth' | 'onlyForm';
  }
}
