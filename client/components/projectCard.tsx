import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import { RootState } from "../redux/store";

type ProjectCardProps = {
  projectId: string;
  title: string;
  headerImg: string;
};

type SharedUsers = {
  user_id: string;
  username: string;
};

const ProjectCard = ({ projectId, title, headerImg }: ProjectCardProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [sharedUsers, setSharedUsers] = useState<SharedUsers[]>();
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const getSharedUsers = async () => {
    try {
      if (!userInfo || !projectId || !userInfo.token) return;

      const config = configWithToken(userInfo.token);
      const { data } = await axios.get(
        `/api/projects/shared-users/${projectId}`,
        config
      );
      setSharedUsers(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getSharedUsers();
  }, []);

  return (
    <Link href={`/projects/${projectId}`} key={projectId}>
      <div
        className={`${
          isDarkMode ? "card-color" : "bg-gray-150"
        } shadow-xl rounded-md h-auto cursor-pointer w-auto lg:m-0 md:w-72 relative p-3 pb-10 mt-3 hover:transform hover:shadow-2xl transition-all duration-300 ease-in-out`}
      >
        <img
          src={headerImg || "sample-card-img.jpg"}
          className="rounded-md mb-2 w-full md:64 md:h-44 object-cover"
          alt={title}
        />
        <h3 className=" border-black  font-semibold w-full ">{title}</h3>
        <div className="mt-3 flex flex-grow justify-start ">
          {sharedUsers &&
            sharedUsers.length !== 0 &&
            sharedUsers.map((user, i) => (
              <p
                key={i}
                className=" bg-blue-125 rounded-full texdt-white-175  mr-3 p-1 w-9 h-9 flex justify-center items-center text-xl font-medium"
              >
                {user.username.substring(0, 1)}
              </p>
            ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
