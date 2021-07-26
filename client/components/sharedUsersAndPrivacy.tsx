import React, { useState } from "react";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLock, BsUnlock } from "react-icons/bs";
import { DarkModeContext } from "../context/darkModeContext";
import { SharedUsers } from "../types/projectTypes";

type SharedUsersAndPrivacyProps = {
  is_private: boolean;
};

const SharedUsersAndPrivacy = ({ is_private }: SharedUsersAndPrivacyProps) => {
  // const [isPrivateProject, setIsPrivateProject] = useState(false);
  const [_, setOpenPrivacyOptions] = useState(false);
  const [openInviteUsers, setOpenInviteUsers] = useState(false);
  const [sharedUsers] = useState<SharedUsers[]>([] as SharedUsers[]);

  //get all shared users for the project
  //update the status of the project from this component itself
  //add users as shared users

  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="flex items-center">
      <button
        className={`${
          isDarkMode ? "bg-gray-500" : "bg-gray-125"
        }  rounded-md px-2 py-1 w-24 my-2`}
        onClick={() => setOpenPrivacyOptions(true)}
      >
        {is_private ? (
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
      {/* <InviteUsers
        openInviteUsers={openInviteUsers}
        setOpenInviteUsers={setOpenInviteUsers}
        projectId={projectId}
        formResult={formResult}
        setFormResult={setFormResult}
      /> */}
    </div>
  );
};

export default SharedUsersAndPrivacy;
