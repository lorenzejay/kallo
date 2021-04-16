import { AiOutlineClose } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { v4 as uuid } from "uuid";

const NewItem = ({
  openNewItem,
  setOpenNewItem,
  newItemTitle,
  setNewItemTitle,
  columns,
  setColumns,
  column,
}) => {
  const handleAddItem = () => {
    const columnItemsCopy = column.items;
    columnItemsCopy.push({ id: uuid(), content: newItemTitle });

    // console.log(column);
    // console.log(columnItemsCopy);
    // console.log("columns", columns);

    // setColumns({ ...columns, [id]: { ...column, items: column.items } });
    setColumns([...columns]);
    setOpenNewItem(false);
    setNewItemTitle("");
  };
  return (
    <div
      className={`card-color my-3 p-3 w-64 rounded-md ${openNewItem ? "block" : "hidden"}`}
      style={{ zIndex: 20 }}
    >
      <textarea
        placeholder="Enter Title"
        value={newItemTitle}
        onChange={(e) => setNewItemTitle(e.target.value)}
        className="p-1 my-3 w-full card-color"
      />
      <div className="flex float-right">
        <button onClick={() => setOpenNewItem(false)} className="mr-1">
          <AiOutlineClose className="text-white" size={20} />
        </button>
        <button onClick={handleAddItem} className="p-2 bg-blue-500 rounded-md">
          Add Item
        </button>
      </div>
    </div>
  );
};

export default NewItem;
