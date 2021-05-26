import { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { DarkModeContext } from "../context/darkModeContext";
import { updateCols } from "../redux/Actions/projectActions";

const initialBlock = { id: uuid(), html: "", tag: "p" };
const NewItem = ({
  openNewItem,
  setOpenNewItem,
  newItemTitle,
  setNewItemTitle,
  columns,
  setColumns,
  column,
  projectId,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const handleAddItem = () => {
    if (!column && !projectId) return;
    const generateManualUuid = uuid();
    const columnItemsCopy = column.items;
    // console.log(columns);

    columnItemsCopy.push({
      id: generateManualUuid,
      content: newItemTitle,
      tags: [],
      markdown: [initialBlock],
    });

    setColumns([...columns]);
    dispatch(updateCols(columns, projectId));
    setOpenNewItem(false);
    setNewItemTitle("");
    // console.log("columns", columns);
    // console.log("columnItemsCopy", columnItemsCopy);
  };
  return (
    <div
      className={`${isDarkMode ? "card-color" : "bg-gray-200"} my-3 p-3 w-64 rounded-md ${
        openNewItem ? "block" : "hidden"
      }`}
      style={{ zIndex: 20 }}
    >
      <textarea
        placeholder="Enter Title"
        value={newItemTitle}
        onChange={(e) => setNewItemTitle(e.target.value)}
        className={`p-2 my-3 w-full ${
          isDarkMode ? "card-color placeholder-white" : "bg-gray-200 placeholder-black"
        }`}
      />
      <div className="flex float-right">
        <button onClick={() => setOpenNewItem(false)} className="mr-1">
          <AiOutlineClose size={20} />
        </button>
        <button onClick={handleAddItem} className="p-2 bg-blue-500 rounded-md">
          Add Item
        </button>
      </div>
    </div>
  );
};

export default NewItem;
