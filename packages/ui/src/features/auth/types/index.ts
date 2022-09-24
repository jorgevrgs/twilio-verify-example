export interface FormData {
  username: string;
  password: string;
  phoneNumber: string;
  enableMFA: boolean;
}

export type User = Omit<FormData, 'password'> & {
  id: string;
  verification: {
    sid: string;
    status: string;
  };
};
