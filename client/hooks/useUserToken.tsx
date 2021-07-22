import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const UseUserToken = () => {
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  return userInfo ? userInfo : null;
};

export default UseUserToken;
