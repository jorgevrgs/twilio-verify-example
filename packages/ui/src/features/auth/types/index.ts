export interface RegisterFormData {
  username: string;
  password: string;
  phoneNumber: string;
  enableMFA: boolean;
  channel?: 'sms' | 'call';
}

export type LoginFormData = Pick<RegisterFormData, 'username' | 'password'>;

export interface VerifyCodeFormData {
  verificationCode: string;
  phoneNumber: string;
  sid: string;
}

export type User = Omit<RegisterFormData, 'password' | 'channel'> & {
  id: string;
  isPhoneNumberVerified: boolean;
  defaultChannel: 'sms' | 'call';
  verification?: {
    sid: string;
    channel: 'sms' | 'call';
    status: string;
    createdAt: string;
    updatedAt: string;
    valid: boolean;
  };
};

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}
