import {
  ProjectBoardColumns,
  UserDetailsType,
  UserIdentificationType,
  UserInfoType,
} from "./reducerTypes";

export const initialUserInfoState: UserInfoType = {
  userInfo: null,
  loading: false,
  error: null,
};

export const initialUserDetailsState: UserDetailsType = {
  userDetails: {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    user_id: "",
    username: "",
  },
  loading: false,
  error: null,
};

export const initialUserIdentificationState: UserIdentificationType = {
  userId: {
    user_id: null,
  },
  loading: false,
  error: null,
};

export const initialProjectBoardColumns: ProjectBoardColumns = {
  loading: false,
  error: null,
  boardColumns: [],
};
