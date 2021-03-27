import axios from "axios";
import {
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
