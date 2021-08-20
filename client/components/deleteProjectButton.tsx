import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "react-query";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { ReturnedApiStatus, UserProjectAccess } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";

const DeleteProjectButton = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const auth = useAuth();
  const { userToken } = auth;
  const [userStatus, setUserStatus] = useState<UserProjectAccess>(
    {} as UserProjectAccess
  );

  const fetchUsersProjectAccess = async () => {
    try {
      if (!projectId || !userToken) return;
      const config = configWithToken(userToken);
      const { data } = await axios.get(
        `/api/projects/user-project-access/:${projectId}`,
        config
      );
      setUserStatus(data);
      return data;
    } catch (error) {
      // console.log(error)
      return error;
    }
  };
  useEffect(() => {
    fetchUsersProjectAccess();
  }, [projectId]);

  const handleDeleleProject = async () => {
    try {
      if (!userToken || !projectId) return;
      const config = configWithToken(userToken);
      const { data } = await axios.delete<ReturnedApiStatus | undefined>(
        `/api/projects/delete-project/${projectId}`,
        config
      );
      if (!data)
        return window.alert("Only the project owner can delete the project.");
      return data;
    } catch (error) {
      return error;
    }
  };
  const { mutateAsync: deleteProject } = useMutation<
    ReturnedApiStatus | undefined
  >(handleDeleleProject, {
    onSuccess: () => queryClient.invalidateQueries(`projects`),
  });

  const removeProject = async () => {
    try {
      if (userStatus.adminStatus === false) return;
      const continueDelete = window.confirm(
        "Are you sure you want to delete? This action cannot be undone."
      );
      if (continueDelete) {
        await deleteProject();
        router.push("/projects");
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  return (
    <button
      className="flex items-center mt-2 bg-gray-300 text-black w-36 p-1 hover:bg-red-500 hover:text-white-175 transition-all duration-500 rounded-md"
      onClick={removeProject}
    >
      <FaTrash className="mr-3" /> Delete
    </button>
  );
};

export default DeleteProjectButton;
