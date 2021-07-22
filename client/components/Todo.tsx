import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useMutation } from "react-query";
import { DarkModeContext } from "../context/darkModeContext";
import { configWithToken } from "../functions";
import UseUserToken from "../hooks/useUserToken";
import { Todo as TodoType } from "../types/projectTypes";
import { queryClient } from "../utils/queryClient";

type TodoProps = {
  todo: TodoType;
  index: number;
  taskId: string;
};
const Todo = ({ todo, index, taskId }: TodoProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [showTodoSettings, setShowTodoSettings] = useState(false);
  const userInfo = UseUserToken();
  let config:
    | {
        headers: {
          "Content-Type": string;
          token: string;
        };
      }
    | undefined;
  if (!userInfo || !userInfo.token) {
    config = undefined;
  } else {
    config = configWithToken(userInfo.token);
  }
  const [todoDescription, setTodoDescription] = useState("");
  const [toggleDoubleClickEffect, setToggleDoubleClickEffect] = useState(false);

  useEffect(() => {
    if (todo) {
      setTodoDescription(todo.description);
    }
  }, [todo]);
  const handleUpdateTodoIsCompleted = async () => {
    if (!todo || !todo.todo_id || !config) return;
    await axios.put(
      `/api/todos/update-todo-is-checked/${todo.todo_id}`,
      { is_checked: !todo.is_checked },
      config
    );
  };

  const handleUpdateTodoDescription = async (description: string) => {
    if (!todo || !todo.todo_id || !config) return;
    await axios.put(
      `/api/todos/update-todo-description/${todo.todo_id}`,
      { description },
      config
    );
  };

  //on hover we need to show a delete component
  const handleDeleteTodo = async () => {
    if (!todo || !todo.todo_id) return;
    await axios.delete(`/api/todos/delete-todo/${todo.todo_id}`, config);
  };

  const { mutateAsync: updateIsChecked } = useMutation(
    handleUpdateTodoIsCompleted,
    {
      onSuccess: () => queryClient.invalidateQueries(`allTodos-${taskId}`),
    }
  );
  const { mutateAsync: updateDescription } = useMutation(
    handleUpdateTodoDescription,
    {
      onSuccess: () => queryClient.invalidateQueries(`allTodos-${taskId}`),
    }
  );

  const { mutateAsync: deleteTodo } = useMutation(handleDeleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(`allTodos-${taskId}`);
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
        className="mr-3"
        onChange={() => updateIsChecked()}
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
