export type UserInfo = {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export interface SignUpCredSupbaseAuth {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}
export type SignUpCredentials = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
};
