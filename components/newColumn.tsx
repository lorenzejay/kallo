import { AiOutlineClose } from "react-icons/ai";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import { queryClient } from "../utils/queryClient";
import { useMutation } from "@tanstack/react-query";
import supabase from "../utils/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
// import useUser from "../hooks/useUser";

interface NewColumnProps {
  openNewColumn: boolean;
  setOpenNewColumn: (x: boolean) => void;
  newColumnTitle: string;
  setNewColumnTitle: (x: string) => void;
  projectId: string;
}

const NewColumn = ({
  openNewColumn,
  setOpenNewColumn,
  newColumnTitle,
  setNewColumnTitle,
  projectId,
}: NewColumnProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const user = useUser();
  const createNewColumns = async () => {
    if (user === null || !projectId) return;
    // need to check how many columns exist inside this project;
    const { count, error: checkerError } = await supabase
      .from("columns")
      .select("project_associated", { count: "exact", head: true })
      .eq("project_associated", projectId);
    if (checkerError) throw checkerError;

    const { data: insertData, error } = await supabase.from("columns").insert([
      {
        name: newColumnTitle,
        project_associated: projectId,
        index: count,
      },
    ]);
    if (error) throw new Error(error.message);
    return insertData;
  };
  const { mutateAsync: newColumn } = useMutation(createNewColumns, {
    onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
  });

  const handleAddNewColumn = () => {
    newColumn()
      .then(() => {
        setOpenNewColumn(false);
        setNewColumnTitle("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className={`rounded-md shadow-md absolute h-auto w-auto top-0 p-3 transition-all duration-500  ${
        isDarkMode ? "card-color" : "bg-gray-100"
      } ${openNewColumn ? "block" : "hidden"}  `}
    >
      <input
        placeholder="Enter Title"
        value={newColumnTitle}
        onChange={(e) => setNewColumnTitle(e.target.value)}
        name="newTitle"
        className={`my-2  p-2 ${
          isDarkMode
            ? "bg-gray-500 placeholder-white text-white"
            : "placeholder-black text-black bg-white"
        }`}
      />

      <div className="flex float-right">
        <button onClick={() => setOpenNewColumn(false)} className="mr-1">
          <AiOutlineClose size={20} />
        </button>
        <button
          className="p-2 bg-gray-120 rounded-md disabled:opacity-50"
          disabled={newColumnTitle === ""}
          onClick={handleAddNewColumn}
        >
          Add Column
        </button>
      </div>
    </div>
  );
};

export default NewColumn;
