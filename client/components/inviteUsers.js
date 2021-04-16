import axios from "axios";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { configWithToken } from "../functions";

const InviteUsers = ({
  openInviteUsers,
  setOpenInviteUsers,
  projectId,
  formResult,
  setFormResult,
}) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [canEdit, setCanEdit] = useState(false);
  const [sharedUser, setSharedUser] = useState("");
  // const [formResult, setFormResult] = useState({});

  const handleInviteUsers = async (e) => {
    e.preventDefault();
    if (sharedUser === "") return;

    const config = configWithToken(userInfo.token);
    const { data } = await axios.post(
      `/api/projects/share/${projectId}`,
      { shared_user_email: sharedUser, can_edit: canEdit },
      config
    );

    setFormResult(data);
  };
  // console.log(formResult);
  //   console.log(sharedUser);
  return (
    <form
      className={`rounded-md p-3 flex flex-col absolute w-72 ${
        openInviteUsers ? "block" : "hidden"
      } z-10`}
      style={{ background: "#3F4447" }}
      onSubmit={handleInviteUsers}
    >
      <button className="absolute top-1 right-1" onClick={() => setOpenInviteUsers(false)}>
        <AiOutlineClose size={20} />
      </button>
      <p>Invite User</p>
      <input
        className="px-3 py-1 my-3 rounded-md text-black"
        placeholder="User Email Address"
        type="email"
        onChange={(e) => setSharedUser(e.target.value)}
        value={sharedUser}
      />
      <select
        onChange={(e) => setCanEdit(e.target.value)}
        className="text-black my-3 rounded-md focus:outline-none"
      >
        <option value={false}>View Only</option>
        <option value={true}>Edit</option>
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
    </form>
  );
};

export default InviteUsers;
