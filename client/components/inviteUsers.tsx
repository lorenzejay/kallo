import React, { useContext } from "react";
import { FormEvent, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DarkModeContext } from "../context/darkModeContext";
// import { useAuth } from "../hooks/useAuth";
import { FormResultType } from "../types/projectTypes";
import Loader from "./loader";
import supabase from "../utils/supabaseClient";

type InviteUsersProps = {
  openInviteUsers: boolean;
  setOpenInviteUsers: (x: boolean) => void;
  projectId: string | string[];
  formResult: FormResultType;
};

enum Status {
  admin = "admin",
  viewer = "viewer",
  editor = "editor",
}

const InviteUsers = ({
  openInviteUsers,
  setOpenInviteUsers,
  projectId,
  formResult,
}: InviteUsersProps) => {
  const queryClient = useQueryClient();

  const { isDarkMode } = useContext(DarkModeContext);

  const [status, setStatus] = useState<Status>(Status.viewer);
  const [sharedUser, setSharedUser] = useState("");

  const handleAddSharedUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId || !sharedUser || sharedUser === "") return;
    //check if user is already on the shared_user list
    const { data: sharedUserId, error: sharedUserError } = await supabase
      .from("users")
      .select("user_id")
      .match({ email: sharedUser })
      .single();
    if (sharedUserError) throw new Error(sharedUserError.message);
    const { count, error: countError } = await supabase
      .from("shared_users")
      .select("shared_id", { count: "exact", head: true })
      .match({ shared_project: projectId, shared_user: sharedUserId.user_id });
    if (countError) throw new Error(countError.message);
    if (count && count > 0) return; //user being added is already there
    const { error: insertError } = await supabase.from("shared_users").insert({
      shared_user: sharedUserId.user_id,
      shared_project: projectId,
      status,
    });
    if (insertError) throw new Error(insertError.message);
  };

  //mutation of fetch shared users here
  const { mutateAsync: inviteUser, isLoading } = useMutation(
    handleAddSharedUser,
    {
      onSuccess: () =>
        queryClient.invalidateQueries([`shared-users-${projectId}`]),
    }
  );

  return (
    <form
      className={` rounded-md p-3 flex flex-col absolute w-72 top-36 left-36 ${
        openInviteUsers ? "block" : "hidden"
      } z-10 ${isDarkMode ? "card-color" : "bg-white-150"}`}
      onSubmit={inviteUser}
    >
      <>
        <button
          className="absolute top-1 right-1"
          onClick={() => setOpenInviteUsers(false)}
        >
          <AiOutlineClose size={20} />
        </button>
        <p>Invite User</p>
        {/* {data &&
          (isSuccess === false ? (
            <p className="text-red-500 ">{data.message}</p>
          ) : (
            <p className="text-green-500 ">{data.message}</p>
          ))} */}
        {isLoading && <Loader />}
        <input
          className="p-2 my-3 rounded-md text-black bg-white-175"
          placeholder="User Email Address"
          type="email"
          onChange={(e) => setSharedUser(e.target.value)}
          value={sharedUser}
        />
        <label htmlFor="status_select">Privileges</label>
        <select
          className="status_select text-black my-3 rounded-md focus:outline-none bg-white-175 p-2"
          onChange={(e: any) => setStatus(e.target.value)}
          value={status}
        >
          <option value={Status.viewer}>View Only</option>
          <option value={Status.editor}>Editor</option>
          <option value={Status.admin}>Admin</option>
        </select>
        <button className="bg-blue-500 px-3 py-1 rounded-md" type="submit">
          Invite
        </button>
        {formResult && formResult.success === false && (
          <p className="text-red-500 text-xs">{formResult.message}</p>
        )}
        {formResult && formResult.success === true && (
          <p className="text-blue-500 text-xs">{formResult.message}</p>
        )}
      </>
    </form>
  );
};

export default React.memo(InviteUsers);
