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
      className={`card-color my-3 p-3 rounded-md ${openNewItem ? "block" : "hidden"}`}
      style={{ zIndex: 20 }}
    >
      <input
        placeholder="Enter Title"
        value={newItemTitle}
        onChange={(e) => setNewItemTitle(e.target.value)}
        className="p-1 my-3 card-color"
      />
      <div className="flex justify-between">
        <button onClick={handleAddItem} className="p-2 bg-blue-500 rounded-sm">
          Add Item
        </button>
        <button onClick={() => setOpenNewItem(false)}>X</button>
      </div>
    </div>
  );
};

export default NewItem;
