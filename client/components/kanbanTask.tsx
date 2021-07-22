import Link from "next/link";
import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DarkModeContext } from "../context/darkModeContext";
import { BoardColumns, Columns, Task } from "../types/projectTypes";

type KanbanTaskProps = {
  item: Task;
  index: number;
  columns?: Columns[];
  column: BoardColumns;
  setColumns?: (x: Columns[]) => void;
  columnId: string;
  projectId: string;
};

const KanbanTask = ({ item, index, columnId }: KanbanTaskProps) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Draggable key={item.task_id} draggableId={item.task_id} index={index}>
      {(provided, snapshot) => {
        return (
          <Link href={`/project-tasks/${columnId}?taskId=${item.task_id}`}>
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
              <p className="text-left w-full">{item.title}</p>
              <div>
                {/* {item && item.tags.length > 0 && (
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
                )} */}
              </div>
            </div>
          </Link>
        );
      }}
    </Draggable>
  );
};

export default KanbanTask;
