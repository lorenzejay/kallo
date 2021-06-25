import { AnyAction } from "redux";
import {
  initialUserDetailsState,
  initialUserIdentificationState,
  initialUserInfoState,
} from "../../types/intialStates";
import { UserDetailsType, UserIdentificationType, UserInfoType } from "../../types/reducerTypes";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_IDENTIFICATION_FAIL,
  USER_IDENTIFICATION_REQUEST,
  USER_IDENTIFICATION_SUCCESS,
  USER_IDENTIFICATION_RESET,
  USER_DETAILS_RESET,
} from "../Types/userTypes";

export const userLoginReducer = (state = initialUserInfoState, action: AnyAction): UserInfoType => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true, userInfo: null, error: null };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload, error: null };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload, userInfo: null };
    case USER_LOGOUT:
      return initialUserInfoState;
    default:
      return state;
  }
};

export const userRegisterReducer = (
  state = initialUserInfoState,
  action: AnyAction
): UserInfoType => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true, userInfo: null, error: null };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload, error: null };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload, userInfo: null };
    default:
      return state;
  }
};

export const userDetailsReducer = (
  state = initialUserDetailsState,
  action: AnyAction
): UserDetailsType => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { loading: true, userDetails: null, error: null };
    case USER_DETAILS_SUCCESS:
      return { loading: false, userDetails: action.payload, error: null };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload, userDetails: null };
    case USER_DETAILS_RESET:
      return initialUserDetailsState;
    default:
      return state;
  }
};

export const userIdentificationReducer = (
  state = initialUserIdentificationState,
  action: AnyAction
): UserIdentificationType => {
  switch (action.type) {
    case USER_IDENTIFICATION_REQUEST:
      return { loading: true, userId: null, error: null };
    case USER_IDENTIFICATION_SUCCESS:
      return { loading: false, userId: action.payload, error: null };
    case USER_IDENTIFICATION_FAIL:
      return { loading: false, error: action.payload, userId: null };
    case USER_IDENTIFICATION_RESET:
      return initialUserIdentificationState;
    default:
      return state;
  }
};
