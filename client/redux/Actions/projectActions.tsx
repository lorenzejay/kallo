import axios from "axios";
import { Dispatch } from "redux";
import { Columns } from "../../types/projectTypes";
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
} from "../Types/projectTypes";

export const addProject =
  (title: string, header_img: string, is_private: boolean) =>
  async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch({ type: PROJECT_CREATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userInfo.token,
        },
      };

      const { data } = await axios.post(
        "/api/projects/add",
        { title, header_img, is_private },
        config
      );

      dispatch({ type: PROJECT_CREATE_SUCCESS, payload: data.success });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: PROJECT_CREATE_FAIL, payload: error.message });
    }
  };

export const getLoggedInUserProjects =
  () => async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch({ type: PROJECT_GET_USERS_OWNED_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userInfo.token,
        },
      };

      const { data } = await axios.get(
        "/api/projects/get-user-projects",
        config
      );

      dispatch({ type: PROJECT_GET_USERS_OWNED_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: PROJECT_GET_USERS_OWNED_FAIL, payload: error.message });
    }
  };

export const getBoardColumns =
  (projectId: string) => async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch({ type: PROJECT_BOARD_COLUMNS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userInfo.token,
        },
      };

      const { data } = await axios.get(
        `/api/projects/get-board-columns/${projectId}`,
        config
      );

      dispatch({ type: PROJECT_BOARD_COLUMNS_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: PROJECT_BOARD_COLUMNS_FAIL, payload: error.message });
    }
  };

export const deleteProject =
  (projectId: string) => async (dispatch: Dispatch, getState: any) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userInfo.token,
        },
      };
      await axios.delete(`/api/projects/delete-project/${projectId}`, config);
      //after deleting, empty out board columns
      dispatch({ type: PROJECT_BOARD_COLUMNS_SUCCESS, payload: [] });
    } catch (error) {
      console.log(error.message);
    }
  };

export const updateCols =
  (columns: Columns[], projectId: string) =>
  async (dispatch: Dispatch, getState: any) => {
    try {
      // dispatch({ type: PROJECT_BOARD_COLUMNS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: userInfo.token,
        },
      };
      await axios.put(
        `/api/projects/add-column/${projectId}`,
        { columns },
        config
      );
      const { data } = await axios.get(
        `/api/projects/get-board-columns/${projectId}`,
        config
      );
      //after deleting, empty out board columns
      console.log(data);
      dispatch({ type: PROJECT_BOARD_COLUMNS_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.message);
      dispatch({ type: PROJECT_BOARD_COLUMNS_FAIL, payload: error.message });
    }
  };
