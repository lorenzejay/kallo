import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FormEvent, useEffect } from "react";
import { useState } from "react";
import { FaAngleLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useMutation, useQuery } from "react-query";
import AllTags from "../../components/AllTags";
import Dropdown from "../../components/dropdown";
import Layout from "../../components/layout";
import Todo from "../../components/Todo";
import { DarkModeContext } from "../../context/darkModeContext";
import { configWithToken } from "../../functions";
import { useAuth } from "../../hooks/useAuth";
import {
  ReturnedApiStatus,
  Task,
  Todo as TodoType,
} from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";

const Tasks = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const { userToken } = auth;
  //also has access to taskId in router.query
  const { taskId, projectId } = router.query;

  const [taskTitle, setTaskTitle] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const fetchTask = async () => {
    if (!userToken || !taskId) return;
    const config = configWithToken(userToken);
    const { data } = await axios.get<Task>(
      `/api/tasks/get-task/${taskId}`,
      config
    );
    return data;
  };

  // const fetchTags = async () => {
  //   const { data } = await axios.get<TagsType[]>(`/api/tags/fetch/${taskId}`);
  //   return data;
  // };

  type FetchedTodos = {
    completedTodos: TodoType[];
    notCompletedTodos: TodoType[];
  };
  //fetch todos
  const fetchTodos = async () => {
    //no config , add auth protection here
    if (!taskId) return;
    const { data } = await axios.get<FetchedTodos>(
      `/api/todos/get-all-todos/${taskId.toString()}`
    );

    return data;
  };
  //add todo
  const handleAddTodo = async () => {
    if (!taskId || !projectId || !userToken) return;

    const config = configWithToken(userToken);
    const { data } = await axios.post<ReturnedApiStatus | undefined>(
      `/api/todos/create-todo/${projectId}/${taskId}`,
      {
        description: newTodoTitle,
      },
      config
    );
    if (!data)
      return window.alert("You do not have privileges to add a new todo.");
    return data;
  };

  const { data: taskDetails } = useQuery(`taskDetails-${taskId}`, fetchTask);
  const { data: allTodos } = useQuery(`allTodos-${taskId}`, fetchTodos);
  // const { data: allTags } = useQuery(`allTags-${taskId}`, fetchTags);
  const { mutateAsync: createTodo } = useMutation(handleAddTodo, {
    onSuccess: () => queryClient.invalidateQueries(`allTodos-${taskId}`),
  });
  // console.log("allTodos", allTodos);
  const handleCreateTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (newTodoTitle === "") {
      return window.alert("Todos cannot be blank.");
    }
    const res = await createTodo();
    if (res) {
      setNewTodoTitle("");
    }
  };
  useEffect(() => {
    if (!userToken || userToken === null) {
      router.push("/signin");
    }
  }, [userToken]);
  useEffect(() => {
    if (taskDetails) {
      setTaskTitle(taskDetails.title);
    }
  }, [taskDetails]);

  const deleteTask = async () => {
    if (!userToken || !taskId) return;
    const config = configWithToken(userToken);
    const { data } = await axios.delete<ReturnedApiStatus | undefined>(
      `/api/tasks/delete-task/${projectId}/${taskId}`,
      config
    );
    if (!data)
      return window.alert(
        "You do not have project privileges to delete the task."
      );
    return data;
  };
  const { mutateAsync: deletingTask } = useMutation(deleteTask, {
    onSuccess: () => queryClient.invalidateQueries(`columns`),
  });
  const handleDeleteTask = async () => {
    const res = await deletingTask();
    if (res) {
      router.back();
    }
  };
  // console.log("allTags", allTags);
  return (
    <>
      <Head>
        <title>{taskTitle} | Kallo</title>
      </Head>
      <Layout>
        <main className="min-h-screen">
          {taskId && projectId && (
            <>
              <section className="w-full max-w-full flex items-center">
                <button
                  onClick={() => router.back()}
                  className={`mr-3 p-1 border rounded-md ${
                    isDarkMode ? "darkBody" : "bg-gray-150"
                  } `}
                >
                  <FaAngleLeft />
                </button>

                <h1 className="flex-grow">{taskTitle}</h1>
                <Dropdown>
                  <>
                    <AllTags
                      taskId={taskId.toString()}
                      projectId={projectId.toString()}
                    />
                    <div className="flex items-center justify-around w-32 border-t pt-5">
                      <FaTrash />
                      <button onClick={handleDeleteTask}>Delete</button>
                      <hr />
                    </div>
                  </>
                </Dropdown>
              </section>
              <form
                className="py-3 my-4 border-t border-b flex items-center"
                onSubmit={handleCreateTodo}
              >
                <button
                  className={`mr-3 border rounded-md ${
                    isDarkMode ? "darkBody" : "bg-gray-150"
                  } p-1`}
                  type="submit"
                >
                  <FaPlus />
                </button>
                <input
                  type="text"
                  placeholder="Add a todo..."
                  className="flex-grow border-none bg-transparent"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                />
              </form>
              {allTodos && projectId && allTodos.notCompletedTodos && (
                <>
                  <p>Tasks - {allTodos.notCompletedTodos.length}</p>
                  {allTodos.notCompletedTodos.map((todo, i) => (
                    <Todo
                      todo={todo}
                      index={i}
                      key={i}
                      taskId={taskId.toString()}
                      project_id={projectId.toString()}
                    />
                  ))}
                </>
              )}
              {allTodos && projectId && allTodos.completedTodos && (
                <>
                  <p>Completed - {allTodos.completedTodos.length}</p>
                  {allTodos.completedTodos.map((todo, i) => (
                    <Todo
                      todo={todo}
                      index={i}
                      key={i}
                      taskId={taskId.toString()}
                      project_id={projectId.toString()}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </main>
      </Layout>
    </>
  );
};

export default Tasks;
