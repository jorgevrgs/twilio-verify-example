import { installToaster, ToasterOptions } from 'maz-ui';

const toasterOptions: ToasterOptions = {
  position: 'bottom',
  timeout: 5_000,
  persistent: false,
};

export { toasterOptions, installToaster };
