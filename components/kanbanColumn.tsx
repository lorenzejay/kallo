import { useContext, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { AiOutlineEllipsis } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { ColumnsWithTasksType, Status } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";
import Dropdown from "./dropdown";
import KanbanTask from "./kanbanTask";
import NewTask from "./newTask";
import supabase from "../utils/supabaseClient";
import Loader from "./loader";

interface KanbanColProps {
  index: number;
  id: string;
  column: ColumnsWithTasksType;
  projectId: string;
  userStatus: Status | undefined;
}
const KanbanColumn = ({
  column,
  id,
  index,
  projectId,
  userStatus,
}: KanbanColProps) => {
  const [columnName, setColumnName] = useState(column.name || "");
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");

  const updateColumnName = async (name: string) => {
    const { data, error } = await supabase
      .from("columns")
      .update({ name })
      .match({ column_id: column.column_id });
    if (error) throw error.message;
    // @ts-ignore
    if (data) setColumnName(data[0].name);
    return data;
  };

  const handleDeleteColumn = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this column?"
      );
      if (confirmDelete) {
        if (!projectId || !column.column_id) return;
        const { data, error } = await supabase
          .from("columns")
          .delete()
          .match({ column_id: column.column_id });
        if (error) throw error.message;
        return data;
      }
    } catch (error) {
      return error;
    }
  };

  const { mutateAsync: updateColName, isLoading } = useMutation(
    updateColumnName,
    {
      onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
    }
  );
  const { mutateAsync: deleteColumn } = useMutation(handleDeleteColumn, {
    onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
  });

  return (
    <Draggable
      draggableId={id}
      index={index}
      key={id}
      isDragDisabled={
        userStatus === "viewer" || userStatus === "none" || !userStatus
          ? true
          : false
      }
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
          className={`px-5 ${
            snapshot.isDragging ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="flex flex-row justify-start items-center text-gray-700">
            {!toggleDoubleClickEffect ? (
              <h2
                className={`text-xl my-3 p-1 mr-2 rounded-sm ${
                  isDarkMode && "text-white-175"
                }`}
                onDoubleClick={() => setToggleDoubleClickEffect(true)}
              >
                {column.name || columnName}
              </h2>
            ) : (
              <input
                className={`text-xl my-3 p-1 mr-2 rounded-sm `}
                type="text"
                name="column title"
                maxLength={25}
                value={columnName}
                onChange={(e) => {
                  setColumnName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    updateColName(columnName);
                    setToggleDoubleClickEffect(false);
                  }
                }}
              />
            )}
            {isLoading && <Loader size="w-4" />}
            {column.tasks && (
              <p
                className={`${
                  isDarkMode && "text-gray-400 text-sm "
                } flex-grow`}
              >
                {column.tasks.length}
              </p>
            )}
            <div className="relative right-0 bg-none">
              <Dropdown
                title={<AiOutlineEllipsis size={30} />}
                hoverable={false}
                showArrow={false}
                width={"w-32"}
                className="-mt-3 right-0"
              >
                <button
                  type="button"
                  className="flex items-center justify-between"
                  onClick={() => deleteColumn()}
                >
                  <FaTrash /> <span className="ml-3">Delete</span>
                </button>
              </Dropdown>
            </div>
          </div>
          <Droppable droppableId={id} key={id}>
            {(provided) => {
              return (
                <div
                  className={`flex flex-col w-full items-start p-0 min-h-column h-auto `}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {column.tasks &&
                    column.tasks.map((item, index) => {
                      return (
                        <KanbanTask
                          item={item}
                          index={index}
                          key={item.task_id}
                          // column={column}
                          projectId={projectId}
                          userStatus={userStatus}
                        />
                      );
                    })}
                  {provided.placeholder}
                  {projectId && (
                    <NewTask
                      newItemTitle={newItemTitle}
                      setNewItemTitle={setNewItemTitle}
                      openNewItem={openNewItem}
                      setOpenNewItem={setOpenNewItem}
                      column={column}
                      projectId={projectId}
                      userStatus={userStatus}
                    />
                  )}
                  <button
                    className={` mx-auto ${
                      isDarkMode ? "border card-color" : "bg-white-150"
                    } rounded-md border-black border-solid p-1 mb-4 w-64 border-rounded z-8`}
                    onClick={() => setOpenNewItem(!openNewItem)}
                  >
                    +
                  </button>
                </div>
              );
            }}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanColumn;
