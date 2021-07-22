import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsUnlock } from "react-icons/bs";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import InviteUsers from "../../components/inviteUsers";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";
import Loader from "../../components/loader";
import PrivacyOptions from "../../components/privacyOptions";
import ProjectDetailsPopup from "../../components/projectDetailsPopup";
import { DarkModeContext } from "../../context/darkModeContext";
import { configWithToken } from "../../functions";
import { RootState } from "../../redux/store";
import {
  FormResultType,
  ProjectDeets,
  SharedUsers,
} from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";

export type ProjectOwner = {
  username: string;
};

const Project = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { isDarkMode } = useContext(DarkModeContext);
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);

  const getProjectDeets = async () => {
    if (!projectId) return;

    const { data } = await axios.get<ProjectDeets>(
      `/api/projects/project-assets/${projectId}`
    );
    return data;
  };
  const { data: projectDeets, isLoading } = useQuery(
    `projectDeets-${projectId?.toString()}`,
    getProjectDeets
  );

  const updateProjectTitle = async (title: string) => {
    try {
      if (!userInfo || !userInfo.token) return;
      if (!projectId) return;
      const config = configWithToken(userInfo.token);

      await axios.put(
        `/api/projects/update-project-title/${projectId}`,
        { title: title },
        config
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
    try {
      if (!userInfo || !userInfo.token || !projectDeets) return;
      if (!projectId) return;
      const config = configWithToken(userInfo.token);
      const { data } = await axios.get<string>(
        `/api/projects/project-owner/${projectDeets.project_owner}`,
        config
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const { data: project_owner } = useQuery("username", fetchProjectOwner);

  const [title, setTitle] = useState(projectDeets?.project_title || "Untitled");
  //set is private
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUsers[]>(
    [] as SharedUsers[]
  );
  // const [doesUserHaveAccess, setDoesUserHaveAcess] = useState(true);
  //sharing to other users so we can call on this to refresh the shared user list

  const [formResult, setFormResult] = useState<FormResultType>(
    {} as FormResultType
  );

  //gets the project info on load
  useEffect(() => {
    if (!userInfo || userInfo === null) {
      router.push("/signin");
    }
  }, [userInfo]);

  //add to set state in order to update state
  useEffect(() => {
    if (projectDeets && projectDeets.project_title) {
      setTitle(projectDeets.project_title);
    }
  }, [projectDeets]);
  // console.log("projectHeader", projectHeader);

  // if (doesUserHaveAccess === false) {
  //   return (
  //     <Layout>
  //       <h2>User does not have access to view this project.</h2>
  //     </Layout>
  //   );
  // }

  if (!projectId) return <h1>There is no project</h1>;

  return (
    <>
      <Head>
        {projectDeets && <title>{projectDeets.project_title} | Kallo</title>}
      </Head>
      <Layout>
        {/* <> */}
        <main className="text-white min-h-screen">
          {isLoading && <Loader />}
          {projectDeets && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    className={`${
                      isDarkMode ? "bg-gray-500" : "bg-gray-125"
                    }  rounded-md px-2 py-1 w-24 my-2`}
                    onClick={() => setOpenPrivacyOptions(!openPrivacyOptions)}
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
                  <div className="flex">
                    {sharedUsers &&
                      sharedUsers.map((user) => (
                        <p
                          className="ml-5 shadow-xl bg-orange-125 text-white-175 rounded-full p-1 w-9 h-9 flex justify-center items-center text-xl font-medium"
                          key={user.user_id}
                        >
                          {user.username.substring(0, 1).toUpperCase()}
                        </p>
                      ))}
                    {/* <button
                      className="bg-blue-125 text-white-125 rounded-full ml-3 p-1 w-9 h-9 r flex justify-center items-center"
                      onClick={() => setOpenInviteUsers(!openInviteUsers)}
                    >
                      <AiOutlinePlus size={21} />
                    </button> */}
                  </div>
                  <InviteUsers
                    openInviteUsers={openInviteUsers}
                    setOpenInviteUsers={setOpenInviteUsers}
                    projectId={projectId}
                    formResult={formResult}
                    setFormResult={setFormResult}
                  />
                </div>

                {projectDeets && (
                  <ProjectDetailsPopup
                    data={projectDeets}
                    projectId={projectDeets.project_id}
                    projectOwner={project_owner ? project_owner : ""}
                    sharedUsers={sharedUsers}
                    projectTitle={projectDeets.project_title}
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
              {title}
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
          {/* {!isError && <p>Something went wrong please try again</p>} */}
          {/* {data.message ? (
            <h3>{data.message}</h3>
          ) : projectId ? (
            <Kanban
              headerImage={projectHeader || data.header_img}
              columnsData={data.columns}
              projectId={projectId}
            />
          ) : (
            ""
          )} */}
          {/* {!data ? (
            <h3>You do not have access to this file</h3>
          ) : projectId ? (
            <Kanban
              headerImage={projectHeader || data.header_img}
              // columnsData={data.columns}
              projectId={projectId.toString()}
            />
          ) : (
            ""
          )} */}
        </main>
        {/* </> */}
      </Layout>
    </>
  );
};

export default Project;
