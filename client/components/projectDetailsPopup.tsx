import React, { useState } from "react";
import { AiOutlineEllipsis, AiOutlineWarning } from "react-icons/ai";
import DeleteProjectButton from "./deleteProjectButton";
import UsernameDisplay from "./userNameDisplay";
import UnsplashImageSearch from "./unsplashImageSearch";
import Dropdown from "./dropdown";
import { Projects, SharedUsers } from "../types/projectTypes";

export type ProjectDetailsPopup = {
  data: Projects;
  projectId: string;
  projectOwner: { username: string };
  projectHeader: string;
  sharedUsers: SharedUsers[];
  setProjectHeader: (x: string) => void;
};

const ProjectDetailsPopup = ({
  data,
  projectId,
  projectOwner,
  sharedUsers,
  // projectHeader,
  setProjectHeader,
}: ProjectDetailsPopup) => {
  const [revealImageSearch, setRevealImageSearch] = useState(false);
  // console.log("projectOwner", projectOwner);
  return (
    <Dropdown
      title={<AiOutlineEllipsis size={30} />}
      className={"right-0 z-10"}
      hoverable={false}
      showArrow={false}
      width={"w-64"}
    >
      <>
        <p className="text-2xl my-3">
          <span className="font-bold">Title:</span> {data.title}
        </p>
        {projectOwner && (
          <p className="flex flex-col">
            Made by: <span className="font-bold">{projectOwner.username}</span>
          </p>
        )}
        {data.created_at && (
          <p className="my-2 flex flex-col">
            <span className="font-bold">Created On:</span>
            {data.created_at.substring(0, 10)}
          </p>
        )}
        <div className="flex flex-col">
          <span className="font-bold">Team:</span>
          {sharedUsers &&
            sharedUsers.map((user) => (
              <UsernameDisplay
                username={user.username}
                width={"w-3/4"}
                key={user.user_id}
              />
            ))}
        </div>
        <button
          onClick={() => setRevealImageSearch(!revealImageSearch)}
          className="rounded-md my-3 px-2 py-1 bg-gray-400 hover:bg-blue-500 hover:text-white text-black transition-all duration-500 "
        >
          Update Header
        </button>
        <UnsplashImageSearch
          revealImageSearch={revealImageSearch}
          setRevealImageSearch={setRevealImageSearch}
          // projectHeader={projectHeader}
          setProjectHeader={setProjectHeader}
          className="right-20 top-5"
        />
        <hr />
        <p className="text-red-500  flex items-center mt-3">
          <span className="mr-3">Danger Zone</span>
          <AiOutlineWarning />
        </p>

        <DeleteProjectButton projectId={projectId} />
      </>
    </Dropdown>
  );
};

export default ProjectDetailsPopup;
