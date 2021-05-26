import Link from "next/link";
import React, { useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DarkModeContext } from "../context/darkModeContext";

const KanbanItemFromArr = ({ item, index, columns, setColumns, column, columnId, projectId }) => {
  const { isDarkMode } = useContext(DarkModeContext);
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

    //console.log(columnId);
    //console.log(itemText);
    changeText(itemText);
  };
  //   useEffect(() => {
  //     // console.log(itemText);
  //     console.log(columns);
  //     //   setColumns({
  //     //     ...columns,
  //     //     columnId: { ...columns, items: [...column.items, { [item.id]: itemText }] },
  //     //   });
  //   }, [itemText]);
  // console.log(item.tags);

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Link href={`/project-tasks/${projectId}?taskId=${item.id}`} className="w-full">
            <div
              className={` ${
                isDarkMode ? "border card-color" : "bg-gray-200"
              } rounded-md border-black border-solid p-4 mb-4 w-64 flex flex-col justify-start border-rounded z-8 ${
                snapshot.isDragging ? "opacity-50" : "opacity-100"
              }`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{ userSelect: "none", ...provided.draggableProps.style }}
            >
              {/* <input
              className="text-base bg-transparent outline-none z-0"
              value={itemText || ""}
              onChange={(e) => handleChangeItemContent(e.target.value)}
            /> */}
              <p className="text-left w-full">{itemText || ""}</p>
              <div>
                {item && item.tags.length > 0 && (
                  <div className="flex flex-wrap w-auto h-auto justify-start">
                    {item.tags.map((t, i) => (
                      <div
                        className="rounded-sm mr-2 my-2 text-sm"
                        style={{ background: t.labelColor, padding: "1px 10px" }}
                        key={i}
                      >
                        {t.labelName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      }}
    </Draggable>
  );
};

export default KanbanItemFromArr;
