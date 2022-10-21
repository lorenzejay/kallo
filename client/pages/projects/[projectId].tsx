import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsUnlock } from "react-icons/bs";
import { useMutation, useQuery } from "@tanstack/react-query";
// import InviteUsers from "../../components/inviteUsers";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";
import { DarkModeContext } from "../../context/darkModeContext";
import { ProjectDeets, UserProjectAccess } from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";
import supabase from "../../utils/supabaseClient";
import useUser from "../../hooks/useUser";
import ProtectedWrapper from "../../components/Protected";

export type ProjectOwner = {
  username: string;
};

const Project = () => {
  // const { userToken, user } = auth;
  const { data: user } = useUser();
  const router = useRouter();
  const { projectId } = router.query;
  const { isDarkMode } = useContext(DarkModeContext);
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  const [userStatus, setUserStatus] = useState<UserProjectAccess>(
    {} as UserProjectAccess
  );
  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user]);

  // const fetchUsersProjectAccess = async () => {
  //   try {
  //     if ( !projectId) return;
  //     // const config = configWithToken(userToken);
  //     // const { data } = await axios.get(
  //     //   `/api/projects/user-project-access/${projectId}`,
  //     //   config
  //     // );

  //     // setUserStatus(data);
  //     // return data;
  //   } catch (error) {
  //     return error;
  //   }
  // };
  // useEffect(() => {
  //   fetchUsersProjectAccess();
  // }, [projectId]);
  // const [projectDeets, setProjectDeets] = useState<ProjectDeets>({} as ProjectDeets)
  const getProjectDeets = async () => {
    if (!projectId) return;
    const { data, error } = await supabase
      .from("projects")
      .select()
      .eq("project_id", projectId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  const { data: projectDeets, isLoading: loadingProjectDetails } =
    useQuery<ProjectDeets>([`projectDeets-${projectId}`], getProjectDeets, {
      enabled: !!projectId,
    });

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

  // const fetchProjectOwner = async () => {
  //   if (!userToken || !projectDeets || !projectId) return;

  //   const config = configWithToken(userToken);
  //   const { data } = await axios.get<string>(
  //     `/api/projects/project-owner/${projectDeets.project_owner}`,
  //     config
  //   );
  //   return data;
  // };
  // const fetchProjectSharedUsers = async () => {
  //   try {
  //     if (!userToken || !projectId) return;

  //     const config = configWithToken(userToken);
  //     const { data } = await axios.get(
  //       `/api/sharing/list-of-shared-users/${projectId.toString()}`,
  //       config
  //     );
  //     return data;
  //   } catch (error) {
  //     return error;
  //   }
  // };
  // const { data: project_owner } = useQuery("username", fetchProjectOwner);
  // const { data: shared_users, isError: shared_users_error } = useQuery<
  //   SharedUsers[]
  // >(`shared-users-${projectId?.toString()}`, fetchProjectSharedUsers);

  const [title, setTitle] = useState(projectDeets?.title || "Untitled");
  //set is private
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);

  // const [formResult] = useState<FormResultType>({} as FormResultType);
  //add to set state in order to update state
  useEffect(() => {
    if (projectDeets && projectDeets.title) {
      setTitle(projectDeets.title);
    }
  }, [projectDeets]);

  if (!projectId) return <h1>There is no project</h1>;

  if (userStatus && !userStatus.access && projectDeets?.is_private) {
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
    <>
      <Head>
        {projectDeets ? (
          <title>{projectDeets.title} | Kallo</title>
        ) : (
          <title>Kallo</title>
        )}
      </Head>
      <Layout>
        <ProtectedWrapper>
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
                        {/* {!shared_users_error &&
                          Array.isArray(shared_users) &&
                          shared_users.map((user, i) => (
                            <SharedUserList
                              user_id={user.shared_user}
                              key={i}
                            />
                          ))} */}
                        <button
                          className="bg-blue-125 text-white-125 mr-3 rounded-full ml-3 p-1 w-9 h-9 r flex justify-center items-center"
                          onClick={() => setOpenInviteUsers(!openInviteUsers)}
                        >
                          <AiOutlinePlus size={21} />
                        </button>
                      </div>
                      {/* <InviteUsers
                        openInviteUsers={openInviteUsers}
                        setOpenInviteUsers={setOpenInviteUsers}
                        projectId={projectId}
                        formResult={formResult}
                      /> */}
                    </div>

                    {/* {projectDeets && (
                      <ProjectDetailsPopup
                        data={projectDeets}
                        projectId={projectDeets.project_id}
                        projectOwner={project_owner ? project_owner : ""}
                        sharedUsers={shared_users}
                        projectTitle={projectDeets.title}
                      />
                    )} */}
                  </div>
                  {/* {openPrivacyOptions && (
                    <PrivacyOptions
                      is_private={projectDeets.is_private}
                      setOpenPrivacyOptions={setOpenPrivacyOptions}
                      projectId={projectId}
                    />
                  )} */}
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
                />
              )}
            </main>
          )}
        </ProtectedWrapper>
      </Layout>
    </>
  );
};

export default Project;
