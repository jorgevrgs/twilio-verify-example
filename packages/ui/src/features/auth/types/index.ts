export interface FormData {
  username: string;
  password: string;
  phoneNumber: string;
  enableMFA: boolean;
}

export type User = Omit<FormData, 'password'> & {
  id: string;
  isPhoneNumberVerified: boolean;
  verification: {
    sid: string;
    status: string;
  };
};

export interface ErrorResponse {
  status: number;
  message: string;
}
