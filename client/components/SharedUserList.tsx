import React from "react";
import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabaseClient";
interface SharedUserProps {
  user_id: string;
}
const SharedUserList = ({ user_id }: SharedUserProps) => {
  const fetchSharedUsername = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("user_id", user_id)
      .single();

    if (error) throw new Error(error.message);
    return data.username;
  };
  const { data: sharedUsername, isError: sharedUsernameError } = useQuery(
    [`shared-user-${user_id}`],
    fetchSharedUsername,
    { enabled: !!user_id }
  );

  if (sharedUsernameError) <p>{sharedUsernameError}</p>;
  return (
    <p className="-mr-2  order-4 shadow-xl bg-orange-125 text-white-175 rounded-full p-1 w-9 h-9 flex justify-center items-center text-xl font-medium">
      {sharedUsername?.slice(0, 1)}
    </p>
  );
};

export default React.memo(SharedUserList);
