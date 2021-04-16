import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { GrFormClose } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { configWithToken } from "../functions";

const NewColumn = ({
  openNewColumn,
  setOpenNewColumn,
  newColumnTitle,
  setNewColumnTitle,
  columns,
  setColumns,
  projectId,
}) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleAddNewColumn = async () => {
    if (newColumnTitle === "") return;
    //create the column object
    await setColumns([
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
  //every time column changes we push to the db
  useEffect(() => {
    const config = configWithToken(userInfo.token);

    axios.put(`/api/projects/add-column/${projectId}`, { columns }, config);
  }, [columns]);

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

      <div className="flex float-right">
        <button onClick={() => setOpenNewColumn(false)} className="mr-1">
          <AiOutlineClose className="text-white" size={20} />
        </button>
        <button className="p-2 bg-blue-500 rounded-md" onClick={handleAddNewColumn}>
          Add Column
        </button>
      </div>
    </div>
  );
};

export default NewColumn;
