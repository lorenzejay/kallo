import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { Status, Todo as TodoType } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";
import supabase from "../utils/supabaseClient";
import useCheckAccessStatus from "../hooks/useProjectAccess";

type TodoProps = {
  todo: TodoType;
  index: number;
  taskId: string;
  project_id: string;
};
const Todo = ({ todo, index, taskId, project_id }: TodoProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [showTodoSettings, setShowTodoSettings] = useState(false);

  const [todoDescription, setTodoDescription] = useState("");
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);
  const [userStatus, setUserStatus] = useState<Status | undefined>();
  const fetchUsersProjectAccess = async () => {
    if (!project_id) return;
    const userProjectStatus = await useCheckAccessStatus(project_id as string);
    setUserStatus(userProjectStatus);
  };
  useEffect(() => {
    fetchUsersProjectAccess();
  }, [project_id]);

  useEffect(() => {
    if (todo) {
      setTodoDescription(todo.description);
    }
  }, []);
  const handleUpdateTodoIsCompleted = async () => {
    if (userStatus === Status.viewer || userStatus === Status.none)
      return window.alert("You do not have access to modify this file");
    if (!todo || !todo.todo_id) return;
    const { error } = await supabase
      .from("todos")
      .update({ is_checked: !todo.is_checked })
      .match({ todo_id: todo.todo_id });
    if (error) throw error;
  };

  const handleUpdateTodoDescription = async (description: string) => {
    if (userStatus === Status.viewer || userStatus === Status.none)
      return window.alert("You do not have access to modify this file");
    if (!todo.todo_id) return;
    const { error } = await supabase
      .from("todos")
      .update({
        description,
      })
      .eq("todo_id", todo.todo_id);
    if (error) throw new Error(error.message);
  };

  //on hover we need to show a delete component
  const handleDeleteTodo = async () => {
    if (userStatus === Status.viewer || userStatus === Status.none)
      return window.alert("You do not have access to modify this file");
    if (!todo || !todo.todo_id) return;
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("todo_id", todo.todo_id);
    if (error) throw new Error(error.message);
  };

  const { mutateAsync: updateIsChecked } = useMutation(
    handleUpdateTodoIsCompleted,
    {
      onSuccess: () => queryClient.invalidateQueries([`allTodos-${taskId}`]),
    }
  );
  const { mutateAsync: updateDescription } = useMutation(
    handleUpdateTodoDescription,
    {
      onSuccess: () => queryClient.invalidateQueries([`allTodos-${taskId}`]),
    }
  );

  const { mutateAsync: deleteTodo } = useMutation(handleDeleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries([`allTodos-${taskId}`]);
    },
  });

  return (
    <div
      className={`p-3 my-3 border rounded-md flex items-center  ${
        isDarkMode ? "card-color border-0" : "bg-gray-150"
      }`}
      key={index}
      onMouseEnter={() => setShowTodoSettings(true)}
      onMouseLeave={() => setShowTodoSettings(false)}
    >
      <input
        type="checkbox"
        checked={todo.is_checked}
        className="mr-3 disabled:opacity-75"
        onChange={() => updateIsChecked()}
        disabled={
          userStatus === Status.none || userStatus === Status.viewer
            ? true
            : false
        }
      />
      {toggleDoubleClickEffect ? (
        <input
          type="text"
          className={`w-full bg-transparent ${
            todo.is_checked ? "line-through" : ""
          } `}
          value={todoDescription}
          onChange={(e) => {
            setTodoDescription(e.target.value);
            updateDescription(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              setToggleDoubleClickEffect(false);
            }
          }}
        />
      ) : (
        <p
          onDoubleClick={() => setToggleDoubleClickEffect(true)}
          className={`w-full flex-grow bg-transparent ${
            todo.is_checked
              ? "line-through opacity-50 transition duration-300 ease-in-out"
              : ""
          } `}
        >
          {todoDescription}
        </p>
      )}
      {showTodoSettings && (
        <button type="button" onClick={() => deleteTodo()}>
          <FaTrash className="pointer-events-none" />
        </button>
      )}
    </div>
  );
};

export default Todo;
