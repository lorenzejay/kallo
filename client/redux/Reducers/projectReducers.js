import {
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_GET_USERS_OWNED_FAIL,
  PROJECT_GET_USERS_OWNED_REQUEST,
  PROJECT_GET_USERS_OWNED_SUCCESS,
} from "../Types/projectTypes";

export const projectAddReducer = (state = {}, action) => {
  switch (action.type) {
    case PROJECT_CREATE_REQUEST:
      return { loading: true };
    case PROJECT_CREATE_SUCCESS:
      return { loading: true, created: action.payload };
    case PROJECT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectGetUserOwnedReducer = (state = { projects: [] }, action) => {
  switch (action.type) {
    case PROJECT_GET_USERS_OWNED_REQUEST:
      return { loading: true };
    case PROJECT_GET_USERS_OWNED_SUCCESS:
      return { loading: false, projects: action.payload };
    case PROJECT_GET_USERS_OWNED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
