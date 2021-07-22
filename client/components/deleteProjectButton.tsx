import axios from "axios";
import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "react-query";
import { configWithToken } from "../functions";
import UseUserToken from "../hooks/useUserToken";
import { queryClient } from "../utils/queryClient";

const DeleteProjectButton = ({ projectId }: { projectId: string }) => {
  const router = useRouter();

  const userInfo = UseUserToken();
  const handleDeleleProject = async () => {
    if (!userInfo || !userInfo.token || !projectId) return;
    const config = configWithToken(userInfo.token);
    await axios.delete(`/api/projects/delete-project/${projectId}`, config);
  };
  const { mutateAsync: deleteProject, isError } = useMutation(
    handleDeleleProject,
    {
      onSuccess: () => queryClient.invalidateQueries(`projects`),
    }
  );

  const handleDeleteProject = () => {
    try {
      const continueDelete = window.confirm(
        "Are you sure you want to delete? This action cannot be undone."
      );
      if (continueDelete) {
        deleteProject();
        if (!isError) {
          router.push("/projects");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className="flex items-center mt-2 bg-gray-300 text-black w-36 p-1 hover:bg-red-500 hover:text-white-175 transition-all duration-500 rounded-md"
      onClick={handleDeleteProject}
    >
      <FaTrash className="mr-3" /> Delete
    </button>
  );
};

export default DeleteProjectButton;
