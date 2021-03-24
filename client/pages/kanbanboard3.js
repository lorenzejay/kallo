import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd";
import KanbanColumn from "../components/kanbanColumn";
import { dummyColumns } from "../dummyData/initialData";

const Kanbanboard2 = () => {
  const [winReady, setWinReady] = useState(false);

  //to make sure it wokrs
  useEffect(() => {
    setWinReady(true);
    resetServerContext();
  }, []);

  const [columns, setColumns] = useState(dummyColumns);

  //   console.log("column:", columns);
  const handleOnDragEnd = (result) => {
    // console.log("result:", result);
    const { source, destination, type } = result;
    if (!destination) return;
    //moving columns
    if (type === "column") {
      if (source.index === destination.index) return;

      const colsInArr = Object.entries(columns);
      //console.log("colsInArr:", colsInArr);

      const [removed] = colsInArr.splice(source.index, 1);
      //   return console.log("moved", removed);
      colsInArr.splice(destination.index, 0, removed);
      //return console.log("colsInarray", colsInArr);
      console.log("colsInArr:", colsInArr);
      //   const mappedCols = [{ ...colsInArr }];
      //   return console.log("colsInarray", mappedCols);
      const obj = colsInArr.reduce(function (o, val) {
        o[val] = val[1];
        return o;
      }, {});
      return setColumns(obj);
    }

    //moving items
    // if we are moving items to a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];

      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];

      const [removed] = sourceItems.splice(source.index, 1);
      //   console.log("removedTask", removed);
      destinationItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      });
    } else {
      const column = columns[source.droppableId];

      const copiedItems = [...column.items]; //copy of the tasks inside items array
      const [removed] = copiedItems.splice(source.index, 1);

      copiedItems.splice(destination.index, 0, removed); //add the removed item

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  //   console.log("spreaded columns:", { ...columns });
  console.log("columns", columns);
  return (
    <div className="">
      {winReady && (
        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
          <Droppable droppableId={"columns"} type="column" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="flex flex-row overflow-x-auto h-auto mb-10 w-auto"
              >
                {Object.entries(columns).map(([id, column], index) => {
                  // console.log("id:", id); // console.log("mappedColumn:", column);
                  return (
                    <div className="m-1 flex flex-col column-color bg-gray-800" key={index}>
                      <KanbanColumn
                        id={id}
                        column={column}
                        index={index}
                        setColumns={setColumns}
                        columns={columns}
                      />
                    </div>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Kanbanboard2;
