import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { FaEllipsisH, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EditablePage from "../../components/editablePage";
import Labels from "../../components/labels";
import Layout from "../../components/layout";
import Loader from "../../components/loader";
import Modal from "../../components/modal";
import SidePanel from "../../components/sidePanel";
import { DarkModeContext } from "../../context/darkModeContext";
import { configWithToken } from "../../functions";
import { getBoardColumns } from "../../redux/Actions/projectActions";

const Tasks = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { taskId, project } = router.query;
  const projectColumns = useSelector((state) => state.projectColumns);
  const { boardColumns, loading } = projectColumns;
  const [task, setTask] = useState({});
  const [tasksColumn, setTasksColumn] = useState({});
  const [openSidePanel, setOpenSidePanel] = useState(false);
  const [openUpdateTitle, setOpenUpdateTitle] = useState(false);
  const [itemName, setItemName] = useState("");
  // boardColumns && console.log(boardColumns.columns);

  useEffect(() => {
    if (!project) return;
    dispatch(getBoardColumns(project));
  }, []);
  useEffect(() => {
    if (!task) return;
    setItemName(task.content);
  }, [task]);

  function getTask(object, taskId) {
    let result;
    if (!object || typeof object !== "object") return;
    Object.values(object).some((v) => {
      if (v === taskId) return (result = object);
      return (result = getTask(v, taskId));
    });
    return result;
  }

  useEffect(() => {
    if (boardColumns) {
      setTask(getTask(boardColumns, taskId));
    }
  }, [boardColumns]);
  //find which list its in
  useEffect(() => {
    if (task && boardColumns && boardColumns) {
      const tasksCol = boardColumns.find((e) =>
        e.items.find((t) => {
          if (t.id === task.id) {
            return t;
          }
        })
      );
      setTasksColumn(tasksCol);
    }
  }, [boardColumns, task]);

  // console.log("task", task);
  // console.log("boardColumns", boardColumns);
  // console.log("tasksColumn", tasksColumn);
  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    const deleteIndex = tasksColumn.items.indexOf(task);
    tasksColumn.items.splice(deleteIndex, 1);
    // console.log("boardColumns", boardColumns);
    const config = configWithToken(userInfo.token);
    // console.log("deleting from db...");
    // console.log("boardColumns", boardColumns);
    const columns = boardColumns;
    await axios.put(`/api/projects/add-column/${project}`, { columns }, config);
    await router.push(`/projects/${project}`);
  };

  const handleUpdateTaskColumnName = async () => {
    if (itemName === "" || !itemName) return window.alert("New title cannot be empty.");
    //  console.log("task", task);
    task.content = itemName;
    const config = configWithToken(userInfo.token);
    const columns = boardColumns;

    await axios.put(`/api/projects/add-column/${project}`, { columns }, config);
    window.alert("Updated Item Title");
    setOpenUpdateTitle(false);
  };
  // console.log("tasksColumn", tasksColumn);
  // console.log("boardColumns", boardColumns);
  return (
    <>
      <Head>
        <title>{itemName} | Kallo</title>
      </Head>
      <Layout>
        {loading && <Loader />}
        {task && tasksColumn && !loading && (
          <main className={`bg-blue min-h-screen ${isDarkMode ? "text-white" : "text-black"}`}>
            <div className="px-2 lg:px-0  flex flex-row ">
              <section className="flex-grow">
                {itemName}
                <p>
                  <span className="text-gray-300">list in </span>

                  {tasksColumn.name}
                </p>
              </section>
              <section>
                <button
                  onClick={() => setOpenSidePanel(!openSidePanel)}
                  className="flex justify-end"
                >
                  <FaEllipsisH size={30} />
                </button>
                {openSidePanel && (
                  <SidePanel>
                    <p>Actions</p>
                    <ul>
                      <li className="hover:bg-gray-300 cursor-pointer rounded-sm">
                        <Labels task={task} projectId={project} setTask={setTask} />
                      </li>
                      <li className="hover:bg-gray-300  cursor-pointer rounded-sm">
                        <Modal
                          modalName="Update Item Title"
                          openModal={openUpdateTitle}
                          contentHeight="h-48"
                          setOpenModal={setOpenUpdateTitle}
                        >
                          <h3>Update Title</h3>
                          <p className="my-1">{itemName || "Enter a new title"}</p>
                          <div className="flex items-center">
                            <input
                              value={itemName}
                              onChange={(e) => setItemName(e.target.value)}
                              className="bg-gray-400 text-black px-2 py-1 rounded-sm flex-grow "
                              minLength={3}
                              maxLength={25}
                            />
                            <button
                              className="ml-3 px-3 py-1 rounded-sm bg-blue-400"
                              onClick={handleUpdateTaskColumnName}
                            >
                              Update
                            </button>
                          </div>
                        </Modal>
                      </li>
                      <li className="hover:bg-gray-300 cursor-pointer rounded-sm">
                        <button className="px-3 py-1 flex items-center" onClick={handleDeleteTask}>
                          <FaTrash size={14} /> Delete Task
                        </button>
                      </li>
                    </ul>
                  </SidePanel>
                )}
              </section>
            </div>
            <div>
              <EditablePage
                task={task}
                setTask={setTask}
                projectId={project}
                boardColumns={boardColumns}
              />
            </div>
          </main>
        )}
      </Layout>
    </>
  );
};

export default Tasks;
