import axios from "axios";
import { useState } from "react";
import { FaTags } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { ReturnedApiStatus, TagsType } from "../types/projectTypes";

import Modal from "./modal";
import Tag from "./Tag";
type AllTagsProps = {
  taskId: string;
  projectId: string;
};
const AllTags = ({ taskId, projectId }: AllTagsProps) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { userToken } = auth;

  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [hexColor, setHexColor] = useState<string | null>(null);

  const fetchTags = async () => {
    const { data } = await axios.get<TagsType[]>(`/api/tags/fetch/${taskId}`);
    return data;
  };

  const handleAddTag = async () => {
    if (!userToken || !taskId || !projectId) return;
    const config = configWithToken(userToken);
    if (!title || title === "")
      return window.alert("You must have a title for your tag.");
    const { data } = await axios.post<ReturnedApiStatus | undefined>(
      `/api/tags/create/${projectId}/${taskId}`,
      {
        title: title,
        hex_color: hexColor !== null ? hexColor : "#ffffff",
      },
      config
    );
    if (!data)
      return window.alert("You do not have the privileges to add a tag");
    return data;
  };
  const { data: allTags } = useQuery(`allTags-${taskId}`, fetchTags);
  const { mutateAsync: createTag } = useMutation(handleAddTag, {
    onSuccess: () => queryClient.invalidateQueries(`allTags-${taskId}`),
  });
  // console.log(hexColor);
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
