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

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Verification {
  sid: string;
  channel: 'sms' | 'call';
  status: string;
  createdAt: string;
  updatedAt: string;
  valid: boolean;
}

export interface Factor {
  sid: string;
  type: string;
  status: string;
}

export type UserState = Omit<RegisterFormData, 'password' | 'channel'> & {
  id: string;
  isPhoneNumberVerified: boolean;
  defaultChannel: 'sms' | 'call';
};

export interface UserResponse extends UserState {
  verification?: Verification;
  factor?: Factor;
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}
