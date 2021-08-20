import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { AiOutlineEllipsis } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { BoardColumns, ReturnedApiStatus } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";
import Dropdown from "./dropdown";
import KanbanTask from "./kanbanTask";
import NewTask from "./newTask";
type KanbanColProps = {
  index: number;
  id: string;
  column: BoardColumns;
  projectId: string;
};
const KanbanColumn = ({ column, id, index, projectId }: KanbanColProps) => {
  const auth = useAuth();
  const { userToken } = auth;

  const [columnName, setColumnName] = useState(column.column_title || "");
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");

  const updateColumnName = async (name: string) => {
    if (!userToken || !projectId) return;
    const config = configWithToken(userToken);
    const { data } = await axios.put(
      `/api/columns/update-column-name/${projectId}/${column.column_id}`,
      { name },
      config
    );
    if (!data)
      return window.alert("You do not have privleges to update column name.");
  };

  const handleDeleteColumn = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this column?"
      );
      if (confirmDelete) {
        if (!projectId || !column.column_id || !userToken) return;
        const config = configWithToken(userToken);
        const { data } = await axios.delete<ReturnedApiStatus | undefined>(
          `/api/columns/delete-col/${projectId}/${column.column_id}`,
          config
        );

        if (!data)
          return window.alert(
            "You do not have the privileges to delete this column."
          );
        return data;
      }
    } catch (error) {
      return error;
    }
  };

  const { mutateAsync: updateColName } = useMutation(updateColumnName, {
    onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
  });
  const { mutateAsync: deleteColumn } = useMutation(handleDeleteColumn, {
    onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
  });

  useEffect(() => {
    if (column) {
      setColumnName(column.column_title);
    }
  }, [column.column_title]);
  return (
    <Draggable draggableId={id} index={index} key={id}>
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
                {column.column_title || columnName}
              </h2>
            ) : (
              <input
                className={`text-xl my-3 p-1 mr-2 rounded-sm `}
                type="text"
                name="column title"
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
                  {column &&
                    column.tasks &&
                    column.tasks.map((item, index) => {
                      return (
                        <KanbanTask
                          item={item}
                          index={index}
                          key={item.task_id}
                          column={column}
                          projectId={projectId}
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
