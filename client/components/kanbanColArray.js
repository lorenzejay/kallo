import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import KanbanItemFromArr from "./kanbanItemFromArr";
import NewItem from "./newItem";
const KanbanColumnArray = ({ column, id, index, setColumns, columns, projectId }) => {
  const [columnCopy, setColumnCopy] = useState(column);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");

  // const handleAddCard = () => {
  //   //find the length of all the cards
  //   const columnItemsCopy = column.items;
  //   columnItemsCopy.push({ id: uuid(), content: "" });
  //   // console.log(column);
  //   // console.log(columnItemsCopy);
  //   // console.log("columns", columns);

  //   // setColumns({ ...columns, [id]: { ...column, items: column.items } });
  //   setColumns([...columns]);
  //   console.log("columnsAftersettingItToColumns", columnCopy);
  // };

  return (
    <Draggable draggableId={column.id} index={index} key={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
          className={`${snapshot.isDragging ? "opacity-50" : "opacity-100"}`}
        >
          <div className="flex items-center">
            <h2 className="text-white text-xl my-3 p-1 w-auto hover:bg-gray-700 rounded-sm mr-1">
              {column.name}
            </h2>
            <p>{column.items.length}</p>
          </div>
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => {
              return (
                <div
                  className=" bg-gray-800 flex flex-col items-start min-w-card min-h-column h-auto"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ background: snapshot.isDraggingOver ? "" : "#2f3437" }}
                >
                  {column &&
                    column.items.map((item, index) => {
                      //console.log(task);
                      return (
                        <KanbanItemFromArr
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
                  <NewItem
                    columns={columns}
                    setColumns={setColumns}
                    newItemTitle={newItemTitle}
                    setNewItemTitle={setNewItemTitle}
                    openNewItem={openNewItem}
                    setOpenNewItem={setOpenNewItem}
                    column={column}
                  />
                  <button
                    className="border card-color rounded-md border-black border-solid p-1 mb-4 w-64 border-rounded z-10"
                    onClick={() => setOpenNewItem(!openNewItem)}
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

export default KanbanColumnArray;
