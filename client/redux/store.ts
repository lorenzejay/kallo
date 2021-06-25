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

export type RootState = ReturnType<typeof reducers>;

const middlewares = [thunk];
const ISSERVER = typeof window === "undefined";

let initialState = {};
if (!ISSERVER) {
  let userInfoFromStorage;

  let storedUser = localStorage.getItem("userInfo");

  if (typeof storedUser === "string") {
    userInfoFromStorage = JSON.parse(storedUser);
  } else {
    userInfoFromStorage = null;
  }

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
