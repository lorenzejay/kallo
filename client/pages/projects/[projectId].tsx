import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsUnlock } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import InviteUsers from "../../components/inviteUsers";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";
import Loader from "../../components/loader";
import PrivacyOptions from "../../components/privacyOptions";
import ProjectDetailsPopup from "../../components/projectDetailsPopup";
import SharedUserList from "../../components/SharedUserList";
import { DarkModeContext } from "../../context/darkModeContext";
import { configWithToken } from "../../functions";
import { useAuth } from "../../hooks/useAuth";
import {
  FormResultType,
  ProjectDeets,
  SharedUsers,
  UserProjectAccess,
} from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";

export type ProjectOwner = {
  username: string;
};

const Project = () => {
  const auth = useAuth();
  const { userToken } = auth;
  const router = useRouter();
  const { projectId } = router.query;
  const { isDarkMode } = useContext(DarkModeContext);
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  const [userStatus, setUserStatus] = useState<UserProjectAccess>(
    {} as UserProjectAccess
  );

  const fetchUsersProjectAccess = async () => {
    try {
      if (!userToken || !projectId) return;
      const config = configWithToken(userToken);
      const { data } = await axios.get(
        `/api/projects/user-project-access/${projectId}`,
        config
      );

      setUserStatus(data);
      return data;
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    fetchUsersProjectAccess();
  }, [projectId]);

  const getProjectDeets = async () => {
    try {
      if (!projectId) return;
      if (!userToken || userToken === null) return;
      const config = configWithToken(userToken);
      const { data } = await axios.get<ProjectDeets>(
        `/api/projects/project-assets/${projectId}`,
        config
      );

      if (!data) {
        return undefined;
      }
      return data;
    } catch (error) {
      // console.log("errir", error);
      return error;
    }
  };
  const { data: projectDeets, isLoading } = useQuery<ProjectDeets>(
    `projectDeets-${projectId?.toString()}`,
    getProjectDeets
  );

  const updateProjectTitle = async (title: string) => {
    try {
      if (!userToken) return;
      if (!projectId) return;
      const config = configWithToken(userToken);

      const { data } = await axios.put(
        `/api/projects/update-project-title/${projectId}`,
        { title },
        config
      );
      if (!data)
        return window.alert(
          "You do not have privileges to update the project title."
        );
    } catch (error) {
      console.error(error);
    }
  };
  const { mutateAsync: updateTitle } = useMutation(updateProjectTitle, {
    onSuccess: () => queryClient.invalidateQueries(`projectDeets-${projectId}`),
  });

  // console.log("projectDeets", projectDeets);
  const fetchProjectOwner = async () => {
    if (!userToken || !projectDeets || !projectId) return;

    const config = configWithToken(userToken);
    const { data } = await axios.get<string>(
      `/api/projects/project-owner/${projectDeets.project_owner}`,
      config
    );
    return data;
  };
  const fetchProjectSharedUsers = async () => {
    try {
      if (!userToken || !projectId) return;

      const config = configWithToken(userToken);
      const { data } = await axios.get(
        `/api/sharing/list-of-shared-users/${projectId.toString()}`,
        config
      );
      return data;
    } catch (error) {
      return error;
    }
  };
  const { data: project_owner } = useQuery("username", fetchProjectOwner);
  const { data: shared_users, isError: shared_users_error } = useQuery<
    SharedUsers[]
  >(`shared-users-${projectId?.toString()}`, fetchProjectSharedUsers);

  const [title, setTitle] = useState(projectDeets?.title || "Untitled");
  //set is private
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);

  const [formResult] = useState<FormResultType>({} as FormResultType);

  //gets the project info on load
  useEffect(() => {
    if (userToken === null) {
      router.push("/signin");
    }
  }, [userToken]);

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
        <>
          {isLoading && <Loader />}
          {projectDeets && (
            <main
              className={`text-white min-h-screen ${
                isDarkMode ? "dark-body" : "bg-white-175"
              } `}
            >
              {isLoading && <Loader />}

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
                        {!shared_users_error &&
                          Array.isArray(shared_users) &&
                          shared_users.map((user, i) => (
                            <SharedUserList
                              user_id={user.shared_user}
                              key={i}
                            />
                          ))}
                        <button
                          className="bg-blue-125 text-white-125 mr-3 rounded-full ml-3 p-1 w-9 h-9 r flex justify-center items-center"
                          onClick={() => setOpenInviteUsers(!openInviteUsers)}
                        >
                          <AiOutlinePlus size={21} />
                        </button>
                      </div>
                      <InviteUsers
                        openInviteUsers={openInviteUsers}
                        setOpenInviteUsers={setOpenInviteUsers}
                        projectId={projectId}
                        formResult={formResult}
                      />
                    </div>

                    {projectDeets && (
                      <ProjectDetailsPopup
                        data={projectDeets}
                        projectId={projectDeets.project_id}
                        projectOwner={project_owner ? project_owner : ""}
                        sharedUsers={shared_users}
                        projectTitle={projectDeets.title}
                      />
                    )}
                  </div>
                  {openPrivacyOptions && (
                    <PrivacyOptions
                      is_private={projectDeets.is_private}
                      setOpenPrivacyOptions={setOpenPrivacyOptions}
                      projectId={projectId}
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
                    updateTitle(e.target.value);
                  }}
                  className={`text-4xl w-full max-w-full font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      setToggleDoubleClickEffect(false);
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
        </>
      </Layout>
    </>
  );
};

export default Project;
