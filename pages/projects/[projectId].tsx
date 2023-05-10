import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsUnlock } from "react-icons/bs";
import { useMutation, useQuery } from "@tanstack/react-query";
import InviteUsers from "../../components/inviteUsers";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";
import { DarkModeContext } from "../../context/darkModeContext";
import { FormResultType, ProjectDeets, Status } from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";
import supabase from "../../utils/supabaseClient";
import ProtectedWrapper from "../../components/Protected";
import SharedUserList from "../../components/SharedUserList";
import PrivacyOptions from "../../components/privacyOptions";
import ProjectDetailsPopup from "../../components/projectDetailsPopup";
import useCheckAccessStatus from "../../hooks/useProjectAccess";
import randomColor from "randomcolor";

export type ProjectOwner = {
  username: string;
};

const Project = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const { isDarkMode } = useContext(DarkModeContext);
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  //set is private
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);

  const [formResult] = useState<FormResultType>({} as FormResultType);
  const [userStatus, setUserStatus] = useState<Status>();

  const fetchUsersProjectAccess = async () => {
    if (!projectId) return;
    const userProjectStatus = await useCheckAccessStatus(projectId as string);
    setUserStatus(userProjectStatus);
  };
  useEffect(() => {
    fetchUsersProjectAccess();
  }, [projectId]);

  const getProjectDeets = async (): Promise<ProjectDeets | undefined> => {
    if (!projectId) return;
    const { data, error } = await supabase
      .from("projects")
      .select()
      .eq("project_id", projectId)
      .single();
    if (error) throw new Error(error.message);
    return data as ProjectDeets;
  };

  const { data: projectDeets, isLoading: loadingProjectDetails } = useQuery(
    [`projectDeets-${projectId}`],
    getProjectDeets,
    {
      enabled: !!projectId,
    }
  );

  const updateProjectTitle = async (title: string) => {
    try {
      if (!projectId) return;
      const { error } = await supabase
        .from("projects")
        .update({ title })
        .match({ project_id: projectId });
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
    }
  };
  const { mutateAsync: updateTitle } = useMutation(updateProjectTitle, {
    onSuccess: () =>
      queryClient.invalidateQueries([`projectDeets-${projectId}`]),
  });

  const fetchProjectOwner = async () => {
    if (!projectDeets || !projectId) return;
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("user_id", projectDeets.project_owner)
      .single();
    if (error) throw new Error(error.message);
    return data.username;
  };
  const fetchProjectSharedUsers = async () => {
    if (!projectId) return;
    const { data, error } = await supabase
      .from("shared_users")
      .select("*")
      .eq("shared_project", projectId);
    if (error) throw new Error(error.message);
    return data;
  };
  const { data: project_owner } = useQuery(
    ["project-owner-username"],
    fetchProjectOwner,
    { enabled: !!projectDeets }
  );
  const { data: shared_users, isError: shared_users_error } = useQuery(
    [`shared-users-${projectId?.toString()}`],
    fetchProjectSharedUsers,
    { enabled: !!projectId }
  );
  // @ts-ignore
  const [title, setTitle] = useState(projectDeets?.title || "Untitled");
  //add to set state in order to update state
  useEffect(() => {
    // @ts-ignore
    if (projectDeets && projectDeets.title) {
      // @ts-ignore
      setTitle(projectDeets.title);
    }
  }, [projectDeets]);

  if (!projectId && !loadingProjectDetails) return <h1>There is no project</h1>;

  if (userStatus && userStatus === Status.none && projectDeets?.is_private) {
    return (
      <Layout>
        <h2 className="flex items-center justify-center pt-36 text-center">
          User does not have access to view this project.
        </h2>
      </Layout>
    );
  }

  //if project is public or they have access
  return (
    <ProtectedWrapper>
      <Head>
        {projectDeets ? (
          // @ts-ignore
          <title>{projectDeets.title} | Kallo</title>
        ) : (
          <title>Kallo</title>
        )}
      </Head>
      <Layout>
        <>
          {projectDeets && !loadingProjectDetails && (
            <main
              className={`text-white min-h-screen ${
                isDarkMode ? "dark-body" : "bg-white-175"
              } `}
            >
              {projectDeets && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <button
                        className={`${
                          isDarkMode ? "bg-gray-500" : "bg-gray-125"
                        }  rounded-md px-2 py-1 w-24 my-2`}
                        onClick={() =>
                          setOpenPrivacyOptions(!openPrivacyOptions)
                        }
                        disabled={
                          userStatus === "viewer" ||
                          userStatus === "none" ||
                          userStatus === "editor" ||
                          !userStatus
                            ? true
                            : false
                        }
                      >
                        {projectDeets.is_private ? (
                          <span className="flex items-center justify-between">
                            <BsLock /> Private
                          </span>
                        ) : (
                          <span className="flex items-center justify-between">
                            <BsUnlock /> Public
                          </span>
                        )}
                      </button>
                      <div className="flex relative">
                        {!shared_users_error &&
                          Array.isArray(shared_users) &&
                          shared_users.map((user, i) => (
                            <SharedUserList
                              user_id={user.shared_user}
                              key={i}
                              color={randomColor({
                                luminosity: "dark",
                                hue: "random",
                              })}
                            />
                          ))}
                        <button
                          className="border shadow-2xl text-white-125 mr-3 rounded-full ml-3 p-1 w-9 h-9 r flex justify-center items-center"
                          onClick={() => setOpenInviteUsers(!openInviteUsers)}
                        >
                          <AiOutlinePlus size={21} />
                        </button>
                      </div>
                      <InviteUsers
                        openInviteUsers={openInviteUsers}
                        setOpenInviteUsers={setOpenInviteUsers}
                        projectId={projectId as string}
                        formResult={formResult}
                      />
                    </div>

                    {projectDeets && project_owner && (
                      <ProjectDetailsPopup
                        data={projectDeets}
                        projectId={projectDeets.project_id}
                        projectOwner={project_owner ? project_owner : ""}
                        // @ts-ignore
                        sharedUsers={shared_users}
                        projectTitle={projectDeets.title}
                        userStatus={userStatus}
                      />
                    )}
                  </div>
                  {openPrivacyOptions && (
                    <PrivacyOptions
                      is_private={projectDeets.is_private}
                      setOpenPrivacyOptions={setOpenPrivacyOptions}
                      projectId={projectId}
                      userStatus={userStatus}
                    />
                  )}
                </>
              )}
              {!toggleDoubleClickEffect ? (
                <h2
                  onDoubleClick={() => setToggleDoubleClickEffect(true)}
                  className={`text-4xl w-full max-w-full font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {projectDeets.title || title}
                </h2>
              ) : (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className={`text-4xl w-full max-w-full font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      setToggleDoubleClickEffect(false);
                      updateTitle(title);
                    }
                  }}
                />
              )}
              {projectDeets && (
                <Kanban
                  headerImage={projectDeets.header_img}
                  projectId={projectDeets.project_id}
                  userStatus={userStatus}
                />
              )}
            </main>
          )}
        </>
      </Layout>
    </ProtectedWrapper>
  );
};

export default Project;
