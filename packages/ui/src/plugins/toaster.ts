import { installToaster, ToasterOptions } from 'maz-ui';

const toasterOptions: ToasterOptions = {
  position: 'bottom',
  timeout: 10_000,
  persistent: true,
};

export { toasterOptions, installToaster };
