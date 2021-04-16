import React, { useState } from "react";
import { AiOutlineEllipsis, AiOutlineWarning } from "react-icons/ai";
import DeleteProjectButton from "./deleteProjectButton";
import UsernameDisplay from "./userNameDisplay";
import Modal from "./modal";
import UnsplashImageSearch from "./unsplashImageSearch";

const ProjectDetailsPopup = ({
  data,
  projectId,
  projectOwner,
  sharedUsers,
  projectHeader,
  setProjectHeader,
}) => {
  const [revealImageSearch, setRevealImageSearch] = useState(false);
  return (
    <Modal modalName={<AiOutlineEllipsis size={30} />} contentWidth="450px">
      <p className="text-xl my-3">
        <span>Title:</span> {data.title}
      </p>
      {projectOwner && (
        <p className="flex flex-col">
          Made by: <span>{projectOwner.username}</span>
        </p>
      )}
      {data.created_at && (
        <p className="my-2 flex flex-col">
          <span>Created On:</span>
          {data.created_at.substring(0, 10)}
        </p>
      )}
      <div className="flex flex-col">
        <p className="border-b">Team:</p>
        {sharedUsers.map((user) => (
          <UsernameDisplay username={user.username} width={"w-3/4"} key={user.user_id} />
        ))}
      </div>
      <button
        onClick={() => setRevealImageSearch(!revealImageSearch)}
        className="rounded-md mt-3 px-2 py-1 hover:bg-gray-400 hover:text-black"
      >
        Update Header
      </button>
      <UnsplashImageSearch
        revealImageSearch={revealImageSearch}
        setRevealImageSearch={setRevealImageSearch}
        projectHeader={projectHeader}
        setProjectHeader={setProjectHeader}
        className="right-20 top-5"
      />
      <p className="text-red-500 border-t flex items-center mt-3">
        <span className="mr-3">Danger Zone</span>
        <AiOutlineWarning />
      </p>

      <DeleteProjectButton projectId={projectId} />
    </Modal>
  );
};

export default ProjectDetailsPopup;
