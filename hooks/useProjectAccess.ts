import { Status } from "../types/projectTypes";
import supabase from "../utils/supabaseClient";

const getUserAccessProject = async (
  userId: string | undefined,
  projectId: string | undefined
) => {
  if (!projectId) throw Error("No project");
  if (!userId) throw Error("No user");
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .match({ user_id: userId })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("User not found");
  }
  // check if youre not the owner
  const { data: projectOwner, error: projectOwnerError } = await supabase
    .from("projects")
    .select("project_owner")
    .eq("project_id", projectId)
    .single();
  if (projectOwnerError) throw new Error(projectOwnerError.message);
  if (projectOwner.project_owner === userId) {
    return Status.owner;
  }

  // check based
  const { data: checkerStatus, error: checkerStatusError } = await supabase
    .from("shared_users")
    .select(`status, shared_user`)
    .eq("shared_project", projectId);
  if (checkerStatusError) throw new Error(checkerStatusError.message);
  const verifyUser = checkerStatus.find(
    (sharedUser) => sharedUser.shared_user === userId
  );
  if (verifyUser) return verifyUser.status as Status;
  console.log("no status");
  return Status.none;
};

export default async function useCheckAccessStatus(projectId: string) {
  const {data: {user}} = await supabase.auth.getUser();
  if (!user || !projectId) return;

  const accessStatus = await getUserAccessProject(user?.id, projectId);
  return accessStatus;
}
