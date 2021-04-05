import { v4 as uuid } from "uuid";

const NewColumn = ({
  openNewColumn,
  setOpenNewColumn,
  newColumnTitle,
  setNewColumnTitle,
  columns,
  setColumns,
}) => {
  const handleAddNewColumn = () => {
    if (newColumnTitle === "") return;
    //create the column object
    setColumns([
      ...columns,
      {
        id: uuid(),
        name: newColumnTitle,
        items: [],
      },
    ]);
    setOpenNewColumn(false);
    setNewColumnTitle("");
  };
  return (
    <div
      className={`rounded-md card-color absolute h-auto top-0 p-3 transition-all duration-500  ${
        openNewColumn ? "block" : "hidden"
      }`}
    >
      <input
        placeholder="Enter Title"
        value={newColumnTitle}
        onChange={(e) => setNewColumnTitle(e.target.value)}
        name="new column title"
        className="my-2 bg-gray-800 p-2 "
      />

      <div className="flex justify-between">
        <button className="p-2 bg-blue-500" onClick={handleAddNewColumn}>
          Add Column
        </button>
        <button onClick={() => setOpenNewColumn(false)}>X</button>
      </div>
    </div>
  );
};

export default NewColumn;
