import { useState } from "react";
import { FaTags } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Modal from "./modal";
import Tag from "./Tag";
import supabase from "../utils/supabaseClient";
type AllTagsProps = {
  taskId: string;
  projectId: string;
};
const AllTags = ({ taskId, projectId }: AllTagsProps) => {
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [hexColor, setHexColor] = useState<string | null>(null);

  const fetchTags = async () => {
    if (!taskId) return;
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .match({ task_id: taskId });
    if (error) throw new Error(error.message);
    return data;
  };

  const handleAddTag = async () => {
    if (!taskId || !projectId) return;
    const { count, error: countError } = await supabase
      .from("tags")
      .select("task_id", { count: "exact" })
      .match({ task_id: taskId });
    if (countError) throw Error(countError.message);
    const { data, error } = await supabase.from("tags").insert([
      {
        title,
        hex_color: hexColor,
        task_id: taskId,
        index: count,
      },
    ]);
    if (error) throw Error(error.message);
    return data;
  };
  const { data: allTags } = useQuery([`allTags-${taskId}`], fetchTags);
  const { mutateAsync: createTag } = useMutation(handleAddTag, {
    onSuccess: () => queryClient.invalidateQueries([`allTags-${taskId}`]),
  });
  return (
    <Modal
      modalName={
        <span className="flex items-center justify-start w-32 pb-4 ">
          <FaTags className="mr-5" /> Tags
        </span>
      }
      openModal={openModal}
      setOpenModal={setOpenModal}
      contentWidth="w-3/4 lg:w-1/2"
      contentHeight="h-auto"
    >
      <>
        <div className="w-full">
          <div className="p-5">
            <h3 className="text-3xl font-semibold">Task Tags</h3>
            <div className="mt-5 flex flex-wrap">
              {allTags &&
                allTags.map((tag, i) => (
                  <Tag
                    key={i}
                    title={tag.title}
                    color={tag.hex_color}
                    tag_id={tag.tag_id}
                    taskId={tag.task_id}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-175 w-full absolute bottom-0 left-0 p-5 flex items-center">
          <input
            type="text"
            className="px-4 py-2 w-full rounded-md flex-grow mr-2"
            placeholder="Add your own tags"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                createTag();
                setTitle("");
              }
            }}
          />
          <input
            type="color"
            className="rounded-md"
            value={hexColor ? hexColor : "#ffffff"}
            onChange={(e) => setHexColor(e.target.value)}
          />
        </div>
      </>
    </Modal>
  );
};

export default AllTags;
