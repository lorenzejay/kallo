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

const Projects = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { isDarkMode } = useContext(DarkModeContext);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userIdentification = useSelector((state) => state.userIdentification);
  const { userId } = userIdentification;

  const [data, setData] = useState({});
  const [projectOwner, setProjectOwner] = useState();
  //set is private
  const [isPrivateProject, setIsPrivateProject] = useState(false);
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [doesUserHaveAccess, setDoesUserHaveAcess] = useState(true);
  //sharing to other users so we can call on this to refresh the shared user list
  const [formResult, setFormResult] = useState({});

  const [projectHeader, setProjectHeader] = useState(data.header_img);

  //gets the project info on load
  useEffect(() => {
    if (!userInfo) {
      router.push("/signin");
    }
  }, [userInfo]);

  //get the project owner
  useEffect(async () => {
    try {
      if (projectId) {
        const { data } = await axios.get(`/api/projects/project-owner/${projectId}`);
        if (data) {
          setProjectOwner(data);
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("error in getting the owner of the project");
    }
  }, [projectId]);

  useEffect(async () => {
    const config = configWithToken(userInfo.token);
    if (projectId) {
      const { data } = await axios.get(`/api/projects/project/${projectId}`, config);
      // console.log(data);
      setData(data);
    }
  }, [projectId, isPrivateProject]);

  //gets who is available to access this file
  useEffect(async () => {
    const config = configWithToken(userInfo.token);
    if (projectId) {
      const { data } = await axios.get(`/api/projects/shared-users/${projectId}`, config);
      setSharedUsers(data);
    }
  }, [projectId, formResult]);

  //make sure you have access to this page
  useEffect(() => {
    //check if the page is private
    if (data) {
      if (data.is_private) {
        //check if the loggedIn user is a viewer
        if (userId) {
          const hasAccess = sharedUsers.some((user) => user.user_id === userId.user_id);
          setDoesUserHaveAcess(hasAccess);
        }
      } else {
        setDoesUserHaveAcess(true);
      }
    }
  }, [sharedUsers, data, userId]);

  useEffect(async () => {
    // console.log(projectHeader);
    if (!projectHeader) return;
    const config = configWithToken(userInfo.token);
    //update the projectHeader on change
    await axios.put(
      `/api/projects/update-header-img/${projectId}`,
      { header_img: projectHeader },
      config
    );
  }, [projectHeader]);
  // console.log("sharedUsers", sharedUsers);
  // console.log("data", data);
  // console.log("doesUserHaveAccess", doesUserHaveAccess);

  // console.log("projectId", projectId);

  if (doesUserHaveAccess === false) {
    return (
      <Layout>
        <h2>User does not have access to view this project.</h2>
      </Layout>
    );
  }
  return (
    <>
      <Head>{data && <title>{data.title} | Kallo</title>}</Head>
      <Layout>
        <main className="text-white min-h-screen">
          {data && !data.message && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    className="bg-gray-500 rounded-md px-2 py-1 w-24 my-2"
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
                          className="ml-5 bg-gray-400 rounded-md p-1 w-9 h-9 flex justify-center items-center text-xl font-medium"
                          key={user.user_id}
                        >
                          {user.username.substring(0, 1).toUpperCase()}
                        </p>
                      ))}
                    <button
                      className="bg-blue-500 ml-3 p-1 w-9 h-9 rounded-md flex justify-center items-center"
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
                    projectId={projectId}
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
          <h2 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>
            {data.title}
          </h2>
          {data.message ? (
            <h3>{data.message}</h3>
          ) : projectId ? (
            <Kanban
              headerImage={projectHeader || data.header_img}
              columnsData={data.columns}
              projectId={projectId}
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
