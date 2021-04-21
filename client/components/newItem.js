import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { configWithToken } from "../functions";

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
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const handleAddItem = async () => {
    if (!column && !projectId) return;
    const generateManualUuid = uuid();
    const columnItemsCopy = column.items;
    // console.log(columnItemsCopy);
    // console.log(columns);
    await columnItemsCopy.push({ id: generateManualUuid, content: newItemTitle, tags: [] });
    await setColumns([...columns]);
    // const config = configWithToken(userInfo.token);
    // console.log("column", columns);
    // await axios.post(
    //   `/api/projects/add-new-task/${projectId}`,
    //   { task_id: generateManualUuid, title: newItemTitle },
    //   config
    // );
    console.log("new item added");
    await setOpenNewItem(false);
    await setNewItemTitle("");
    // console.log(columnItemsCopy);
    // console.log("columns", columns);

    // setColumns({ ...columns, [id]: { ...column, items: column.items } });
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
