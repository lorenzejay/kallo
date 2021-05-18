import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { AiOutlineClose } from "react-icons/ai";
import { configWithToken } from "../functions";
import { getBoardColumns } from "../redux/Actions/projectActions";

const NewColumn = ({
  openNewColumn,
  setOpenNewColumn,
  newColumnTitle,
  setNewColumnTitle,
  columns,
  setColumns,
  projectId,
}) => {
  // console.log("projectId", projectId);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const handleAddNewColumn = () => {
    if (newColumnTitle === "" && !projectId) return;
    // create the column object
    setColumns([
      ...columns,
      {
        id: uuid(),
        name: newColumnTitle,
        items: [],
      },
    ]);

    // const config = configWithToken(userInfo.token);
    // console.log(columns);
    // await axios.put(`/api/projects/add-column/${projectId}`, { columns }, config);
    setOpenNewColumn(false);
    setNewColumnTitle("");
  };

  // console.log("newColumnTitle", newColumnTitle);
  // console.log("columns", columns);
  //every time column changes we push to the db

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
