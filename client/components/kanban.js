import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import KanbanColumnArray from "../components/kanbanColArray";
import { configWithToken } from "../functions";
import { getBoardColumns } from "../redux/Actions/projectActions";
import NewColumn from "./newColumn";

const Kanban = ({ headerImage, projectId }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const projectColumns = useSelector((state) => state.projectColumns);
  const { boardColumns } = projectColumns;
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

  const pushColumnsToDB = async () => {
    const config = configWithToken(userInfo.token);
    const { data } = await axios.put(`/api/projects/add-column/${projectId}`, { columns }, config);
    // console.log(data);
    if (!data.success || data.message) {
      window.alert(data.message);
    }
  };
  // console.log("projectId", projectId);
  // get data from the db here
  useEffect(() => {
    if (projectId) {
      // const config = configWithToken(userInfo.token);
      // const { data } = await axios.get(`/api/projects/get-board-columns/${projectId}`, config);

      dispatch(getBoardColumns(projectId));
      console.log("dispatched getBoardcols", projectId);
      // if (boardColumns && boardColumns.columns !== null) {
      //   console.log(boardColumns.columns);
      // } else {
      //   setColumns([]);
      // }
    }
  }, [projectId, pushColumnsToDB]);

  boardColumns && console.log("boardColumns:", boardColumns);
  console.log("columns:", columns);
  // console.log("projectId:", projectId);
  // console.log("userInfo:", userInfo);

  const handleOnDragEnd = async (result) => {
    // console.log("result:", result);
    const { source, destination, type } = result;

    if (!destination) return; //if the card or column doesnt go anywhere do nothing
    //moving columns here
    if (type === "column") {
      const columnCopy = columns.slice(0);

      if (source.index === destination.index) return;
      const [removed] = columnCopy.splice(source.index, 1);
      //   return console.log("moved", removed);
      columnCopy.splice(destination.index, 0, removed);
      // return console.log("colsInarray", columns);
      // console.log("columnCopy:", columnCopy);

      return setColumns(columnCopy);
    }

    // //moving cards here
    // if we are moving items to a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns.find((col) => col.id == source.droppableId);
      // console.log("src col", source);
      const destinationColumn = columns.find((col) => col.id == destination.droppableId);
      // console.log("destination col", destination);
      const sourceItems = sourceColumn.items;
      //console.log(sourceItems);
      const destinationItems = destinationColumn.items;
      // console.log("destination items", destinationItems);
      // console.log(source.index);
      const [removed] = sourceItems.splice(source.index, 1);
      // console.log("removedTask", removed);
      //add in what was removed from the source col
      // console.log(destinationItems);
      if (destinationItems.length === 0) {
        destinationItems.push(removed);
      } else {
        destinationItems.splice(destination.index, 0, removed);
      }
      const updatedBoardState = columns;
      setColumns(updatedBoardState);
      pushColumnsToDB();
    }
    //re-ordering columns from the same column
    else {
      const column = columns.find((col) => col.id === source.droppableId);

      const copiedItems = [...column.items]; //copy of the tasks inside items array

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed); //add the removed item
      // console.log("copieditems", copiedItems);
      //array without this column

      for (var i in columns) {
        if (columns[i].id == column.id) {
          columns[i].items = copiedItems;
          break; //Stop this loop, we found it!
        }
      }
      const updatedBoardState = columns;

      setColumns([...updatedBoardState]);
      pushColumnsToDB();
    }
  };
  //whenever columns is updated we update the db
  console.log(columns);
  return (
    <main className="relative flex-col">
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
              <div ref={provided.innerRef} className="flex flex-row overflow-x-auto h-auto mb-10">
                {columns &&
                  columns.map((column, index) => {
                    // console.log("id:", id); // console.log("mappedColumn:", column);
                    return (
                      <div className="flex flex-col column-color bg-gray-800" key={index}>
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
                    className=" text-white text-xl my-3 hover:bg-gray-700 rounded-sm p-1"
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
    </main>
  );
};

export default Kanban;
