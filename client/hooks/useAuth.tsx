import axios from "axios";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactChild,
} from "react";
type AuthContextType = {
  userToken: string | null;
  register: (
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string
  ) => Promise<void>;
  error: string | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  userId: string | null;
};
const ISSERVER = typeof window === "undefined";

//initalizing user context, by defaults should be empty

const localUserToken =
  (!ISSERVER && window.localStorage.getItem("userToken")) || null;

const AuthContext = createContext<AuthContextType>({
  userToken: localUserToken,
  register: async () => {},
  error: null,
  logout: () => {},
  login: async () => {},
  userId: null,
});
const { Provider } = AuthContext;

export const AuthProvider = ({ children }: { children: ReactChild }) => {
  const auth = useAuthProvider();
  //wraps our app with the user context = gives us who is logged in for our entire app
  return <Provider value={auth}>{children}</Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const useAuthProvider = () => {
  let localUser = null;
  if (!ISSERVER) {
    localUser = window.localStorage.getItem("userToken");
  }
  const [userToken, setUserToken] = useState<string | null>(
    localUser ? JSON.parse(localUser) : null
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const userToken = window.localStorage.getItem("userToken");
    if (!userToken || userToken === null) {
      window.localStorage.setItem("userToken", JSON.stringify(userToken));
    }
  }, []);

  useEffect(() => {
    if (userToken !== null) {
      getUserId();
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("userToken", JSON.stringify(userToken));
  }, [userToken]);

  const getUserId = async () => {
    if (!userToken) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userToken,
      },
    };
    const { data } = await axios.get<{ userId: string }>(
      "/api/users/identification",
      config
    );
    setUserId(data.userId);
    return data;
  };

  const register = async (
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    password: string
  ) => {
    try {
      setError(null);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post<{
        success: boolean;
        token: string;
        message: string;
      }>(
        "/api/users/register",
        { email, username, first_name, last_name, password },
        config
      );

      if (data.success === true) {
        setError(null);
        setUserToken(data.token);

        return localStorage.setItem("userToken", JSON.stringify(data.token));
      }
      if (data.success === false) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const {
        data,
      }: { data: { success: boolean; token: string; message: string } } =
        await axios.post("/api/users/login", { email, password }, config);

      if (data.success === true) {
        setUserToken(data.token);

        return localStorage.setItem("userToken", JSON.stringify(data.token));
      }
      if (data.success == false) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const logout = () => {
    setUserToken(null);
    return localStorage.removeItem("userToken");
  };

  //what our state has access too from useAuth hook
  return {
    userToken,
    register,
    error,
    logout,
    login,
    userId,
  };
};
