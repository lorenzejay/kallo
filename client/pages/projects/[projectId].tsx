import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsUnlock } from "react-icons/bs";
import { useSelector } from "react-redux";
import InviteUsers from "../../components/inviteUsers";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";
import PrivacyOptions from "../../components/privacyOptions";
import ProjectDetailsPopup from "../../components/projectDetailsPopup";
import { DarkModeContext } from "../../context/darkModeContext";

import { configWithToken } from "../../functions";
import { RootState } from "../../redux/store";
import {
  FormResultType,
  Projects as ProjectTypes,
  SharedUsers,
} from "../../types/projectTypes";

export type ProjectOwner = {
  username: string;
};

const Projects = () => {
  const router = useRouter();
  const { projectId } = router.query;
  projectId?.toString();
  const { isDarkMode } = useContext(DarkModeContext);

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const userIdentification = useSelector(
    (state: RootState) => state.userIdentification
  );
  const { userId } = userIdentification;

  const [data, setData] = useState<ProjectTypes>({} as ProjectTypes);
  const [projectOwner, setProjectOwner] = useState<ProjectOwner>(
    {} as ProjectOwner
  );
  //set is private
  const [isPrivateProject, setIsPrivateProject] = useState(false);
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUsers[]>(
    [] as SharedUsers[]
  );
  const [doesUserHaveAccess, setDoesUserHaveAcess] = useState(true);
  //sharing to other users so we can call on this to refresh the shared user list

  const [formResult, setFormResult] = useState<FormResultType>(
    {} as FormResultType
  );

  const [projectHeader, setProjectHeader] = useState(data.header_img);

  //gets the project info on load
  useEffect(() => {
    if (!userInfo || userInfo === null) {
      router.push("/signin");
    }
  }, [userInfo]);
  //get the project owner
  const getOwnerOfProject = async () => {
    try {
      if (projectId) {
        const { data } = await axios.get(
          `/api/projects/project-owner/${projectId}`
        );
        if (data) {
          setProjectOwner(data);
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("error in getting the owner of the project");
    }
  };
  useEffect(() => {
    getOwnerOfProject();
  }, [projectId]);

  //get the project
  const getProjectFromId = async () => {
    try {
      if (!userInfo || userInfo.token === null) return;
      const config = configWithToken(userInfo.token);
      if (projectId) {
        const { data } = await axios.get(
          `/api/projects/project/${projectId}`,
          config
        );
        // console.log(data);
        setData(data);
      }
    } catch (error) {
      throw new Error("Error getting project details.");
    }
  };
  useEffect(() => {
    getProjectFromId();
  }, [projectId, isPrivateProject]);

  //gets users who are  available to access this file
  const getAvailableOtherUsers = async () => {
    if (!userInfo || userInfo.token === null) return;
    const config = configWithToken(userInfo.token);
    if (projectId) {
      const { data } = await axios.get(
        `/api/projects/shared-users/${projectId}`,
        config
      );
      setSharedUsers(data);
    }
  };
  useEffect(() => {
    getAvailableOtherUsers();
  }, [projectId, formResult]);

  //make sure you have access to this page
  useEffect(() => {
    //check if the page is private
    if (data) {
      if (data.is_private) {
        //check if the loggedIn user is a viewer
        if (userId) {
          if (!sharedUsers) return;
          const hasAccess = sharedUsers.some(
            (user) => user.user_id === userId.user_id
          );
          setDoesUserHaveAcess(hasAccess);
        }
      } else {
        setDoesUserHaveAcess(true);
      }
    }
  }, [sharedUsers, data, userId]);

  const updateHeader = async () => {
    try {
      if (!projectHeader || !userInfo || userInfo.token === null) return;
      const config = configWithToken(userInfo.token);
      //update the projectHeader on change
      await axios.put(
        `/api/projects/update-header-img/${projectId}`,
        { header_img: projectHeader },
        config
      );
    } catch (error) {
      throw new Error("Failed to update header image.");
    }
  };
  useEffect(() => {
    // console.log(projectHeader);
    updateHeader();
  }, [projectHeader]);

  if (doesUserHaveAccess === false) {
    return (
      <Layout>
        <h2>User does not have access to view this project.</h2>
      </Layout>
    );
  }
  console.log("formResult", formResult);
  console.log("data", data);
  if (!projectId) return <h1>There is no project</h1>;
  console.log(typeof projectId);
  return (
    <>
      <Head>{data && <title>{data.title} | Kallo</title>}</Head>
      <Layout>
        <main className="text-white min-h-screen">
          {data && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    className={`${
                      isDarkMode ? "bg-gray-500" : "bg-gray-125"
                    }  rounded-md px-2 py-1 w-24 my-2`}
                    onClick={() => setOpenPrivacyOptions(true)}
                  >
                    {data.is_private ? (
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
                    <button
                      className="bg-blue-125 text-white-125 rounded-full ml-3 p-1 w-9 h-9 r flex justify-center items-center"
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
                    setFormResult={setFormResult}
                  />
                </div>

                {data && (
                  <ProjectDetailsPopup
                    data={data}
                    projectId={projectId.toString()}
                    projectOwner={projectOwner}
                    sharedUsers={sharedUsers}
                    projectHeader={projectHeader}
                    setProjectHeader={setProjectHeader}
                  />
                )}
              </div>
              {openPrivacyOptions && (
                <PrivacyOptions
                  is_private={data.is_private}
                  setIsPrivateProject={setIsPrivateProject}
                  openPrivacyOptions={openPrivacyOptions}
                  setOpenPrivacyOptions={setOpenPrivacyOptions}
                  isPrivateProject={isPrivateProject}
                  projectId={projectId}
                />
              )}
            </>
          )}
          <h2
            className={`text-4xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {data.title}
          </h2>
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
          {!data ? (
            <h3>You do not have access to this file</h3>
          ) : projectId ? (
            <Kanban
              headerImage={projectHeader || data.header_img}
              // columnsData={data.columns}
              projectId={projectId.toString()}
            />
          ) : (
            ""
          )}
        </main>
      </Layout>
    </>
  );
};

export default Projects;
