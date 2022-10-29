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
  isPrivate: boolean;
};

type SharedUsers = {
  user_id: string;
  username: string;
};

const ProjectCard = ({
  projectId,
  title,
  headerImg,
  isPrivate,
}: ProjectCardProps) => {
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
        } space-y-2 shadow-xl rounded-md h-auto overflow-hidden cursor-pointer w-auto lg:m-0 md:w-72 max-h-[290px] relative p-3 mt-3 hover:transform hover:shadow-2xl transition-all duration-300 ease-in-out`}
      >
        <div className="w-full md:64 md:h-44 overflow-hidden rounded-md">
          <img
            src={headerImg || "sample-card-img.jpg"}
            className="overflow-hidden hover:scale-125 transition-transform ease-in-out duration-300 mb-2 w-full h-full object-cover"
            alt={title}
          />
        </div>
        <h3 className=" border-black  font-semibold w-full ">{title}</h3>
        <div>
          {isPrivate ? (
            <div className="rounded-md bg-red-300 w-20 py-1 text-center">
              private
            </div>
          ) : (
            <div className="rounded-md bg-green-300 w-20 py-1 text-center">
              public
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-grow justify-start ">
          {/* {sharedUsers &&
            sharedUsers.length !== 0 &&
            sharedUsers.map((user, i) => (
              <p
                key={i}
                className=" bg-blue-125 rounded-full texdt-white-175  mr-3 p-1 w-9 h-9 flex justify-center items-center text-xl font-medium"
              >
                {user.username.substring(0, 1)}
              </p>
            ))} */}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
