import React, { useContext, useEffect, useState } from "react";
import { context } from "../Context/Provider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./TodoList.css"; // Assuming you have a separate CSS file for styling
import NavBar from "../Navbar/Navbar";

export default function TodoList() {
  const { state, dispatch } = useContext(context);
  const [subtaskText, setSubtaskText] = useState("");
  const [expandedTodos, setExpandedTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!state.user && !token) navigate("/login");
  }, [state.user]);

  function handleDelete(todo) {
    dispatch({ type: "DELETE_TODO", payload: todo.id });
  }

  function handleCheckboxClick(todo) {
    dispatch({ type: "TOGGLE_TODO_COMPLETED", payload: todo });
  }

  function handleSubtaskCreate(todo) {
    dispatch({
      type: "ADD_SUBTASK",
      payload: { taskId: todo.id, subtaskText }
    });
    setSubtaskText("");
    setShowSubtaskForm(false);
  }

  function handleSubtaskDelete(todo, subtaskId) {
    dispatch({
      type: "DELETE_SUBTASK",
      payload: { taskId: todo.id, subtaskId }
    });
  }

  function handleSubtaskCheckboxClick(todo, subtaskId) {
    const payload = { taskId: todo.id, subtaskId };
    dispatch({ type: "TOGGLE_SUBTASK_COMPLETED", payload });
  }

  function handleSubtaskFormToggle() {
    setShowSubtaskForm(!showSubtaskForm);
  }

  function handleTodoToggle(todo) {
    if (expandedTodos.includes(todo.id)) {
      setExpandedTodos(expandedTodos.filter((id) => id !== todo.id));
    } else {
      setExpandedTodos([...expandedTodos, todo.id]);
    }
  }
  function handleClearButtonClick(event) {
    event.preventDefault();
    dispatch({ type: "CLEAR_TODOS" });
  }

  function getSubtaskCount(todo) {
    return todo.subtasks ? todo.subtasks.length : 0;
  }

  if (!state.todos) {
    return <div />;
  }

  return (
    <>
      <NavBar />
      <div className="accordion">
        <button className="clear-btc" onClick={handleClearButtonClick}>
          Clear items
        </button>
        <ul className="todo-list">
          {state.todos.map((todo) => {
            const isTodoSelected = selectedTodo && selectedTodo.id === todo.id;
            const isTodoExpanded = expandedTodos.includes(todo.id);
            const shouldShowSubtaskForm =
              showSubtaskForm[todo.id] || isTodoSelected;

            return (
              <AnimatePresence exitBeforeEnter key={todo.id}>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`todo-list__item ${
                    isTodoSelected ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTodo(todo)}
                >
                  <span
                    className={`accordion-arrow ${
                      isTodoExpanded ? "expanded" : ""
                    }`}
                    onClick={() => handleTodoToggle(todo)}
                  >
                    {isTodoExpanded ? "▼" : "▶"}
                  </span>
                  <span onClick={() => handleCheckboxClick(todo)}>
                    {todo.completed ? (
                      <span className="todo-list__item__completed" />
                    ) : (
                      <span className="todo-list__item__not-completed" />
                    )}
                  </span>
                  {todo.text}
                  <span className="subtask-count">
                    {getSubtaskCount(todo)} Subtasks
                  </span>
                  <span
                    className="todo-list__item__delete-button"
                    onClick={() => handleDelete(todo)}
                  >
                    X
                  </span>
                </motion.li>
                {isTodoExpanded && (
                  <motion.li
                    key={`${todo.id}-subtasks`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="subtask-container"
                  >
                    {shouldShowSubtaskForm && (
                      <>
                        {showSubtaskForm ? (
                          <form
                            className="subtask-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSubtaskCreate(todo);
                            }}
                          >
                            <input
                              type="text"
                              value={subtaskText}
                              onChange={(e) => setSubtaskText(e.target.value)}
                              placeholder="Enter subtask"
                              required
                            />
                            <button className="add-button" type="submit">
                              Add
                            </button>
                            <button
                              className="hide-form-button"
                              onClick={handleSubtaskFormToggle}
                            >
                              x
                            </button>
                          </form>
                        ) : null}
                        <button
                          className="hide-form-button"
                          onClick={handleSubtaskFormToggle}
                        >
                          {showSubtaskForm ? "" : "CLICK HERE TO ADD SUBTASK"}
                        </button>
                      </>
                    )}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                      <ul className="subtask-list">
                        {todo.subtasks.map((subtask) => (
                          <li key={subtask.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() =>
                                  handleSubtaskCheckboxClick(todo, subtask.id)
                                }
                              />
                              {subtask.text}
                            </label>
                            <span
                              className="subtask-delete-button"
                              onClick={() =>
                                handleSubtaskDelete(todo, subtask.id)
                              }
                            >
                              X
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                )}
              </AnimatePresence>
            );
          })}
        </ul>
      </div>
    </>
  );
}
