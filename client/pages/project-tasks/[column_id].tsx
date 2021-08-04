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
import { TagsType, Task, Todo as TodoType } from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";

const Tasks = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);
  const auth = useAuth();
  const { userToken } = auth;
  //also has access to taskId in router.query
  const { taskId } = router.query;

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

  const fetchTags = async () => {
    const { data } = await axios.get<TagsType[]>(`/api/tags/fetch/${taskId}`);
    return data;
  };

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
    //no config , add auth protection here
    if (!taskId) return;
    const { data } = await axios.post(`/api/todos/create-todo/${taskId}`, {
      description: newTodoTitle,
    });
    return data;
  };

  const { data: taskDetails } = useQuery(`taskDetails-${taskId}`, fetchTask);
  const { data: allTodos } = useQuery(`allTodos-${taskId}`, fetchTodos);
  const { data: allTags } = useQuery(`allTags-${taskId}`, fetchTags);
  const { mutateAsync: createTodo } = useMutation(handleAddTodo, {
    onSuccess: () => queryClient.invalidateQueries(`allTodos-${taskId}`),
  });
  // console.log("allTodos", allTodos);
  const handleCreateTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (newTodoTitle === "") {
      return window.alert("Todos cannot be blank.");
    }
    await createTodo();
    setNewTodoTitle("");
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

  const deleteTodo = async () => {
    if (!userToken || !taskId) return;
    const config = configWithToken(userToken);
    await axios.delete(`/api/tasks/delete-task/${taskId}`, config);
  };
  const { mutateAsync: moveTaskAcrossCols } = useMutation(deleteTodo, {
    onSuccess: () => queryClient.invalidateQueries(`columns`),
  });
  const handleDeleteTodo = async () => {
    await moveTaskAcrossCols();
    router.back();
  };
  console.log("allTags", allTags);
  return (
    <>
      <Head>
        <title>{taskTitle} | Kallo</title>
      </Head>
      <Layout>
        <main className="min-h-screen">
          {taskId && (
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
                    <AllTags taskId={taskId.toString()} />
                    <div className="flex items-center justify-around w-32 border-t pt-5">
                      <FaTrash />
                      <button onClick={handleDeleteTodo}>Delete</button>
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
              {allTodos && allTodos.notCompletedTodos && (
                <>
                  <p>Tasks - {allTodos.notCompletedTodos.length}</p>
                  {allTodos.notCompletedTodos.map((todo, i) => (
                    <Todo
                      todo={todo}
                      index={i}
                      key={i}
                      taskId={taskId.toString()}
                    />
                  ))}
                </>
              )}
              {allTodos && allTodos.completedTodos && (
                <>
                  <p>Completed - {allTodos.completedTodos.length}</p>
                  {allTodos.completedTodos.map((todo, i) => (
                    <Todo
                      todo={todo}
                      index={i}
                      key={i}
                      taskId={taskId.toString()}
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
