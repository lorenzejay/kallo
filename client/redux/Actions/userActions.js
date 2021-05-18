import axios from "axios";
import { PROJECT_BOARD_COLUMNS_RESET, PROJECT_GET_USERS_OWNED_RESET } from "../Types/projectTypes";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_IDENTIFICATION_FAIL,
  USER_IDENTIFICATION_REQUEST,
  USER_IDENTIFICATION_RESET,
  USER_IDENTIFICATION_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../Types/userTypes";
const ISSERVER = typeof window === "undefined";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/users/login", { email, password }, config);

    if (data.success === true) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      if (!ISSERVER) {
        return localStorage.setItem("userInfo", JSON.stringify(data));
      }
    }
    if (data.success == false) {
      dispatch({ type: USER_LOGIN_FAIL, payload: data.message });
    }
  } catch (error) {
    console.log(error.message);
    dispatch({ type: USER_LOGIN_FAIL, payload: error.message });
  }
};

export const logout = () => async (dispatch) => {
  if (!ISSERVER) {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    dispatch({ type: USER_IDENTIFICATION_RESET });
    dispatch({ type: PROJECT_GET_USERS_OWNED_RESET });
    dispatch({ type: PROJECT_BOARD_COLUMNS_RESET });
  }
};

export const register = (email, username, first_name, last_name, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/register",
      { email, username, first_name, last_name, password },
      config
    );

    if (data.success === true) {
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      if (!ISSERVER) {
        return localStorage.setItem("userInfo", JSON.stringify(data));
      }
    }
    if (data.success === false) {
      dispatch({ type: USER_LOGIN_FAIL, payload: data.message });
    }
  } catch (error) {
    console.log(error.message);
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
};

export const getUserId = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_IDENTIFICATION_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userInfo.token,
      },
    };

    const { data } = await axios.get("/api/users/identification", config);
    dispatch({ type: USER_IDENTIFICATION_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: USER_IDENTIFICATION_FAIL, payload: error.messsage });
  }
};

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userInfo.token,
      },
    };

    const { data } = await axios.get("/api/users/details", config);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: USER_DETAILS_FAIL, payload: error.messsage });
  }
};
