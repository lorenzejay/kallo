import { useEffect, useState, useContext } from "react";
import NewColumn from "./newColumn";
import {
  DragDropContext,
  Droppable,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import { DarkModeContext } from "../context/darkModeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Column, ColumnsWithTasksType, Status } from "../types/projectTypes";
import KanbanColumn from "./kanbanColumn";
import supabase from "../utils/supabaseClient";
import Loader from "./loader";

type KanbanProps = {
  headerImage: string;
  projectId: string;
  userStatus: Status | undefined;
};

const Kanban = ({ headerImage, projectId, userStatus }: KanbanProps) => {
  if (!projectId) return <></>;
  const queryClient = useQueryClient();

  const { isDarkMode } = useContext(DarkModeContext);

  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  //to make sure we can use drag and drop
  useEffect(() => {
    resetServerContext();
  }, []);

  const getTasksForTheCol = async (arrOfCols: Column[]) => {
    const allTasks = [];
    for (const col of arrOfCols) {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("column_id", col.column_id)
        .order("index", { ascending: true });
      if (error) throw new Error(error.message);
      allTasks.push({
        column_id: col.column_id,
        name: col.name,
        index: col.index,
        project_associated: col.project_associated,
        tasks: tasks,
      });
    }
    return allTasks;
  };

  const fetchColumns = async () => {
    if (!projectId) return;
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("project_associated", projectId)
      .order("index", { ascending: true });
    if (error) throw new Error(error.message);
    const colsWithTasks = await getTasksForTheCol(data as any);
    return colsWithTasks;
  };

  const {
    data: boardColumns,
    isLoading,
    error: fetchingBoardError,
    isError: fetchingBoardIsError,
  } = useQuery([`columns-${projectId}`], fetchColumns);

  function array_move(arr: any[], old_index: number, new_index: number) {
    var element = arr[old_index];
    arr.splice(old_index, 1);
    arr.splice(new_index, 0, element);
    return arr;
  }
  const handleMoveTaskInsideTheSameCol = async (newColumnFormat: any) => {
    const { data, error } = await supabase
      .from("tasks")
      .upsert(newColumnFormat);
    if (error) throw new Error(error.message);
    return data;
  };
  const handleMoveCol = async (boardColumnsMoving: ColumnsWithTasksType[]) => {
    const { error, data } = await supabase
      .from("columns")
      .upsert(boardColumnsMoving);
    if (error) throw new Error(error.message);
    return data;
  };
  const handleMoveTaskAcrossCols = async ({
    source,
    sourceItems,
    destination,
    destinationItems,
  }: any) => {
    for (let i = destination.index + 1; i <= destinationItems.length - 1; i++) {
      destinationItems[i].index = destinationItems[i].index + 1;
    }
    // source needs to decrement indexes starting from source.index
    for (let i = source.index; i <= sourceItems.length - 1; i++) {
      sourceItems[i].index = sourceItems[i].index - 1;
    }
    const { error: upsertSource } = await supabase
      .from("tasks")
      .upsert(sourceItems);
    const { error: upsertDestination } = await supabase
      .from("tasks")
      .upsert(destinationItems);
    if (upsertSource) throw new Error(upsertSource.message);
    if (upsertDestination) throw new Error(upsertDestination.message);
  };
  const {
    mutateAsync: moveColumn,
    isError: movingColumnIsError,
    error: moveColumnError,
  } = useMutation(handleMoveCol, {
    onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
  });
  const { mutateAsync: moveTaskInSameCol } = useMutation(
    handleMoveTaskInsideTheSameCol,
    {
      onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
    }
  );
  const { mutateAsync: moveTaskAcrossCols } = useMutation(
    handleMoveTaskAcrossCols,
    {
      onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
    }
  );

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return; //if the card or column doesnt go anywhere do nothing
    //moving columns here
    if (!boardColumns) return;
    if (type === "column") {
      // const { column_id } = boardColumns[source.index];

      if (source.index === destination.index) return;
      const boardColumnsMoving = array_move(
        boardColumns,
        source.index,
        destination.index
      );
      if (destination.index > source.index) {
        for (let i = source.index; i <= destination.index; i++) {
          if (i === destination.index) {
            boardColumnsMoving[i].index = destination.index;
            break;
          }
          boardColumnsMoving[i].index = boardColumnsMoving[i].index - 1;
        }
      } else {
        for (let i = source.index; i >= destination.index; i--) {
          if (i === destination.index) {
            boardColumnsMoving[i].index = destination.index;
            break;
          }
          boardColumnsMoving[i].index = boardColumnsMoving[i].index + 1;
        }
      }
      const noTasksColumns = boardColumnsMoving.map(({ tasks, ...col }) => col); // we are upserting and there is no tasks so we don't need to show update with tasks.
      return await moveColumn(noTasksColumns);
    }

    // //moving task cards here
    // if we are moving items to a different column
    else if (source.droppableId !== destination.droppableId) {
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
        destinationItems.push({
          ...removed,
          index: destination.index,
          column_id: destinationColumn.column_id,
        });
      } else {
        destinationItems.splice(destination.index, 0, {
          ...removed,
          index: destination.index,
          column_id: destinationColumn.column_id,
        });
      }
      if (!removed || !destinationColumn) return;
      return moveTaskAcrossCols({
        source,
        sourceItems,
        destination,
        destinationItems,
      });
    }

    //re-ordering columns from the same column
    //source.droppable id = column_id
    else {
      const column = boardColumns.find(
        (col) => col.column_id === source.droppableId
      );
      if (!column) return;
      const copiedItems = [...column.tasks]; //copy of the tasks inside items array

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed); //add the removed item
      //array without this column

      for (const i in boardColumns) {
        if (boardColumns[i].column_id == column.column_id) {
          boardColumns[i].tasks = copiedItems;
          break; //Stop this loop, we found it!
        }
      }

      // adjust the indexes of the tasks
      if (destination.index > source.index) {
        for (let i = source.index; i <= destination.index; i++) {
          if (i === destination.index) {
            copiedItems[i].index = destination.index;
            break;
          }
          copiedItems[i].index = copiedItems[i].index - 1;
        }
      } else {
        for (let i = source.index; i >= destination.index; i--) {
          if (i === destination.index) {
            copiedItems[i].index = destination.index;
            break;
          }
          copiedItems[i].index = copiedItems[i].index + 1;
        }
      }
      return moveTaskInSameCol(copiedItems);
    }
  };

  const [loadedImage, setLoadedImage] = useState(false);
  return (
    <main className="relative flex-col">
      {movingColumnIsError && <p>{moveColumnError as string}</p>}
      {fetchingBoardIsError && <p>{fetchingBoardError as string}</p>}
      <>
        {headerImage !== "" && headerImage !== null && !isLoading && (
          <img
            onLoad={() => setLoadedImage(true)}
            loading={"eager"}
            src={headerImage}
            className={`${
              loadedImage ? "block" : "hidden"
            } rounded-md w-screen h-64 object-cover mb-3 shadow`}
            alt="Board header img"
          />
        )}
        {isLoading && <Loader />}

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
                    boardColumns.map(
                      // @ts-ignore
                      (column: ColumnsWithTasksType, index: number) => {
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
                              userStatus={userStatus}
                            />
                          </div>
                        );
                      }
                    )}
                  {provided.placeholder}
                  <div className="relative self-start h-96">
                    <button
                      disabled={
                        userStatus === Status.none ||
                        userStatus === Status.viewer ||
                        !userStatus
                          ? true
                          : false
                      }
                      className={`rounded-md w-64 text-xl mb-3 px-3 py-1 disabled:opacity-70 ${
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
    </main>
  );
};

export default Kanban;
