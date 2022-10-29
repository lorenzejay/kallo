import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../utils/supabaseClient";

type TagsProps = {
  title: string;
  color: string;
  tag_id: string;
  taskId: string;
};
const Tag = ({ title, color, tag_id, taskId }: TagsProps) => {
  const queryClient = useQueryClient();

  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  const [tagTitle, setTagTitle] = useState(title);

  const handleUpdateTagTitle = async () => {
    if (!tag_id) return;
    const { error } = await supabase
      .from("tags")
      .update({ title: tagTitle })
      .match({ tag_id });
    if (error) throw new Error(error.message);
  };

  const handleDeleteTag = async () => {
    if (!tag_id) return;
    const { error } = await supabase.from("tags").delete().match({ tag_id });
    if (error) throw new Error(error.message);
  };
  useEffect(() => {
    if (title) {
      setTagTitle(title);
    }
  }, [title]);
  const { mutateAsync: updateTagTitle } = useMutation(handleUpdateTagTitle, {
    onSuccess: () => queryClient.invalidateQueries([`allTags-${taskId}`]),
  });
  const { mutateAsync: deleteTag } = useMutation(handleDeleteTag, {
    onSuccess: () => queryClient.invalidateQueries([`allTags-${taskId}`]),
  });
  return (
    <div
      className="rounded-md px-3 py-1 m-2 text-black relative w-16 whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      {!toggleDoubleClickEffect ? (
        <p onDoubleClick={() => setToggleDoubleClickEffect(true)}>{tagTitle}</p>
      ) : (
        <input
          value={tagTitle}
          className="bg-none text-black"
          onChange={(e) => setTagTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              // updateColName(columnName);
              updateTagTitle();
              setToggleDoubleClickEffect(false);
            }
          }}
        />
      )}
      {toggleDoubleClickEffect && (
        <button
          className="absolute right-0 top-0"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this tag?")) {
              deleteTag();
            }
          }}
        >
          <AiOutlineClose
            size={18}
            className="cursor-pointer pointer-events-none"
          />{" "}
        </button>
      )}
    </div>
  );
};

export default Tag;
