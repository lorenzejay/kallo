import { memo, useEffect } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Status } from "../types/projectTypes";
import supabase from "../utils/supabaseClient";
import useCheckAccessStatus from "../hooks/useProjectAccess";
interface UsernameDisplayProps {
  user_id: string;
  width: string;
  status: Status;
  shared_id: string;
  projectId: string;
}

const UsernameDisplay = ({
  user_id,
  width,
  status,
  shared_id,
  projectId,
}: UsernameDisplayProps) => {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");

  const getUsername = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("user_id", user_id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setUsername(data.username);
    return data;
  };
  useEffect(() => {
    getUsername();
  }, []);

  const handleUpdateUserStatus = async (status: Status) => {
    //you must be an admin or owner to update settings
    const accessStatus = await useCheckAccessStatus(projectId);
    if (accessStatus === Status.admin) {
      const { data, error } = await supabase
        .from("shared_users")
        .update({ status })
        .eq("shared_id", shared_id);
      if (error) throw new Error(error.message);
      return data;
    }
    return window.alert("You do not have access to modify this file");
  };

  const { mutateAsync: updateStatus } = useMutation(handleUpdateUserStatus, {
    onSuccess: () =>
      queryClient.invalidateQueries([`shared-users-${projectId}`]),
  });

  return (
    <div className={`flex items-center justify-start text-sm my-3 ${width}`}>
      <p className="border flex-1 rounded-full p-2 mr-3 w-10 h-6 flex justify-center items-center font-medium">
        {username.slice(0, 1).toUpperCase()}
      </p>
      <p className="flex-grow">{username}</p>
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value as Status)}
        className="border ml-3"
      >
        <option value={Status.viewer}>{Status.viewer}</option>
        <option value={Status.editor}>{Status.editor}</option>
        <option value={Status.admin}>{Status.admin}</option>
      </select>
    </div>
  );
};

export default memo(UsernameDisplay);
