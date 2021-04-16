import axios from "axios";
import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { configWithToken } from "../functions";

const DeleteProjectButton = ({ projectId }) => {
  const router = useRouter();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const handleDeleteProject = async () => {
    try {
      const config = configWithToken(userInfo.token);
      const continueDelete = window.confirm(
        "Are you sure you want to delete? This action cannot be undone."
      );
      if (continueDelete) {
        await axios.delete(`/api/projects/delete-project/${projectId}`, config);
        return router.push("/projects");
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className="flex items-center  hover:bg-gray-300 hover:text-black w-full p-1"
      onClick={handleDeleteProject}
    >
      <FaTrash className="mr-3" /> Delete
    </button>
  );
};

export default DeleteProjectButton;
