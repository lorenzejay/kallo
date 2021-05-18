import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteProject } from "../redux/Actions/projectActions";

const DeleteProjectButton = ({ projectId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleDeleteProject = async () => {
    try {
      const continueDelete = window.confirm(
        "Are you sure you want to delete? This action cannot be undone."
      );
      if (continueDelete) {
        dispatch(deleteProject(projectId));
        return router.push("/projects");
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className="flex items-center mt-2 bg-gray-300 text-black w-36 p-1 hover:bg-red-500 hover:text-white transition-all duration-500 rounded-md"
      onClick={handleDeleteProject}
    >
      <FaTrash className="mr-3" /> Delete
    </button>
  );
};

export default DeleteProjectButton;
