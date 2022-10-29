import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import useCheckAccessStatus from "../hooks/useProjectAccess";
import supabase from "../utils/supabaseClient";
import { Status } from "../types/projectTypes";

const DeleteProjectButton = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState<Status>(Status.viewer);

  const fetchUsersProjectAccess = async () => {
    if (!projectId) return;
    const accessType = await useCheckAccessStatus(projectId);
    if (accessType) {
      setUserStatus(accessType);
    }
  };
  useEffect(() => {
    fetchUsersProjectAccess();
  }, [projectId]);

  const handleDeleleProject = async () => {
    if (!projectId) return;
    const accessType = await useCheckAccessStatus(projectId);
    if (accessType && accessType !== Status.owner) {
      return window.alert("Only the project owner can delete the project.");
    }
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("project_id", projectId);
    if (error) throw new Error(error.message);
  };
  const { mutateAsync: deleteProject } = useMutation(handleDeleleProject, {
    onSuccess: () => queryClient.invalidateQueries([`projects`]),
  });

  const removeProject = async () => {
    if (userStatus !== Status.owner) return;
    const continueDelete = window.confirm(
      "Are you sure you want to delete? This action cannot be undone."
    );
    if (continueDelete) {
      await deleteProject();
      router.push("/projects");
    }
  };

  return (
    <button
      className="disabled:opacity-70 disabled:pointer-events-none flex items-center mt-2 bg-gray-300 text-black w-36 p-1 hover:bg-red-500 hover:text-white-175 transition-all duration-500 rounded-md"
      onClick={removeProject}
      disabled={
        userStatus === "viewer" || userStatus === "none" || !userStatus
          ? true
          : false
      }
    >
      <FaTrash className="mr-3" /> Delete
    </button>
  );
};

export default DeleteProjectButton;
