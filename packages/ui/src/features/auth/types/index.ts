export interface RegisterFormData {
  username: string;
  password: string;
  phoneNumber: string;
  enableMFA: boolean;
}

export type LoginFormData = Pick<RegisterFormData, 'username' | 'password'>;

export interface VerifyCodeFormData {
  verificationCode: string;
  phoneNumber: string;
  sid: string;
}

export type User = Omit<RegisterFormData, 'password'> & {
  id: string;
  isPhoneNumberVerified: boolean;
  verification?: {
    sid: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}
