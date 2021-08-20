import axios from "axios";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { useContext } from "react";
import { useMutation } from "react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { BoardColumns, ReturnedApiStatus } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";
import Loader from "./loader";

type NewItemProps = {
  openNewItem: boolean;
  setOpenNewItem: (x: boolean) => void;
  newItemTitle: string;
  setNewItemTitle: Dispatch<SetStateAction<string>>;
  column: BoardColumns;
  projectId: string;
};

const NewTask = ({
  openNewItem,
  setOpenNewItem,
  newItemTitle,
  setNewItemTitle,
  column,
  projectId,
}: NewItemProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const { userToken } = auth;

  const createNewTask = async () => {
    try {
      if (!userToken || !column.column_id || !projectId) return;
      const config = configWithToken(userToken);
      const { data } = await axios.post<ReturnedApiStatus | undefined>(
        `/api/tasks/create-task/${projectId}/${column.column_id}`,
        {
          title: newItemTitle,
        },
        config
      );
      console.log(data);
      if (!data)
        return window.alert("You do not have access to create a new task.");
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const {
    mutateAsync: newTask,
    isLoading,
    isError,
    error,
  } = useMutation(createNewTask, {
    onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
  });
  const handleAddItem = () => {
    newTask()
      .then(() => {
        setOpenNewItem(false);
        setNewItemTitle("");
      })
      .catch((err) => console.error(err));
  };

  if (isLoading) {
    return <Loader size="w-10" />;
  } else if (isError && error) {
    return (
      <p className="text-red-500 rounded-md bg-white-175">{error as string}</p>
    );
  } else {
    return (
      <div
        className={`${
          isDarkMode ? "card-color" : "bg-gray-150"
        } my-3 p-3 w-64 rounded-md ${openNewItem ? "block" : "hidden"}`}
        style={{ zIndex: 20 }}
      >
        <textarea
          placeholder="Enter Title"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          className={`p-2 my-3 w-full ${
            isDarkMode
              ? "card-color placeholder-white"
              : "bg-gray-150 placeholder-black"
          }`}
        />
        <div className="flex float-right">
          <button
            onClick={() => setOpenNewItem(false)}
            className={`mr-1 ? ${
              isDarkMode ? "bg-red-400" : "bg-red-200"
            } rounded-md p-2`}
          >
            Cancel
          </button>
          <button
            onClick={handleAddItem}
            disabled={newItemTitle === ""}
            className={`p-2 ${
              isDarkMode ? "bg-gray-400" : "bg-gray-200"
            } rounded-md hover:bg-gray-120 hover:text-white-150  disabled:opacity-50 transition-all duration-500 ease-in-out`}
          >
            Add Item
          </button>
        </div>
      </div>
    );
  }
};

export default NewTask;
