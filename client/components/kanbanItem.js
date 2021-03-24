import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

const KanbanItem = ({ item, index, columns, setColumns, column, columnId }) => {
  const [itemText, setItemText] = useState(item.content || "");

  const changeText = (text) => {
    const objIndex = column.items.findIndex((obj) => obj.id == item.id);
    column.items[objIndex].content = text;

    // console.log(column.items.some((item) => (item.id = item.id)));
    setColumns({
      ...columns,
      [columnId]: { ...column, items: [...column.items] },
    });
  };
  const handleChangeItemContent = (text) => {
    setItemText(text);

    console.log(columnId);
    console.log(itemText);
    changeText(itemText);
  };
  useEffect(() => {
    // console.log(itemText);
    console.log(columns);
    //   setColumns({
    //     ...columns,
    //     columnId: { ...columns, items: [...column.items, { [item.id]: itemText }] },
    //   });
  }, [itemText]);
  //   console.log(columns[columnId].items);
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
            <input
              className="text-base bg-transparent outline-none"
              value={itemText || ""}
              onChange={(e) => handleChangeItemContent(e.target.value)}
            />
          </div>
        );
      }}
    </Draggable>
  );
};

export default KanbanItem;
