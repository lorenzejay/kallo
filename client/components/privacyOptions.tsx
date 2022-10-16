import axios from "axios";
import { Dispatch, SetStateAction, useContext } from "react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation } from "react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { queryClient } from "../utils/queryClient";

type PrivacyOptionsType = {
  setOpenPrivacyOptions: (
    x: boolean
  ) => void | Dispatch<SetStateAction<boolean>>;
  setIsPrivateProject?: (x: boolean) => void;
  is_private?: boolean;
  projectId?: string | string[];
  className?: string;
  newProject?: boolean;
};

const PrivacyOptions = ({
  setOpenPrivacyOptions,
  setIsPrivateProject,
  is_private,
  projectId,
  className,
  newProject,
}: PrivacyOptionsType) => {
  const auth = useAuth();
  const { userToken } = auth;
  const { isDarkMode } = useContext(DarkModeContext);

  // const userLogin = useSelector((state: RootState) => state.userLogin);
  // const { userInfo } = userLogin;
  const ref = useRef<HTMLDivElement>(null);

  const [response, setResponse] =
    useState<{ success: boolean; message: string }>();

  //update privacy
  const handleUpdatePrivacy = async (projectIsPrivate: boolean) => {
    try {
      if (!userToken || !userToken === null) return;
      const config = configWithToken(userToken);
      const { data } = await axios.put(
        `/api/projects/update-privacy/${projectId}`,
        { is_private: projectIsPrivate },
        config
      );
      setResponse(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const { mutateAsync: updatePrivacy } = useMutation(handleUpdatePrivacy, {
    onSuccess: () =>
      queryClient.invalidateQueries([`projectDeets-${projectId?.toString()}`]),
  });

  // console.log("proejctid", projectId);

  useEffect(() => {
    if (response && response.success === false) {
      window.alert(response.message);
    }
  }, [response]);

  const closePrivacyOptions = () => {
    if (ref.current === null) return;
    document.addEventListener("click", (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenPrivacyOptions(false);
      }
    });
  };
  useEffect(() => {
    closePrivacyOptions();
  }, [ref]);
  // console.log("isPrivateProject", isPrivateProject);
  return (
    <div
      className={`${
        isDarkMode ? "card-color" : "bg-gray-150"
      } text-white absolute w-72 rounded-md p-3 z-30 ${className}`}
      ref={ref}
      onClick={closePrivacyOptions}
    >
      <button
        className="absolute right-1 top-1"
        onClick={() => setOpenPrivacyOptions(false)}
      >
        <AiOutlineClose size={24} />
      </button>
      <p className="text-2xl">Visibility</p>
      {/* {response && response.success === false && <p className='text-red-400'>{response.message}</p>}
      {response && response.success === true && <p className='text-red-400'>{response.message}</p>} */}
      <p className="text-base">Choose who is able to see this board.</p>
      {projectId && !newProject ? (
        <button
          className={`${
            is_private ? "" : "bg-green-300"
          } hover:bg-green-300 transition-all duration-500 rounded-md my-2 p-1`}
          onClick={() => {
            updatePrivacy(false);
            setOpenPrivacyOptions(false);
          }}
        >
          <p>Public</p>
          <p>Anyone can see this board. Only board members can edit</p>
        </button>
      ) : (
        setIsPrivateProject && (
          <button
            className={`${
              is_private ? "" : "bg-green-300"
            } hover:bg-green-300 transition-all duration-500 rounded-md my-2 p-1`}
            onClick={() => {
              setIsPrivateProject(false);
              setOpenPrivacyOptions(false);
            }}
          >
            <p>Public</p>
            <p>Anyone can see this board. Only board members can edit</p>
          </button>
        )
      )}

      {projectId && !newProject ? (
        <button
          className={`${
            is_private ? "bg-red-300" : ""
          } hover:bg-red-300 transition-all duration-500 rounded-md my-2 p-1`}
          onClick={() => {
            updatePrivacy(true);
            setOpenPrivacyOptions(false);
          }}
        >
          <p>Private</p>
          <p>Only board members can see and edit this board.</p>
        </button>
      ) : (
        setIsPrivateProject && (
          <button
            className={`${
              is_private ? "bg-red-300" : ""
            } hover:bg-red-300 transition-all duration-500 rounded-md my-2 p-1`}
            onClick={() => {
              setIsPrivateProject(true);
              setOpenPrivacyOptions(false);
            }}
          >
            <p>Private</p>
            <p>Only board members can see and edit this board.</p>
          </button>
        )
      )}
    </div>
  );
};

export default PrivacyOptions;
