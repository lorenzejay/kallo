import { SetStateAction } from "react";
import { Dispatch } from "react";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { ColumnsWithTasksType, Status } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";
import Loader from "./loader";
import supabase from "../utils/supabaseClient";

type NewItemProps = {
  openNewItem: boolean;
  setOpenNewItem: (x: boolean) => void;
  newItemTitle: string;
  setNewItemTitle: Dispatch<SetStateAction<string>>;
  column: ColumnsWithTasksType;
  projectId: string;
  userStatus: Status | undefined;
};

const NewTask = ({
  openNewItem,
  setOpenNewItem,
  newItemTitle,
  setNewItemTitle,
  column,
  projectId,
  userStatus,
}: NewItemProps) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const createNewTask = async () => {
    if (userStatus === Status.none || userStatus === Status.viewer) return;
    if (!column.column_id || !projectId) return;
    const { count, error: taskCountError } = await supabase
      .from("tasks")
      .select("column_id", { count: "exact" })
      .match({ column_id: column.column_id });
    if (taskCountError) throw new Error(taskCountError.message);
    const { data, error } = await supabase.from("tasks").insert([
      {
        title: newItemTitle,
        column_id: column.column_id,
        index: count,
      },
    ]);
    if (error) throw new Error(error.message);
    if (data) return data;
    return;
  };
  const {
    mutateAsync: newTask,
    isLoading,
    isError,
    error,
  } = useMutation(createNewTask, {
    onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
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
            } rounded-md p-2 disabled:opacity-60`}
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
