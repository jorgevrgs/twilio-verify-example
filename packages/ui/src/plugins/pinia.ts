import cloneDeep from 'lodash.clonedeep';
import { createPinia, PiniaPlugin } from 'pinia';

export const pinia = createPinia();

const resetPlugin: PiniaPlugin = ({ store }) => {
  const initialState = cloneDeep(store.$state);

  store.$reset = () => {
    console.log('resetting store', store.$id);

    localStorage.removeItem('user');
    store.$patch(cloneDeep(initialState));
  };
};

pinia.use(resetPlugin);
