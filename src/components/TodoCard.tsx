import React, { useState } from "react";
import { Todo } from "../api/useTodo";
import { z } from "zod";

const ActionButton = ({
  label,
  onClick,
  background = "#007bff",
  color = "#fff",
  fontSize = "0.85rem",
  padding = "0.3rem 0.6rem",
  type = "button",
}: {
  label: string;
  onClick: () => void;
  background?: string;
  color?: string;
  fontSize?: string;
  padding?: string;
  type?: "button" | "submit" | "reset";
}) => (
  <button
    onClick={onClick}
    type={type}
    style={{
      padding,
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      background,
      color,
      fontSize,
      fontWeight: 500,
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
  >
    {label}
  </button>
);

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
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
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
        title: fieldErrors.title ? fieldErrors.title[0] : undefined,
        description: fieldErrors.description
          ? fieldErrors.description[0]
          : undefined,
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

  const styles = {
    card: {
      position: "relative" as const,
      border: `1px solid ${darkMode ? "#333" : "#ddd"}`,
      borderRadius: "12px",
      padding: "1rem",
      backgroundColor: darkMode ? "#1e1e1e" : "#fff",
      boxShadow: darkMode
        ? "0 2px 8px rgba(0,0,0,0.5)"
        : "0 2px 6px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.8rem",
      color: darkMode ? "#fff" : "#333",
      transition: "all 0.3s ease",
    },
    deleteCardBtn: {
      position: "absolute" as const,
      top: "10px",
      right: "10px",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: darkMode ? "#ff5555" : "#f44336",
      border: "none",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
      transition: "all 0.2s ease",
    },
    todoItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "0.75rem",
      borderRadius: "10px",
      border: `1px solid ${darkMode ? "#444" : "#eee"}`,
      backgroundColor: darkMode ? "#2a2a2a" : "#fefefe",
      lineHeight: 1.4,
    },
    todoText: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.2rem",
      maxWidth: "70%",
      wordBreak: "break-word" as const,
    },
    todoTitle: {
      fontWeight: 700, // bold
      fontSize: "1rem",
      color: darkMode ? "#fff" : "#222",
    },
    todoDescription: {
      fontWeight: 400,
      fontSize: "0.9rem",
      color: darkMode ? "#ccc" : "#555",
      lineHeight: 1.4,
    },
    formContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.6rem",
      marginTop: "0.5rem",
      opacity: openForm ? 1 : 0,
      maxHeight: openForm ? "500px" : "0px",
      overflow: "hidden",
      transition: "all 0.3s ease",
    },
    input: {
      padding: "0.6rem 0.8rem",
      borderRadius: "8px",
      border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
      backgroundColor: darkMode ? "#2a2a2a" : "#fff",
      color: darkMode ? "#fff" : "#333",
      fontSize: "0.95rem",
      lineHeight: 1.5,
      transition: "all 0.2s ease",
      outline: "none",
    },
    addBtn: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "0.6rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "all 0.2s ease",
    },
    closeFormBtn: {
      width: "100%",
      marginTop: "0.3rem",
      padding: "0.4rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      backgroundColor: darkMode ? "#ff5555" : "#f44336",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "0.9rem",
      transition: "all 0.2s ease",
    },
    errorText: {
      color: "#ff4d4f",
      fontSize: "0.8rem",
      fontStyle: "italic",
    },
    categoryTitle: {
      textAlign: "center" as const,
      marginBottom: "0.5rem",
      textTransform: "uppercase" as const,
      fontSize: "1.1rem",
      letterSpacing: "1px",
    },
  };

  return (
    <div style={styles.card}>
      <button
        style={styles.deleteCardBtn}
        onClick={handleDeleteCategory}
        title="Delete Category"
      >
        ×
      </button>

      <h3 style={styles.categoryTitle}>{category}</h3>

      {todos.length === 0 && (
        <p style={{ textAlign: "center", color: "#888" }}>No todos yet</p>
      )}

      {todos.map((todo) => (
        <div key={todo.id} style={styles.todoItem}>
          <div style={styles.todoText}>
            <span style={styles.todoTitle}>{todo.title}</span>
            <span style={styles.todoDescription}>{todo.description}</span>
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
        <button style={styles.addBtn} onClick={() => setOpenForm(true)}>
          Add Todo
        </button>
      )}

      <form style={styles.formContainer} onSubmit={handleAddTodo}>
        {openForm && (
          <>
            <input
              style={{
                ...styles.input,
                border: errors.title
                  ? "1px solid #ff4d4f"
                  : `1px solid ${darkMode ? "#555" : "#ccc"}`,
              }}
              type="text"
              placeholder="Title"
              value={newTodos[categoryId]?.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            {errors.title && (
              <span style={styles.errorText}>{errors.title}</span>
            )}

            <input
              style={{
                ...styles.input,
                border: errors.description
                  ? "1px solid #ff4d4f"
                  : `1px solid ${darkMode ? "#555" : "#ccc"}`,
              }}
              type="text"
              placeholder="Description"
              value={newTodos[categoryId]?.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            {errors.description && (
              <span style={styles.errorText}>{errors.description}</span>
            )}

            <ActionButton label="Add Todo" type="submit" onClick={() => {}} />
            <button
              style={styles.closeFormBtn}
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
