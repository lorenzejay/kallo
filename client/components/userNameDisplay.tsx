import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { Status } from "../types/projectTypes";
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
  const auth = useAuth();
  const { userToken } = auth;
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  // const [newStatus, setNewStatus] = useState<Status>(status);

  const getUsername = async () => {
    const { data } = await axios.get(`/api/users/username/${user_id}`);
    setUsername(data);
    return data;
  };
  useEffect(() => {
    getUsername();
  }, []);

  const handleUpdateUserStatus = async (status: Status) => {
    try {
      //you must be an admin or owner

      if (userToken === null || !projectId) return;

      const config = configWithToken(userToken);
      const { data } = await axios.put(
        `/api/sharing/update-user-status/${projectId}`,
        { status, shared_id },
        config
      );

      return data;
    } catch (error) {
      // console.log(error);
      return error.message;
    }
  };

  const { mutateAsync: updateStatus } = useMutation(handleUpdateUserStatus, {
    onSuccess: () => queryClient.invalidateQueries(`shared-users-${projectId}`),
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

export default UsernameDisplay;
