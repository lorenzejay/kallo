import { useEffect, useState, useContext } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import NewColumn from "./newColumn";
import { DarkModeContext } from "../context/darkModeContext";
import axios from "axios";
import { configWithToken } from "../functions";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BoardColumns } from "../types/projectTypes";
import KanbanColumn from "./kanbanColumn";
import { useAuth } from "../hooks/useAuth";

type KanbanProps = {
  headerImage: string;
  projectId: string;
};

const Kanban = ({ headerImage, projectId }: KanbanProps) => {
  const auth = useAuth();
  const { userToken } = auth;
  const queryClient = useQueryClient();
  // const userLogin = useSelector((state: RootState) => state.userLogin);
  // const { userInfo } = userLogin;

  const { isDarkMode } = useContext(DarkModeContext);

  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  //to make sure we can use drag and drop
  useEffect(() => {
    resetServerContext();
  }, []);

  const fetchColumns = async () => {
    if (!userToken || !projectId) return;
    const config = configWithToken(userToken);
    const { data } = await axios.get<BoardColumns[]>(
      `/api/columns/get-project-columns/${projectId}`,
      config
    );

    return data;
  };
  const { data: boardColumns } = useQuery(`columns-${projectId}`, fetchColumns);

  type moveColArgs = {
    movingCol: string;
    newIndex: number;
  };

  type movingTaskArgs = {
    column_id: string;
    movingTaskId: string;
    newIndex: number;
  };
  const handleMoveTaskInsideTheSameCol = async (args: movingTaskArgs) => {
    if (!userToken || !projectId) return;
    const config = configWithToken(userToken);
    await axios.put(
      `/api/tasks/update-task-within-same-col/${args.column_id}`,
      { movingTaskId: args.movingTaskId, newIndex: args.newIndex },
      config
    );
    console.log("moved task inside same col");
  };
  const handleMoveCol = async (args: moveColArgs) => {
    try {
      if (!userToken || !projectId) return;
      const config = configWithToken(userToken);
      await axios.put(
        `/api/columns/update-col-order/${projectId}`,
        { movingCol: args.movingCol, newIndex: args.newIndex },
        config
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleMoveTaskAcrossCols = async (args: movingTaskArgs) => {
    if (!userToken || !projectId) return;
    const config = configWithToken(userToken);
    await axios.put(
      `/api/tasks/update-task-to-different-col/${args.column_id}`,
      { movingTaskId: args.movingTaskId, newIndex: args.newIndex },
      config
    );
  };
  const { mutateAsync: moveColumn } = useMutation(handleMoveCol, {
    onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
  });
  const { mutateAsync: moveTaskInSameCol } = useMutation(
    handleMoveTaskInsideTheSameCol,
    {
      onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
    }
  );
  const { mutateAsync: moveTaskAcrossCols } = useMutation(
    handleMoveTaskAcrossCols,
    {
      onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
    }
  );

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return; //if the card or column doesnt go anywhere do nothing
    //moving columns here
    if (!boardColumns) return;
    if (type === "column") {
      const { column_id } = boardColumns[source.index];

      if (source.index === destination.index) return;
      const [removed] = boardColumns.splice(source.index, 1);
      boardColumns.splice(destination.index, 0, removed);

      return moveColumn({
        movingCol: column_id,
        newIndex: destination.index,
      });
    }

    // //moving task cards here
    // if we are moving items to a different column
    else if (source.droppableId !== destination.droppableId) {
      console.log("moving task to a different column");
      const sourceColumn = boardColumns.find(
        (col) => col.column_id == source.droppableId
      );
      if (!sourceColumn) return;
      const destinationColumn = boardColumns.find(
        (col) => col.column_id == destination.droppableId
      );
      if (!destinationColumn) return;
      const sourceItems = sourceColumn.tasks;

      const destinationItems = destinationColumn.tasks;

      const [removed] = sourceItems.splice(source.index, 1);

      if (destinationItems.length === 0) {
        destinationItems.push(removed);
      } else {
        destinationItems.splice(destination.index, 0, removed);
      }
      if (!removed || !destinationColumn) return;
      return moveTaskAcrossCols({
        column_id: destinationColumn.column_id,
        movingTaskId: removed.task_id,
        newIndex: destination.index,
      });
    }

    //re-ordering columns from the same column
    //source.droppable id = column_id
    else {
      console.log("moving task inside the same column");
      const column = boardColumns.find(
        (col) => col.column_id === source.droppableId
      );
      if (!column) return;
      const copiedItems = [...column.tasks]; //copy of the tasks inside items array

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed); //add the removed item
      //array without this column

      for (var i in boardColumns) {
        if (boardColumns[i].column_id == column.column_id) {
          boardColumns[i].tasks = copiedItems;
          break; //Stop this loop, we found it!
        }
      }
      return moveTaskInSameCol({
        column_id: source.droppableId,
        movingTaskId: removed.task_id,
        newIndex: destination.index,
      });
    }
  };

  const [loadedImage, setLoadedImage] = useState(false);
  return (
    <main className="relative flex-col">
      <>
        {headerImage !== "" && headerImage !== null && (
          <img
            onLoad={() => setLoadedImage(true)}
            loading={"eager"}
            src={headerImage}
            className={`${
              loadedImage ? "block" : "hidden"
            } rounded-md w-screen h-64 object-cover mb-3`}
            alt="Board header img"
          />
        )}
        {boardColumns && (
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
            <Droppable
              droppableId={"columns"}
              type="column"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className={`flex flex-row overflow-x-auto h-auto mb-10 ${
                    isDarkMode ? "darkBody" : "bg-white-175"
                  }`}
                >
                  {boardColumns &&
                    boardColumns.map((column, index: number) => {
                      return (
                        <div
                          className={`flex flex-col rounded-md mr-2 ${
                            isDarkMode ? "darkBody" : "bg-gray-125"
                          }`}
                          key={index}
                        >
                          <KanbanColumn
                            id={column.column_id}
                            column={column}
                            index={index}
                            projectId={projectId}
                          />
                        </div>
                      );
                    })}
                  {provided.placeholder}
                  <div className="relative self-start h-96">
                    <button
                      className={`rounded-md text-xl mb-3 px-3 py-1 ${
                        isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-125 text-gray-700"
                      }`}
                      onClick={() => setOpenNewColumn(!openNewColumn)}
                    >
                      + New Column
                    </button>
                    <NewColumn
                      openNewColumn={openNewColumn}
                      setOpenNewColumn={setOpenNewColumn}
                      newColumnTitle={newColumnTitle}
                      setNewColumnTitle={setNewColumnTitle}
                      projectId={projectId}
                    />
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </>
      {/* )} */}
    </main>
  );
};

export default Kanban;
