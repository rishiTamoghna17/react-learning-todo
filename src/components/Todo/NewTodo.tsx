import * as React from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../Context/Provider";
import "./NewTodo.css";
const { useState, useContext } = React;

export default function NewTodo() {
  const [todo, setTodo] = useState("");
  const [subtask, setSubtask] = useState("");
  const { state, dispatch } = useContext(context);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (!token) navigate("/login");
    console.log(state.user);
  }, [state.user, token]);

  function handleSubmit(event) {
    event.preventDefault();

    if (todo.trim() !== "") {
      dispatch({ type: "ADD_TODO", payload: todo });
      setTodo("");
    }
  }
  function handleSubtaskCreate(parentTodo) {
    dispatch({
      type: "ADD_SUBTASK",
      payload: { taskId: parentTodo.id, subtaskText: subtask }
    });
    setSubtask("");
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      handleSubmit(event);
    }
  }

  return (
    <>
      <div className="new-todo">
        <input
          type="text"
          value={todo}
          placeholder="Enter task"
          onChange={(e) => setTodo(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSubmit}>Add Task</button>
        <form
          className="subtask-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubtaskCreate(state.todos[state.todos.length - 1]);
          }}
        ></form>
      </div>
    </>
  );
}
