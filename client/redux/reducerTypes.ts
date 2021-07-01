import { Columns } from "../types/projectTypes";

export interface UserInfoType {
  userInfo: {
    token: string | null;
    success: Boolean;
  } | null;
  loading: Boolean;
  error: any | null;
}
export interface UserDetailsType {
  userDetails: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    user_id: string;
    username: string;
  } | null;
  loading: Boolean;
  error: any | null;
}

export interface UserIdentificationType {
  userId: {
    user_id: string | null;
  } | null;
  loading: Boolean;
  error: any | null;
}

export interface ProjectBoardColumns {
  loading: boolean;
  error: string | null;
  boardColumns: Columns[] | [];
}
