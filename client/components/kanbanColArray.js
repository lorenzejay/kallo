import { useContext, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DarkModeContext } from "../context/darkModeContext";
import KanbanItemFromArr from "./kanbanItemFromArr";
import NewItem from "./newItem";
const KanbanColumnArray = ({ column, id, index, setColumns, columns, projectId }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [openNewItem, setOpenNewItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  return (
    <Draggable draggableId={column.id} index={index} key={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
          className={`w-64 mr-10 ${snapshot.isDragging ? "opacity-50" : "opacity-100"}`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={` text-xl my-3 p-1 hover:bg-gray-700 rounded-sm ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {column.name}
            </h2>
            {column.items && <p>{column.items.length}</p>}
          </div>
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => {
              return (
                <div
                  className={`flex flex-col items-start p-0 min-h-column h-auto ${
                    isDarkMode ? "darkBody text-white" : "lightBody text-black"
                  }`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {column &&
                    column.items &&
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
                          projectId={projectId}
                        />
                      );
                    })}
                  {provided.placeholder}
                  {projectId && (
                    <NewItem
                      columns={columns}
                      setColumns={setColumns}
                      newItemTitle={newItemTitle}
                      setNewItemTitle={setNewItemTitle}
                      openNewItem={openNewItem}
                      setOpenNewItem={setOpenNewItem}
                      column={column}
                      projectId={projectId}
                    />
                  )}
                  <button
                    className={` ${
                      isDarkMode ? "border card-color" : "bg-gray-200"
                    } rounded-md border-black border-solid p-1 mb-4 w-64 border-rounded z-8`}
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
