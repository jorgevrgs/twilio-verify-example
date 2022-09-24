import 'maz-ui/css/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { installToaster, pinia, router, toasterOptions } from './plugins';
import './style.css';

createApp(App)
  .use(installToaster, toasterOptions)
  .use(pinia)
  .use(router)
  .mount('#app');
