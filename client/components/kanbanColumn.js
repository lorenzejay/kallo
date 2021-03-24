import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanItem from "./kanbanItem";
import { v4 as uuid } from "uuid";
const KanbanColumn = ({ column, id, index, setColumns, columns }) => {
  console.log("columnId:", id);
  // console.log("column:", column);
  const handleAddCard = () => {
    //find the length of all the cards
    console.log(column.items);
    column.items.push({ id: uuid(), content: "" });
    setColumns({ ...columns, [id]: { ...column, items: column.items } });
  };
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
          className={`${snapshot.isDragging ? "opacity-50" : "opacity-100"}`}
        >
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
                      <KanbanItem
                        item={item}
                        index={index}
                        key={item.id}
                        columns={columns}
                        column={column}
                        columnId={id}
                        setColumns={setColumns}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <button
                    className="border card-color rounded-md border-black border-solid p-1 mb-4 w-64 border-rounded z-10"
                    onClick={handleAddCard}
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
