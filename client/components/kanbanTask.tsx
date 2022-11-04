import Link from "next/link";
import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { Column, Status, Task } from "../types/projectTypes";
import supabase from "../utils/supabaseClient";

type KanbanTaskProps = {
  item: Task;
  index: number;
  columns?: Column[];
  setColumns?: (x: Column[]) => void;
  projectId: string;
  userStatus: Status | undefined;
};

const KanbanTask = ({
  item,
  index,
  projectId,
  userStatus,
}: KanbanTaskProps) => {
  const fetchTags = async () => {
    if (!item.task_id) return;
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .match({ task_id: item.task_id });
    if (error) throw Error(error.message);
    return data;
  };

  const { data: allTags } = useQuery([`allTags-${item.task_id}`], fetchTags);
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Draggable
      key={item.task_id}
      draggableId={item.task_id}
      index={index}
      isDragDisabled={
        userStatus === "viewer" || userStatus === "none" || !userStatus
          ? true
          : false
      }
    >
      {(provided, snapshot) => {
        return (
          <Link href={`/project-tasks/${projectId}?taskId=${item.task_id}`}>
            <div
              className={` ${
                isDarkMode ? "border card-color" : "bg-gray-100"
              } hover:cursor-pointer rounded-md border-black border-solid shadow p-4 mb-4 w-64 flex flex-col justify-start border-rounded z-8 ${
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
                        className="rounded-md mr-2 my-2 text-sm"
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
