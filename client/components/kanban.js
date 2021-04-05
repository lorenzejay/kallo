import { useEffect, useState } from "react";
import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";
import KanbanColumnArray from "../components/kanbanColArray";
import { dummyItemsInArrayFormat } from "../dummyData/initialData";
import NewColumn from "./newColumn";

const Kanban = ({ headerImage }) => {
  //makes something can load before d&d checks a fail
  const [winReady, setWinReady] = useState(false);
  const [openNewColumn, setOpenNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [columns, setColumns] = useState([]);

  //to make sure it wokrs
  useEffect(() => {
    setWinReady(true);
    resetServerContext();
  }, []);

  // console.log("column:", columns);
  const handleOnDragEnd = (result) => {
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

      setColumns(columnCopy);
      return console.log(columns);
    }

    // //moving cards here
    // if we are moving items to a different column
    if (source.droppableId !== destination.droppableId && type !== "column") {
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
    } else {
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
    }
  };
  // console.log(columns);
  return (
    <main className="relative flex-col">
      <img
        src={headerImage || "/sample-card-img.jpg"}
        className="rounded-md w-full overflow-hidden h-64 object-cover"
        alt="Board header img"
      />
      {winReady && (
        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
          <Droppable droppableId={"columns"} type="column" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} className="flex flex-row overflow-x-auto h-auto mb-10">
                {Array.isArray(columns) &&
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
