import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userDetailsReducer,
  userIdentificationReducer,
  userLoginReducer,
} from "./Reducers/userReducers";
import {
  projectAddReducer,
  projectGetUserOwnedReducer,
  projectsColumnsReducer,
} from "./Reducers/projectReducers";

const reducers = combineReducers({
  userLogin: userLoginReducer,
  userIdentification: userIdentificationReducer,
  userDeets: userDetailsReducer,
  projectAdd: projectAddReducer,
  projectGetUsers: projectGetUserOwnedReducer,
  projectColumns: projectsColumnsReducer,
});
const middlewares = [thunk];
const ISSERVER = typeof window === "undefined";

let initialState = {};
if (!ISSERVER) {
  const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  initialState = {
    userLogin: {
      userInfo: userInfoFromStorage,
    },
  };
}
const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
