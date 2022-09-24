export interface FormData {
  username: string;
  password: string;
  phoneNumber: string;
  enableMFA: boolean;
}

export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
  isMfaEnabled: boolean;
}
