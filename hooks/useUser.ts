import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabaseClient";



const getUser = async (userId: string | undefined) => {
  if (!userId) throw Error("No user");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .match({ user_id: userId })
    .single();
  if (error) {
    return error.message;
  }
  return data;
};

export default async function useClientUser() {
  // const { data: { user } } = await supabase.auth.getUser()
  // @ts-ignore
  const user = useUser()
  // return {user}
  return useQuery(['user'], () => getUser(user?.id))
  // const [user, setUser]= useState<User | null>()
  // useEffect(() => {
  //   fetchUser().then(u => {
  //     setUser(u)
  //   })
  // },[])

  
  // return data
}
