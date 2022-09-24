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
  enableMFA: boolean;
  isPhoneNumberVerified: boolean;
  verification: {
    sid: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
