import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
interface SharedUserProps {
  user_id: string;
}
const SharedUserList = ({ user_id }: SharedUserProps) => {
  const [username, setUsername] = useState("");
  //convert user_id to name
  const getUsername = async () => {
    const { data } = await axios.get(`/api/users/username/${user_id}`);
    setUsername(data);
    return data;
  };
  useEffect(() => {
    getUsername();
  }, []);
  return (
    <p className="-mr-2  order-4 shadow-xl bg-orange-125 text-white-175 rounded-full p-1 w-9 h-9 flex justify-center items-center text-xl font-medium">
      {username.slice(0, 1)}
    </p>
  );
};

export default SharedUserList;
