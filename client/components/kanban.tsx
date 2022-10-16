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
import { BoardColumn, BoardColumns, Column, Task } from "../types/projectTypes";
import KanbanColumn from "./kanbanColumn";
import supabase from "../utils/supabaseClient";
import Loader from "./loader";

type KanbanProps = {
  headerImage: string;
  projectId: string;
};

const Kanban = ({ headerImage, projectId }: KanbanProps) => {
  // const auth = useAuth();
  if (!projectId) return;
  const queryClient = useQueryClient();

  const { isDarkMode } = useContext(DarkModeContext);

  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  // const [boardColumns, setBoardColumns] = useState<Column[]>([] as Column[]);
  //to make sure we can use drag and drop
  useEffect(() => {
    resetServerContext();
  }, []);

  // useEffect(() => {
  //   //get array of columns that live inside the project

  //   //get all tasks associated to a project

  // },[boardColumns])

  const getTasksForTheCol = async (arrOfCols: Column[]) => {
    const allTasks = [];
    for (const col of arrOfCols) {
      console.log('col', col)
      const { data: tasks, error } = await supabase.from('tasks').select('*').eq('column_id', col.column_id).order('index', { ascending: true });
      if(error) throw new Error(error.message);
      allTasks.push({
        column_id: col.column_id,
        column_title: col.name,
        column_index: col.index,
        tasks: tasks,
      });
    }
    console.log('allTasks',allTasks);
    return allTasks;
  }

  const fetchColumns = async () => {
    if (!projectId) return;
    const { data, error } = await supabase.from('columns').select('*').eq('project_associated', projectId);
    if(error) throw new Error(error.message);
    const colsWithTasks = await getTasksForTheCol(data);
    // console.log('colsWithTasks', colsWithTasks)
    return colsWithTasks;
  };
  
  const { data: boardColumns, isLoading } = useQuery([`columns-${projectId}`], fetchColumns);
  console.log('boardColumns', boardColumns);

  // boardColumns && getTasksForTheCol(boardColumns);

  type moveColArgs = {
    movingCol: string;
    newIndex: number;
  };

  type movingTaskArgs = {
    column_id: string;
    movingTaskId: string;
    newIndex: number;
  };
  function array_move(arr:any[], old_index:number, new_index: number) {
    var element = arr[old_index];
    arr.splice(old_index, 1);
    arr.splice(new_index, 0, element);
    return arr;
};
  const handleMoveTaskInsideTheSameCol = async (args: movingTaskArgs) => {
    if (!projectId || !args) return;
    const { data, error: countError } = await supabase.from('tasks').select('*', {count: 'exact'}).match({ column_id: args.column_id });
    if (countError) throw new Error(countError.message);
    const movingTaskIndex = data.find(task => task.task_id === args.movingTaskId).index;
    const originalTaskIndex = data.findIndex(task => task.index === args.newIndex);
    //previous task at the newIndex
    const previousTaskAtNewIndexId = data[args.newIndex].task_id;

    // or check directly with match
    if (movingTaskIndex < 0) throw new Error('Something went wrong moving this task');
    //checks if the task moved from one index
    if (args.newIndex === movingTaskIndex) return console.log('args.newIndex === movingTaskIndex');


    // just switching places
    if (movingTaskIndex - originalTaskIndex === 1 || originalTaskIndex - movingTaskIndex === 1){
      const {data: movingData, error: movingError} = await supabase.from('tasks').update({ index: args.newIndex }).eq('task_id', args.movingTaskId);
      const { error: movingDataPreviousTaskAtNewIndexError} = await supabase.from('tasks').update({ index: movingTaskIndex }).eq('task_id', previousTaskAtNewIndexId);
      if (movingError) throw new Error(movingError.message)
      if(movingDataPreviousTaskAtNewIndexError) throw new Error(movingDataPreviousTaskAtNewIndexError.message);
      return movingData;
    } 
    const { data: tasksInAffectedCol, error } = await supabase.from('tasks').select('*').match({ column_id: args.column_id }).order('index', {ascending: true});
    if (error) throw new Error(error.message)
    if(!tasksInAffectedCol) throw new Error('something wrong with getting tasks from col');
    if (args.newIndex > movingTaskIndex){
      const copyOfTasksInAffedctedCol = [...tasksInAffectedCol];
      //moving indexes
      const newTasksMovedArr = array_move(copyOfTasksInAffedctedCol, movingTaskIndex, args.newIndex);
      if (!newTasksMovedArr) return;
      //adjusting indexes to remakes the array
      for (let i = movingTaskIndex; i <= args.newIndex; i++){
        if (i === args.newIndex) {
          newTasksMovedArr[i].index = args.newIndex;
          break;
        }
        newTasksMovedArr[i].index = newTasksMovedArr[i].index - 1;
      }
      const {error: upsertError} = await supabase.from('tasks').upsert(newTasksMovedArr);
      if (upsertError) throw new Error(upsertError.message);
    } else if (movingTaskIndex > args.newIndex) {
      const copyOfTasksInAffedctedCol = [...tasksInAffectedCol];
      const newTasksMovedArr = array_move(copyOfTasksInAffedctedCol, movingTaskIndex, args.newIndex);
      newTasksMovedArr[args.newIndex].index = args.newIndex;
      for (let i = args.newIndex + 1; i <= newTasksMovedArr.length -1; i++){
        newTasksMovedArr[i].index = newTasksMovedArr[i].index + 1;
      }
      const {error: upsertError} = await supabase.from('tasks').upsert(newTasksMovedArr);
      if (upsertError) throw new Error(upsertError.message);
    }
  };
  // const handleMoveCol = async (args: moveColArgs) => {
  //   try {
  //     if (!projectId) return;
  //     const config = configWithToken(userToken);
  //     const { data } = await axios.put(
  //       `/api/columns/update-col-order/${projectId}`,
  //       { movingCol: args.movingCol, newIndex: args.newIndex },
  //       config
  //     );
  //     if (!data)
  //       return window.alert(
  //         "You do not have privileges to rearrange the columns."
  //       );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const handleMoveTaskAcrossCols = async (args: movingTaskArgs) => {
  //   if (!!projectId) return;
  //   const config = configWithToken(userToken);
  //   const { data } = await axios.put(
  //     `/api/tasks/update-task-to-different-col/${projectId}/${args.column_id}`,
  //     { movingTaskId: args.movingTaskId, newIndex: args.newIndex },
  //     config
  //   );
  //   if (!data)
  //     return window.alert(
  //       "You do not have privileges to rearrange the columns."
  //     );
  // };
  // const { mutateAsync: moveColumn } = useMutation(handleMoveCol, {
  //   onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
  // });
  const { mutateAsync: moveTaskInSameCol } = useMutation(
    handleMoveTaskInsideTheSameCol,
    {
      onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
    }
  );
  // const { mutateAsync: moveTaskAcrossCols } = useMutation(
  //   handleMoveTaskAcrossCols,
  //   {
  //     onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
  //   }
  // );

  // const handleOnDragEnd = async (result: DropResult) => {
  //   const { source, destination, type } = result;
  //   if (!destination) return; //if the card or column doesnt go anywhere do nothing
  //   //moving columns here
  //   if (!boardColumns) return;
  //   if (type === "column") {
  //     const { column_id } = boardColumns[source.index];

  //     if (source.index === destination.index) return;
  //     const [removed] = boardColumns.splice(source.index, 1);
  //     boardColumns.splice(destination.index, 0, removed);

  //     return moveColumn({
  //       movingCol: column_id,
  //       newIndex: destination.index,
  //     });
  //   }

  //   // //moving task cards here
  //   // if we are moving items to a different column
  //   else if (source.droppableId !== destination.droppableId) {
  //     const sourceColumn = boardColumns.find(
  //       (col) => col.column_id == source.droppableId
  //     );
  //     if (!sourceColumn) return;
  //     const destinationColumn = boardColumns.find(
  //       (col) => col.column_id == destination.droppableId
  //     );
  //     if (!destinationColumn) return;
  //     const sourceItems = sourceColumn.tasks;

  //     const destinationItems = destinationColumn.tasks;

  //     const [removed] = sourceItems.splice(source.index, 1);

  //     if (destinationItems.length === 0) {
  //       destinationItems.push(removed);
  //     } else {
  //       destinationItems.splice(destination.index, 0, removed);
  //     }
  //     if (!removed || !destinationColumn) return;
  //     return moveTaskAcrossCols({
  //       column_id: destinationColumn.column_id,
  //       movingTaskId: removed.task_id,
  //       newIndex: destination.index,
  //     });
  //   }

  //   //re-ordering columns from the same column
  //   //source.droppable id = column_id
  //   else {
  //     const column = boardColumns.find(
  //       (col) => col.column_id === source.droppableId
  //     );
  //     if (!column) return;
  //     const copiedItems = [...column.tasks]; //copy of the tasks inside items array

  //     const [removed] = copiedItems.splice(source.index, 1);
  //     copiedItems.splice(destination.index, 0, removed); //add the removed item
  //     //array without this column

  //     for (var i in boardColumns) {
  //       if (boardColumns[i].column_id == column.column_id) {
  //         boardColumns[i].tasks = copiedItems;
  //         break; //Stop this loop, we found it!
  //       }
  //     }
  //     return moveTaskInSameCol({
  //       column_id: source.droppableId,
  //       movingTaskId: removed.task_id,
  //       newIndex: destination.index,
  //     });
  //   }
  // };
  const handleMovingTaskInCol = async (result: DropResult) => {
    if(!boardColumns) return;
    const { source, destination, type } = result;

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
    console.log('destination.index', destination)
    return moveTaskInSameCol({
      column_id: source.droppableId,
      movingTaskId: removed.task_id,
      newIndex: destination.index,
    });
  }
  
  const [loadedImage, setLoadedImage] = useState(false);
  return (
    <main className="relative flex-col">
      {isLoading && <Loader />}
      {/* {isError && <p>{error.message as any}</p>} */}
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
          <DragDropContext onDragEnd={(result) => handleMovingTaskInCol(result)}>
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
                    boardColumns.map((column: {
                      column_id: string,
                      column_title: string,
                      column_index: number,
                      tasks: Task[],
                    }, index: number) => {
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
                      className={`rounded-md w-64 text-xl mb-3 px-3 py-1 ${
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
