import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { queryClient } from "../utils/queryClient";
import supabase from "../utils/supabaseClient";
import { Status } from "../types/projectTypes";

type PrivacyOptionsType = {
  setOpenPrivacyOptions: (
    x: boolean
  ) => void | Dispatch<SetStateAction<boolean>>;
  setIsPrivateProject?: (x: boolean) => void;
  is_private?: boolean;
  projectId?: string | string[];
  className?: string;
  newProject?: boolean;
  userStatus?: Status | undefined;
};

const PrivacyOptions = ({
  setOpenPrivacyOptions,
  setIsPrivateProject,
  is_private,
  projectId,
  className,
  newProject,
  userStatus,
}: PrivacyOptionsType) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const ref = useRef<HTMLDivElement>(null);

  //update privacy
  const handleUpdatePrivacy = async (is_private: boolean) => {
    if (
      !projectId ||
      !userStatus ||
      userStatus === Status.none ||
      userStatus === Status.viewer ||
      userStatus === Status.editor
    )
      return;
    const { data, error } = await supabase
      .from("projects")
      .update({
        is_private,
      })
      .eq("project_id", projectId);
    if (error) throw new Error(error.message);
    return data;
  };
  const { mutateAsync: updatePrivacy } = useMutation(handleUpdatePrivacy, {
    onSuccess: () =>
      queryClient.invalidateQueries([`projectDeets-${projectId?.toString()}`]),
  });

  const closePrivacyOptions = () => {
    if (ref.current === null) return;
    document.addEventListener("click", (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenPrivacyOptions(false);
      }
    });
  };
  useEffect(() => {
    document.addEventListener("mousedown", closePrivacyOptions);
    return () => document.removeEventListener("mousedown", closePrivacyOptions);
  }, [ref]);
  return (
    <div
      className={`${
        isDarkMode ? "card-color" : "bg-gray-150"
      } text-white absolute w-72 rounded-md shadow-2xl p-3 z-30 ${className}`}
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
