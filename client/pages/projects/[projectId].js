import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineEllipsis, AiOutlinePlus } from "react-icons/ai";

import { BsLock, BsUnlock } from "react-icons/bs";
import { useSelector } from "react-redux";
import InviteUsers from "../../components/inviteUsers";
import Kanban from "../../components/kanban";
import Layout from "../../components/layout";
import PrivacyOptions from "../../components/privacyOptions";

const Projects = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userIdentification = useSelector((state) => state.userIdentification);
  const { userId } = userIdentification;

  const [data, setData] = useState({});
  //set is private
  const [isPrivateProject, setIsPrivateProject] = useState(false);
  const [openPrivacyOptions, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [doesUserHaveAccess, setDoesUserHaveAcess] = useState(true);

  //gets the project info on load
  useEffect(() => {
    if (!userInfo) {
      router.push("/signin");
    }
  }, [userInfo]);
  useEffect(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userInfo.token,
      },
    };
    const { data } = await axios.get(`/api/projects/project/${projectId}`, config);

    setData(data);
  }, [projectId, isPrivateProject]);

  //gets who is
  useEffect(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: userInfo.token,
      },
    };
    const { data } = await axios.get(`/api/projects/shared-users/${projectId}`, config);
    setSharedUsers(data);
  }, [projectId]);

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
  console.log("sharedUsers", sharedUsers);

  //  console.log(data);
  if (!doesUserHaveAccess) {
    return (
      <Layout>
        <h2>User does not have access to view this project.</h2>
      </Layout>
    );
  }
  return (
    <Layout>
      <main className="text-white">
        {data && (
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
                      <p className="ml-5 bg-gray-400 rounded-md p-1 w-9 h-9 flex justify-center items-center text-xl font-medium">
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
                />
              </div>

              <button>
                <AiOutlineEllipsis size={30} />
              </button>
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
        <h2 className="text-4xl font-bold mb-2">{data.title}</h2>
        {data.message ? (
          <h3>You do not have access to this file</h3>
        ) : (
          <Kanban headerImage={data.header_img} columnsData={data.columns} projectId={projectId} />
        )}
      </main>
    </Layout>
  );
};

export default Projects;
