import { AiOutlineClose } from "react-icons/ai";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import axios from "axios";
import { queryClient } from "../utils/queryClient";
import { useMutation } from "react-query";
import { useAuth } from "../hooks/useAuth";

type NewColumnProps = {
  openNewColumn: boolean;
  setOpenNewColumn: (x: boolean) => void;
  newColumnTitle: string;
  setNewColumnTitle: (x: string) => void;
  projectId: string;
};
const NewColumn = ({
  openNewColumn,
  setOpenNewColumn,
  newColumnTitle,
  setNewColumnTitle,
  projectId,
}: NewColumnProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const { userToken } = auth;

  const createNewColumns = async () => {
    if (!userToken) return;
    const config = configWithToken(userToken);
    await axios.post(
      `/api/columns/create-column/${projectId}`,
      {
        name: newColumnTitle,
      },
      config
    );
  };
  const { mutateAsync: newColumn } = useMutation(createNewColumns, {
    onSuccess: () => queryClient.invalidateQueries(`columns-${projectId}`),
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
