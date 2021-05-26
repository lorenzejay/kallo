import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";

const ProjectCard = ({ projectId, title, headerImg, projectOwner }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [sharedUsers, setSharedUsers] = useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(async () => {
    if (!projectId) return;
    const config = configWithToken(userInfo.token);
    const { data } = await axios.get(`/api/projects/shared-users/${projectId}`, config);

    setSharedUsers(data);
  }, [projectId]);

  return (
    <Link href={`/projects/${projectId}`} key={projectId}>
      <div
        className={`${
          isDarkMode ? "card-color" : "bg-gray-50"
        } shadow-xl rounded-md h-auto cursor-pointer w-96 md:w-72 relative p-3 pb-10 mt-3 hover:transform hover:shadow-2xl transition-all duration-500 ease-in-out`}
      >
        <img
          src={headerImg || "sample-card-img.jpg"}
          className="rounded-md mb-2 w-full h-44 object-cover"
          alt={title}
        />
        <h3 className=" border-black  font-semibold w-full ">{title}</h3>
        <div className="mt-3 flex flex-grow justify-start ">
          {sharedUsers &&
            sharedUsers.length !== 0 &&
            sharedUsers.map((user) => (
              <p className=" bg-gray-400 rounded-md mr-3 p-1 w-9 h-9 flex justify-center items-center text-xl font-medium">
                {user.username.substring(0, 1)}
              </p>
            ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
