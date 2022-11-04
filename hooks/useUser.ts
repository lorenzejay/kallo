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

export default function useUser() {
  const user = supabase.auth.user();
  return useQuery(["user"], () => getUser(user?.id), {
    retry: 1,
  });
}
