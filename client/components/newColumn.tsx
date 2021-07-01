import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { updateCols } from "../redux/Actions/projectActions";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import { RootState } from "../redux/store";
import { Columns } from "../types/projectTypes";
import { v4 as uuid } from "uuid";
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
  // console.log("projectId", projectId);
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const projectColumns = useSelector(
    (state: RootState) => state.projectColumns
  );
  const { boardColumns, loading } = projectColumns;
  const handleAddNewColumn = () => {
    console.log("new column added");
    const boardColumnsCopy: Columns[] = [...boardColumns];

    if (newColumnTitle === "" && !projectId) return;
    // create the column object
    const colId = uuid();
    boardColumnsCopy.push({
      id: colId,
      name: newColumnTitle,
      items: [],
    });

    dispatch(updateCols(boardColumnsCopy, projectId));
    setOpenNewColumn(false);
    setNewColumnTitle("");
  };

  // console.log("newColumnTitle", newColumnTitle);
  // console.log("columns", columns);
  //every time column changes we push to the db

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
          className="p-2 bg-blue-500 rounded-md"
          onClick={handleAddNewColumn}
        >
          Add Column
        </button>
      </div>
    </div>
  );
};

export default NewColumn;
