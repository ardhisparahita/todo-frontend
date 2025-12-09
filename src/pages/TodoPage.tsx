import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import Header from "../components/Header";
import CategoryForm from "../components/CategoryForm";
import CategoryGrid from "../components/CategoryGrid";
import { useCategory } from "./../api/useCategory";
import { useTodo } from "./../api/useTodo";

interface TokenPayload {
  id: number;
  name: string;
  iat: number;
  exp: number;
}

const categorySchema = z.object({
  name: z
    .string({ message: "Category name must be a string!" })
    .nonempty({ message: "Category cannot be empty" })
    .min(2, { message: "Category must be at least 2 characters" }),
});

const TodoPage = () => {
  const {
    categories,
    newCategory,
    setNewCategory,
    addCategory,
    setCategories,
    loading,
    deleteCategory,
  } = useCategory();

  const { newTodos, setNewTodos, addTodo, toggleTodoStatus, deleteTodo } =
    useTodo(categories, setCategories);

  const [username, setUsername] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [timeGreeting, setTimeGreeting] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // 🔥 state untuk paksa rerender input saat error muncul
  const [errorTrigger, setErrorTrigger] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUsername(decoded.name);
      } catch {}
    }

    const updateGreeting = () => {
      const hour = new Date().getHours();
      setTimeGreeting(
        hour >= 4 && hour < 12
          ? "Good Morning"
          : hour >= 12 && hour < 17
          ? "Good Afternoon"
          : hour >= 17 && hour < 21
          ? "Good Evening"
          : "Good Night"
      );
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading categories...</p>;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const result = categorySchema.safeParse({ name: newCategory });

    if (!result.success) {
      setCategoryError(
        result.error.flatten().fieldErrors.name?.[0] || "Invalid category"
      );

      // 🔥 paksa rerender input agar border merah muncul
      setErrorTrigger((prev) => !prev);
      return;
    }

    addCategory();
    setNewCategory("");
    setCategoryError("");

    setErrorTrigger((prev) => !prev); // reset
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        minHeight: "100vh",
        color: darkMode ? "#fff" : "#333",
      }}
    >
      <Header
        username={username}
        timeGreeting={timeGreeting}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <CategoryForm
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        categoryError={categoryError}
        darkMode={darkMode}
        errorTrigger={errorTrigger} // 🔥 pass trigger
      />

      <CategoryGrid
        categories={categories}
        toggleTodoStatus={toggleTodoStatus}
        deleteTodo={deleteTodo}
        newTodos={newTodos}
        setNewTodos={setNewTodos}
        addTodo={addTodo}
        deleteCategory={deleteCategory}
        darkMode={darkMode}
      />
    </div>
  );
};

export default TodoPage;
