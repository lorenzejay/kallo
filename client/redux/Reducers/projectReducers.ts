import { AnyAction } from "redux";
import { initialProjectBoardColumns } from "../intialStates";
import { Projects } from "../../types/projectTypes";
import { ProjectBoardColumns } from "../reducerTypes";
import {
  PROJECT_BOARD_COLUMNS_FAIL,
  PROJECT_BOARD_COLUMNS_REQUEST,
  PROJECT_BOARD_COLUMNS_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_GET_USERS_OWNED_FAIL,
  PROJECT_GET_USERS_OWNED_REQUEST,
  PROJECT_GET_USERS_OWNED_SUCCESS,
  PROJECT_BOARD_COLUMNS_RESET,
  PROJECT_GET_USERS_OWNED_RESET,
} from "../Types/projectTypes";

export type ProjectAddType = {
  loading: boolean;
  created: { success: boolean; message: string } | null;
  error: string | null;
};

export const projectAddReducer = (
  state: ProjectAddType = { loading: false, created: null, error: null },
  action: AnyAction
): ProjectAddType => {
  switch (action.type) {
    case PROJECT_CREATE_REQUEST:
      return { loading: true, created: null, error: null };
    case PROJECT_CREATE_SUCCESS:
      return { loading: false, created: action.payload, error: null };
    case PROJECT_CREATE_FAIL:
      return { loading: false, error: action.payload, created: null };
    default:
      return state;
  }
};

type UsersProjectsType = {
  loading: boolean;
  error: string | null;
  projects: Projects[] | null;
};
export const projectGetUserOwnedReducer = (
  state: UsersProjectsType = { loading: false, error: null, projects: null },
  action: AnyAction
): UsersProjectsType => {
  switch (action.type) {
    case PROJECT_GET_USERS_OWNED_REQUEST:
      return { loading: true, error: null, projects: null };
    case PROJECT_GET_USERS_OWNED_SUCCESS:
      return { loading: false, projects: action.payload, error: null };
    case PROJECT_GET_USERS_OWNED_FAIL:
      return { loading: false, error: action.payload, projects: null };
    case PROJECT_GET_USERS_OWNED_RESET:
      return { loading: false, error: null, projects: null };
    default:
      return state;
  }
};

export const projectsColumnsReducer = (
  state = initialProjectBoardColumns,
  action: AnyAction
): ProjectBoardColumns => {
  switch (action.type) {
    case PROJECT_BOARD_COLUMNS_REQUEST:
      return { loading: true, boardColumns: [], error: null };
    case PROJECT_BOARD_COLUMNS_SUCCESS:
      return { loading: false, boardColumns: action.payload, error: null };
    case PROJECT_BOARD_COLUMNS_FAIL:
      return { loading: false, error: action.payload, boardColumns: [] };
    case PROJECT_BOARD_COLUMNS_RESET:
      return { loading: false, error: null, boardColumns: [] };
    default:
      return state;
  }
};
