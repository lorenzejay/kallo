import axios from "axios";
import { useEffect, useState, useContext, useRef, useCallback, useMemo } from "react";
import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import KanbanColumnArray from "../components/kanbanColArray";
import { configWithToken } from "../functions";
import { getBoardColumns, updateCols } from "../redux/Actions/projectActions";
import Loader from "./loader";
import NewColumn from "./newColumn";
import { DarkModeContext } from "../context/darkModeContext";
import { usePrevious } from "../hooks/usePrevious";

const Kanban = ({ headerImage, projectId }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const projectColumns = useSelector((state) => state.projectColumns);
  const { boardColumns, loading } = projectColumns;
  //makes something can load before d&d checks a fail
  const [winReady, setWinReady] = useState(false);
  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [columns, setColumns] = useState([]);

  //call the get columns data here
  //to make sure it wokrs
  useEffect(async () => {
    setWinReady(true);
    resetServerContext();
  }, []);

  useEffect(() => {
    if (!projectId) return;
    dispatch(getBoardColumns(projectId));
  }, []);

  const handleOnDragEnd = async (result) => {
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
      const sourceColumn = boardColumns.find((col) => col.id == source.droppableId);

      const destinationColumn = boardColumns.find((col) => col.id == destination.droppableId);
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

      setColumns([...boardColumnsCopy]);
      return dispatch(updateCols(boardColumns, projectId));
    }
  };

  //whenever columns is updated we update the db
  // console.log(columns);
  return (
    <main className="relative flex-col">
      {loading && <Loader isDarkMode={isDarkMode} />}
      {/* {!loading && ( */}
      <>
        {headerImage && (
          <img
            src={headerImage}
            className="rounded-md w-screen h-64 object-cover mb-3"
            alt="Board header img"
          />
        )}
        {winReady && (
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
            <Droppable droppableId={"columns"} type="column" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className={`flex flex-row overflow-x-auto h-auto mb-10 ${
                    isDarkMode ? "darkBody" : "lightBody"
                  }`}
                >
                  {boardColumns &&
                    boardColumns.map((column, index) => {
                      // console.log("id:", id); // console.log("mappedColumn:", column);
                      return (
                        <div
                          className={`flex flex-col  ${isDarkMode ? "darkBody" : "lightBody"}`}
                          key={index}
                        >
                          <KanbanColumnArray
                            id={column.id}
                            column={column}
                            index={index}
                            setColumns={setColumns}
                            columns={columns}
                            projectId={projectId}
                          />
                        </div>
                      );
                    })}
                  {provided.placeholder}
                  <div className="relative self-start h-96">
                    <button
                      className={`  text-xl my-3  rounded-sm p-1 ${
                        isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"
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
                      columns={columns}
                      setColumns={setColumns}
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
