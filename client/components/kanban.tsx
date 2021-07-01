import { useEffect, useState, useContext } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import KanbanColumnArray from "./kanbanColArray";
import { getBoardColumns, updateCols } from "../redux/Actions/projectActions";
import Loader from "./loader";
import NewColumn from "./newColumn";
import { DarkModeContext } from "../context/darkModeContext";
import { RootState } from "../redux/store";

type KanbanProps = {
  headerImage: string;
  projectId: string;
};

const Kanban = ({ headerImage, projectId }: KanbanProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();

  const projectColumns = useSelector(
    (state: RootState) => state.projectColumns
  );
  const { boardColumns, loading } = projectColumns;
  //makes something can load before d&d checks a fail
  const [winReady, setWinReady] = useState(false);
  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  // const [columns, setColumns] = useState([]);

  //to make sure it wokrs
  useEffect(() => {
    setWinReady(true);
    resetServerContext();
  }, []);

  useEffect(() => {
    if (!projectId) return;
    dispatch(getBoardColumns(projectId));
  }, []);

  console.log("boardColumns", boardColumns);

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return; //if the card or column doesnt go anywhere do nothing
    //moving columns here
    if (type === "column") {
      if (source.index === destination.index) return;
      const [removed] = boardColumns.splice(source.index, 1);

      boardColumns.splice(destination.index, 0, removed);
      const boardColunmnsCopy = [...boardColumns];

      return dispatch(updateCols(boardColunmnsCopy, projectId));
    }

    // //moving cards here
    // if we are moving items to a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = boardColumns.find(
        (col) => col.id == source.droppableId
      );
      if (!sourceColumn) return;
      const destinationColumn = boardColumns.find(
        (col) => col.id == destination.droppableId
      );
      if (!destinationColumn) return;
      const sourceItems = sourceColumn.items;

      const destinationItems = destinationColumn.items;

      const [removed] = sourceItems.splice(source.index, 1);

      if (destinationItems.length === 0) {
        destinationItems.push(removed);
      } else {
        destinationItems.splice(destination.index, 0, removed);
      }
      const boardColumnsCopy = [...boardColumns];
      return dispatch(updateCols(boardColumnsCopy, projectId));
    }
    //re-ordering columns from the same column
    else {
      const column = boardColumns.find((col) => col.id === source.droppableId);
      if (!column) return;
      const copiedItems = [...column.items]; //copy of the tasks inside items array

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed); //add the removed item
      //array without this column

      for (var i in boardColumns) {
        if (boardColumns[i].id == column.id) {
          boardColumns[i].items = copiedItems;
          break; //Stop this loop, we found it!
        }
      }
      const boardColumnsCopy = [...boardColumns];

      // setColumns([...boardColumnsCopy]);
      return dispatch(updateCols(boardColumns, projectId));
    }
  };

  //whenever columns is updated we update the db
  // console.log(columns);
  const [loadedImage, setLoadedImage] = useState(false);
  //what if there is no headerImage
  return (
    <main className="relative flex-col">
      {loading && <Loader isDarkMode={isDarkMode} />}
      {headerImage !== "" && !loadedImage && <Loader isDarkMode={isDarkMode} />}
      {/* {!loading && ( */}
      <>
        {headerImage && (
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
        {!loading && (
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
                    boardColumns.map((column, index) => {
                      // console.log("id:", id); // console.log("mappedColumn:", column);
                      return (
                        <div
                          className={`flex flex-col rounded-md mr-2 ${
                            isDarkMode ? "darkBody" : "bg-gray-125"
                          }`}
                          key={index}
                        >
                          <KanbanColumnArray
                            id={column.id}
                            column={column}
                            index={index}
                            // setColumns={setColumns}
                            columns={boardColumns}
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
                      // columns={columns}
                      // setColumns={setColumns}
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
