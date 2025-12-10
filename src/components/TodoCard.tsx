import React, { useState } from "react";
import { Todo } from "../api/useTodo";
import { z } from "zod";
import ActionButton from "./../components/ActionButton";
import "./../styles/todocard.css";

const taskSchema = z.object({
  title: z
    .string({ message: "Title must be a string!" })
    .nonempty({ message: "Title cannot be empty" })
    .min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string({ message: "Description must be a string!" })
    .nonempty({ message: "Description cannot be empty" })
    .min(2, { message: "Description must be at least 2 characters" }),
});

interface TodoCardProps {
  category: string;
  categoryId: number;
  todos: Todo[];
  toggleStatus: (todoId: number) => void;
  deleteTodo: (categoryId: number, todoId: number) => void;
  newTodos: { [key: number]: { title: string; description: string } };
  setNewTodos: React.Dispatch<
    React.SetStateAction<{
      [key: number]: { title: string; description: string };
    }>
  >;
  addTodo: (categoryId: number) => void;
  deleteCategory: (categoryId: number) => void;
  darkMode?: boolean;
}

const TodoCard: React.FC<TodoCardProps> = ({
  category,
  categoryId,
  todos,
  toggleStatus,
  deleteTodo,
  newTodos,
  setNewTodos,
  addTodo,
  deleteCategory,
  darkMode = false,
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleInputChange = (field: "title" | "description", value: string) => {
    setNewTodos((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [field]: value },
    }));
  };

  const handleAddTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    const data = {
      title: newTodos[categoryId]?.title || "",
      description: newTodos[categoryId]?.description || "",
    };
    const result = taskSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
      });
      return;
    }
    addTodo(categoryId);
    setNewTodos((prev) => ({
      ...prev,
      [categoryId]: { title: "", description: "" },
    }));
    setErrors({});
    setOpenForm(false);
  };

  const handleDeleteTodo = (todoId: number) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      deleteTodo(categoryId, todoId);
    }
  };

  const handleDeleteCategory = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this category and all its todos?"
      )
    ) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className={`todo-card ${darkMode ? "dark" : "light"}`}>
      <button
        className={`delete-card-btn ${darkMode ? "dark" : ""}`}
        onClick={handleDeleteCategory}
      >
        ×
      </button>
      <h3 className="category-title">{category}</h3>

      {todos.length === 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>No todos yet</p>
      )}

      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item ${darkMode ? "dark" : "light"}`}
        >
          <div className="todo-text">
            <span className={`todo-title ${darkMode ? "dark" : "light"}`}>
              {todo.title}
            </span>
            <span className={`todo-description ${darkMode ? "dark" : "light"}`}>
              {todo.description}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <ActionButton
              label={todo.status}
              onClick={() => toggleStatus(todo.id)}
              background={todo.status === "pending" ? "red" : "green"}
              fontSize="0.8rem"
              padding="0.3rem 0.5rem"
            />
            <ActionButton
              label="Delete"
              onClick={() => handleDeleteTodo(todo.id)}
              background="#777"
              fontSize="0.8rem"
              padding="0.3rem 0.5rem"
            />
          </div>
        </div>
      ))}

      {!openForm && (
        <button className="add-btn" onClick={() => setOpenForm(true)}>
          Add Todo
        </button>
      )}

      <form
        className={`form-container ${openForm ? "open" : ""}`}
        onSubmit={handleAddTodo}
      >
        {openForm && (
          <>
            <input
              className={`todo-input ${darkMode ? "dark" : "light"} ${
                errors.title ? "error" : ""
              }`}
              type="text"
              placeholder="Title"
              value={newTodos[categoryId]?.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}

            <input
              className={`todo-input ${darkMode ? "dark" : "light"} ${
                errors.description ? "error" : ""
              }`}
              type="text"
              placeholder="Description"
              value={newTodos[categoryId]?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}

            <ActionButton label="Add Todo" type="submit" onClick={() => {}} />
            <button
              className={`close-form-btn ${darkMode ? "dark" : ""}`}
              type="button"
              onClick={() => setOpenForm(false)}
            >
              Close Form
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default TodoCard;
