import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useMutation } from "react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { BoardColumns } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";
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

  const { mutateAsync: updateColName } = useMutation(updateColumnName, {
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
          <div className="flex items-center justify-between text-gray-700">
            {!toggleDoubleClickEffect ? (
              <h2
                className={`text-xl my-3 p-1 flex-grow mr-2 rounded-sm ${
                  isDarkMode && "text-white-175"
                }`}
                onDoubleClick={() => setToggleDoubleClickEffect(true)}
              >
                {column.column_title || columnName}
              </h2>
            ) : (
              <input
                className={`text-xl my-3 p-1 flex-grow mr-2 rounded-sm `}
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
              <p className={`${isDarkMode && "text-gray-400"}`}>
                {column.tasks.length}
              </p>
            )}
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
