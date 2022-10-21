import axios from "axios";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactChild,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import supabase from "../utils/supabaseClient";
import { UserInfo } from "../types/userTypes";

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
  session: Session | null;
  user: User | null;
  userDetails: UserInfo | null;
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
  session: null,
  user: null,
  userDetails: null,
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
  const [user, setUser] = useState<User | null>(null); // used if there is a logged in user
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<UserInfo | null>(null);
  // useEffect(() => {
  //   const userToken = window.localStorage.getItem("userToken");
  //   if (!userToken || userToken === null) {
  //     window.localStorage.setItem("userToken", JSON.stringify(userToken));
  //   }
  // }, []);

  // useEffect(() => {
  //   const getLoggedInUser = async () => {
  //     // const session = await supabase.auth.session()
  //     const user = await supabase.auth.user();

  //     setSession(session)
  //     if(user){
  //       setUser(user);
  //     }
  //   }
  //   getLoggedInUser()

  // }, [])
  const getUserDetails = async () => {
    if (user) {
      const { data } = await supabase.from("users").select().single();
      if (data) {
        setUserDetails(data);
      }
      // console.log('data',data)
    }
  };
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event) {
        console.log("event", event);
      }
      if (event === "SIGNED_IN") {
        getUserDetails();
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
      }
      if (event === "TOKEN_REFRESHED") {
        console.log("token refreshed");
      }
      if (session) {
        console.log("session");
      }
      // console.log(event, session)
    });
  }, []);
  // console.log('session', session)
  // console.log('user', user)
  useEffect(() => {
    const getUserDetails = async () => {
      if (user) {
        const { data, error } = await supabase.from("users").select().single();
        if (error) throw new Error(error.message);
        console.log("data", data);
        if (data) {
          setUserDetails(data);
        }
        // console.log('data',data)
      }
    };
    getUserDetails();
  }, []);

  // useEffect(() => {
  //   if (userToken !== null) {
  //     getUserId();
  //   }
  // }, []);

  // useEffect(() => {
  //   window.localStorage.setItem("userToken", JSON.stringify(userToken));
  // }, [userToken]);

  // const getUserId = async () => {
  //   if (!userToken) return;
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       token: userToken,
  //     },
  //   };
  //   const { data } = await axios.get<{ userId: string }>(
  //     "/api/users/identification",
  //     config
  //   );
  //   setUserId(data.userId);
  //   return data;
  // };

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
    } catch (error: any) {
      setError(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) setError(error.message);
    else setUser(user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("error", error);
    setUser(null);
  };

  //what our state has access too from useAuth hook
  return {
    userToken,
    register,
    error,
    logout,
    login,
    userId,
    session,
    user,
    userDetails,
  };
};
