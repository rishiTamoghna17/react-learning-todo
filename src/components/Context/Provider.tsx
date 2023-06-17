import React, { useReducer, createContext, useEffect } from "react";
import produce from "immer";

const initialState = {
  todos: [],
  id: 0,
  subtaskId: 0, // Initialize subtaskId
  user: null // Set the initial user value to null
};

const todosReducer = produce((draft, action) => {
  switch (action.type) {
    case "SET_TODOS":
      draft.todos = action.payload;
      break;
    case "ADD_TODO":
      const todo = {
        text: action.payload,
        id: draft.id,
        completed: false,
        subtasks: [] // Initialize an empty array for subtasks
      };
      draft.todos.push(todo);
      draft.id = draft.id + 1;
      break;
    case "ADD_SUBTASK":
      const { taskId: addTaskId, subtaskText } = action.payload; // Modified variable name
      const taskToAddSubtask = draft.todos.find((el) => el.id === addTaskId); // Modified variable name
      if (taskToAddSubtask) {
        const subtask = {
          id: draft.subtaskId,
          text: subtaskText,
          completed: false
        };
        taskToAddSubtask.subtasks.push(subtask);
        draft.subtaskId = draft.subtaskId + 1; // Increment the subtaskId
      }
      break;
    case "DELETE_TODO":
      draft.todos = draft.todos.filter((el) => el.id !== action.payload);
      break;
    case "DELETE_SUBTASK":
      const {
        taskId: deleteTaskId,
        subtaskId: deleteSubtaskId
      } = action.payload;
      const taskToDeleteSubtaskFrom = draft.todos.find(
        (el) => el.id === deleteTaskId
      );
      if (taskToDeleteSubtaskFrom) {
        taskToDeleteSubtaskFrom.subtasks = taskToDeleteSubtaskFrom.subtasks.filter(
          (subtask) => subtask.id !== deleteSubtaskId
        );
      }
      break;
    case "CLEAR_TODOS":
      draft.todos = [];
      break;
    case "TOGGLE_TODO_COMPLETED":
      const todoIdx = draft.todos.findIndex(
        (el) => el.id === action.payload.id
      );
      draft.todos[todoIdx].completed = !draft.todos[todoIdx].completed;
      break;
    case "TOGGLE_SUBTASK_COMPLETED":
      const {
        taskId: toggleTaskId,
        subtaskId: toggleSubtaskId
      } = action.payload; // Modified variable names
      const taskToToggleSubtask = draft.todos.find(
        (el) => el.id === toggleTaskId
      ); // Modified variable name
      if (taskToToggleSubtask) {
        const subtaskIdx = taskToToggleSubtask.subtasks.findIndex(
          (subtask) => subtask.id === toggleSubtaskId // Modified variable name
        );
        if (subtaskIdx !== -1) {
          taskToToggleSubtask.subtasks[
            subtaskIdx
          ].completed = !taskToToggleSubtask.subtasks[subtaskIdx].completed;
        }
      }
      break;
    case "LOGIN":
      draft.user = action.payload;
      break;
    case "LOGOUT":
      draft.user = null;
      break;
    default:
      break;
  }
});

const context = createContext();

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);

  useEffect(() => {
    const todos = window.localStorage.getItem("todos");
    dispatch({ type: "SET_TODOS", payload: JSON.parse(todos) || [] });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

  const login = (userData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    state,
    dispatch,
    login,
    logout
  };

  return <context.Provider value={value}>{children}</context.Provider>;
}

export { context };
