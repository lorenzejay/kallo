import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd";
import { dummyColumns } from "../dummyData/initialData";

const Kanbanboard2 = () => {
  const [winReady, setWinReady] = useState(false);

  //to make sure it wokrs
  useEffect(() => {
    setWinReady(true);
  }, []);

  const [columns, setColumns] = useState(dummyColumns);

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    // if we are moving items to a different column
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];

      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];

      const [removed] = sourceItems.splice(source.index, 1);
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
  console.log("spreaded columns:", { ...columns });
  return (
    <div className="flex overflow-x-auto h-auto mb-10 ">
      <DragDropContext onDragEnd={(result) => handleOnDragEnd(result)}>
        {winReady &&
          Object.entries(columns).map(([id, column]) => {
            // console.log("id:", id); // console.log("mappedColumn:", column);
            return (
              <div className="m-1 flex flex-col column-color bg-gray-800" key={id}>
                <h2 className="text-white text-3xl">{column.name}</h2>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        className=" bg-gray-800 flex flex-col items-center min-w-card min-h-column  m-3 h-auto"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ background: snapshot.isDraggingOver ? "lightblue" : "#2f3437" }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className={`border card-color rounded-md border-black border-solid p-4 mb-4 w-64 border-rounded z-10  ${
                                      snapshot.isDragging ? "opacity-50" : "opacity-100"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{ userSelect: "none", ...provided.draggableProps.style }}
                                  >
                                    <p className="text-white text-base">{item.content}</p>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
      </DragDropContext>
    </div>
  );
};

export default Kanbanboard2;
