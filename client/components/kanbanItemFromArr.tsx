import Link from "next/link";
import React, { useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DarkModeContext } from "../context/darkModeContext";
import { Columns, Task } from "../types/projectTypes";

type KanbanItemFromArrProps = {
  item: Task;
  index: number;
  columns?: Columns[];
  column: Columns;
  setColumns?: (x: Columns[]) => void;
  columnId: string;
  projectId: string;
};
const KanbanItemFromArr = ({
  item,
  index,
  columns,
  setColumns,
  column,
  columnId,
  projectId,
}: KanbanItemFromArrProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [itemText, setItemText] = useState(item.content || "");

  const changeText = (text: string) => {
    const objIndex = column.items.findIndex((obj) => obj.id == item.id);
    column.items[objIndex].content = text;
    if (!columns) return;
    // console.log(column.items.some((item) => (item.id = item.id)));
    setColumns!({
      ...columns,
      [columnId]: { ...column, items: [...column.items] },
    });
  };

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Link href={`/project-tasks/${projectId}?taskId=${item.id}`}>
            <div
              className={` ${
                isDarkMode ? "border card-color" : "bg-gray-100"
              } rounded-md border-black border-solid p-4 mb-4 w-64 flex flex-col justify-start border-rounded z-8 ${
                snapshot.isDragging ? "opacity-75 " : "opacity-100"
              }`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{ userSelect: "none", ...provided.draggableProps.style }}
            >
              <p className="text-left w-full">{itemText || ""}</p>
              <div>
                {item && item.tags.length > 0 && (
                  <div className="flex flex-wrap w-auto h-auto justify-start">
                    {item.tags.map((t, i) => (
                      <div
                        className="rounded-sm mr-2 my-2 text-sm"
                        style={{
                          background: t.labelColor,
                          padding: "1px 10px",
                        }}
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
