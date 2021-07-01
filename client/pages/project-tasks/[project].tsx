import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout";

import { DarkModeContext } from "../../context/darkModeContext";
import { configWithToken } from "../../functions";
import { getBoardColumns } from "../../redux/Actions/projectActions";
import { RootState } from "../../redux/store";
import { Task } from "../../types/projectTypes";

const Tasks = () => {
 
  const dispatch = useDispatch();
  const router = useRouter();
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  //also has access to taskId in router.query
  const { project } = router.query;
  const projectColumns = useSelector(
    (state: RootState) => state.projectColumns
  );
  const { boardColumns } = projectColumns;
  const [task] = useState<Task>({} as Task);
  const [tasksColumn, setTasksColumn] = useState({});
  // const [openSidePanel, setOpenSidePanel] = useState(false);
  const [_, setOpenUpdateTitle] = useState(false);
  const [itemName, setItemName] = useState("");
  // boardColumns && console.log(boardColumns.columns);

  useEffect(() => {
    if (!project) return;

    dispatch(getBoardColumns(project.toString()));
  }, []);
  useEffect(() => {
    if (!task) return;
    setItemName(task.content);
  }, [task]);
  console.log("task", task);
  // function getTask(object: {}, taskId:string) {
  //   let result;
  //   if (!object || typeof object !== "object") return;
  //   Object.values(object).some((v) => {
  //     if (v === taskId) return (result = object);
  //     return (result = getTask(v, taskId));
  //   });
  //   return result;
  // }
  // function getTask(object: Task, taskId: string) {
  //   let result: Items = {} as Task;
  //   if (!object || typeof object !== "object") return;
  //   Object.values(object).some((v) => {
  //     if (v === taskId) return (result = object);
  //     const res = getTask(object, taskId);
  //     if (!res) return;
  //     result = res;
  //   });
  //   return result;
  // }

  // useEffect(() => {
  //   if (!boardColumns || !taskId) return;
  //   const res = getTask(boardColumns, taskId.toString())
  //   setTask(res);
  // }, [boardColumns]);
  //find which list its in
  // useEffect(() => {
  //   if (task && boardColumns && boardColumns) {
  //     const tasksCol = boardColumns.find((e) =>
  //       e.items.find((t) => {
  //         if (t.id === task.id) {
  //           return t;
  //         }
  //       })
  //     );
  //     setTasksColumn(tasksCol);
  //   }
  // }, [boardColumns, task]);

  // console.log("task", task);
  // console.log("boardColumns", boardColumns);
  // console.log("tasksColumn", tasksColumn);
  // const handleDeleteTask = async () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this task?"
  //   );
  //   if (!confirmDelete) return;
  //   const deleteIndex = tasksColumn.items.indexOf(task);
  //   tasksColumn.items.splice(deleteIndex, 1);
  //   // console.log("boardColumns", boardColumns);
  //   const config = configWithToken(userInfo.token);
  //   // console.log("deleting from db...");
  //   // console.log("boardColumns", boardColumns);
  //   const columns = boardColumns;
  //   await axios.put(`/api/projects/add-column/${project}`, { columns }, config);
  //   await router.push(`/projects/${project}`);
  // };

  // const handleUpdateTaskColumnName = async () => {
  //   if (itemName === "" || !itemName)
  //     return window.alert("New title cannot be empty.");
  //   //  console.log("task", task);
  //   task.content = itemName;
  //   if (!userInfo?.token) return;
  //   const config = configWithToken(userInfo.token);
  //   const columns = boardColumns;

  //   await axios.put(`/api/projects/add-column/${project}`, { columns }, config);
  //   window.alert("Updated Item Title");
  //   setOpenUpdateTitle(false);
  // };
  // console.log("tasksColumn", tasksColumn);
  // console.log("boardColumns", boardColumns);
  return (
    <>
      <Head>
        <title>{itemName} | Kallo</title>
      </Head>
      <Layout>
        <>
          <h1>Todo List</h1>
        </>
      </Layout>
    </>
  );
};

export default Tasks;
