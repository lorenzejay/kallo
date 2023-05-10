import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useMemo } from "react";
import { FormEvent, useEffect, useState } from "react";
import { FaAngleLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import AllTags from "../../components/AllTags";
import Dropdown from "../../components/dropdown";
import Layout from "../../components/layout";
import { DarkModeContext } from "../../context/darkModeContext";
import { Status, Task, Todo as TodoType } from "../../types/projectTypes";
import { queryClient } from "../../utils/queryClient";
import supabase from "../../utils/supabaseClient";
import Todo from "../../components/Todo";
import ProtectedWrapper from "../../components/Protected";
import useCheckAccessStatus from "../../hooks/useProjectAccess";
import Tag from "../../components/Tag";

const Tasks = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(DarkModeContext);
  //also has access to taskId in router.query
  const { taskId, projectId } = router.query;

  const [taskTitle, setTaskTitle] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [userStatus, setUserStatus] = useState<Status | undefined>();

  const fetchTags = async () => {
    if (!taskId) return;
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .match({ task_id: taskId });
    if (error) throw new Error(error.message);
    return data;
  };
  const { data: allTags } = useQuery([`allTags-${taskId}`], fetchTags, {
    enabled: !!taskId,
  });

  const fetchUsersProjectAccess = async () => {
    if (!projectId) return;
    const userProjectStatus = await useCheckAccessStatus(projectId as string);
    setUserStatus(userProjectStatus);
  };
  useEffect(() => {
    fetchUsersProjectAccess();
  }, [projectId]);
  const fetchTask = async () => {
    // make sure the user can even see this project
    if (!taskId) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .match({ task_id: taskId })
      .single();
    if (error) throw error;
    return data;
  };

  //fetch todos
  const fetchTodos = async (): Promise<TodoType[] | undefined> => {
    //no config , add auth protection here
    if (!taskId) return;
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .match({ task_id: taskId });
    if (error) throw new Error(error.message);
    return data as TodoType[];
  };
  //add todo
  const handleAddTodo = async (): Promise<Task | undefined> => {
    if (!taskId || !projectId) return;
    if (userStatus === Status.viewer || userStatus === Status.none) {
      window.alert("You do not have access to modify this file");
      return;
    }
    const { count, error: checkerError } = await supabase
      .from("todos")
      .select("task_id", { count: "exact", head: true })
      .eq("task_id", taskId);
    if (checkerError) throw checkerError.message;
    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          description: newTodoTitle,
          task_id: taskId,
          index: count,
        },
      ])
      .select();
    if (error) throw error;
    return data[0] as Task;
  };

  const { data: taskDetails } = useQuery([`taskDetails-${taskId}`], fetchTask, {
    enabled: !!taskId,
  });
  const { data: allTodos } = useQuery([`allTodos-${taskId}`], fetchTodos, {
    enabled: !!taskId,
  });

  const completedTodos = useMemo(() => {
    // show only completed todos
    const completedTodos = allTodos?.filter((todo) => todo.is_checked === true);
    return completedTodos;
  }, [allTodos]);
  const notCompletedTodos = useMemo(() => {
    // show only uncompleted todos
    const unfinishedTodos = allTodos?.filter(
      (todo) => todo.is_checked === false
    );
    return unfinishedTodos;
  }, [allTodos]);

  const { mutateAsync: createTodo } = useMutation(handleAddTodo, {
    onSuccess: () => queryClient.invalidateQueries([`allTodos-${taskId}`]),
  });

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
    if (taskDetails) {
      setTaskTitle(taskDetails.title);
    }
  }, [taskDetails]);

  const deleteTask = async () => {
    if (
      userStatus === Status.none ||
      userStatus === Status.viewer ||
      userStatus === Status.editor
    )
      return;
    if (!taskId) return;
    const { status, error } = await supabase
      .from("tasks")
      .delete()
      .match({ task_id: taskId });
    if (error) throw new Error(error.message);
    return status;
  };
  const { mutateAsync: deletingTask } = useMutation(deleteTask, {
    onSuccess: () => queryClient.invalidateQueries([`columns-${projectId}`]),
  });
  const handleDeleteTask = async () => {
    if (userStatus === Status.viewer || userStatus === Status.none)
      return window.alert("You do not have access to modify this file");
    const res = await deletingTask();
    if (res === 200) {
      router.back();
    }
  };

  return (
    <ProtectedWrapper>
      <Head>
        <title>{taskTitle} | Kallo</title>
      </Head>
      <Layout>
        <main className="min-h-screen">
          {allTags && (
            <div className="flex items-center flex-wrap">
              {allTags.map((tag, i) => (
                <Tag
                  key={i}
                  title={tag.title}
                  color={tag.hex_color}
                  tag_id={tag.tag_id}
                  taskId={tag.task_id}
                />
              ))}
            </div>
          )}
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

                    {userStatus === Status.admin ||
                      (userStatus === Status.owner && (
                        <div className="flex items-center justify-around w-32 border-t pt-5">
                          <FaTrash />
                          <button onClick={handleDeleteTask}>Delete</button>
                          <hr />
                        </div>
                      ))}
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
              {allTodos && projectId && completedTodos && (
                <>
                  <p>Tasks - {completedTodos.length}</p>
                  {completedTodos.map((todo, i) => (
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
              {allTodos && projectId && notCompletedTodos && (
                <>
                  <p>Completed - {notCompletedTodos.length}</p>
                  {notCompletedTodos.map((todo, i) => (
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
    </ProtectedWrapper>
  );
};

export default Tasks;
