import axios from "axios";
import Link from "next/link";
import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { BoardColumns, Columns, TagsType, Task } from "../types/projectTypes";

type KanbanTaskProps = {
  item: Task;
  index: number;
  columns?: Columns[];
  column: BoardColumns;
  setColumns?: (x: Columns[]) => void;
  // columnId: string;
  projectId: string;
};

const KanbanTask = ({ item, index, projectId }: KanbanTaskProps) => {
  const fetchTags = async () => {
    if (!item.task_id) return;
    const { data } = await axios.get<TagsType[]>(
      `/api/tags/fetch/${item.task_id}`
    );
    return data;
  };

  const { data: allTags } = useQuery(`allTags-${item.task_id}`, fetchTags);
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Draggable key={item.task_id} draggableId={item.task_id} index={index}>
      {(provided, snapshot) => {
        return (
          <Link href={`/project-tasks/${projectId}?taskId=${item.task_id}`}>
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
                {allTags && allTags.length > 0 && (
                  <div className="flex flex-wrap w-auto h-auto justify-start">
                    {allTags.map((t, i) => (
                      <div
                        className="rounded-sm mr-2 my-2 text-sm"
                        style={{
                          backgroundColor: t.hex_color,
                          padding: "1px 10px",
                        }}
                        key={i}
                      >
                        {t.title}
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

export default KanbanTask;
