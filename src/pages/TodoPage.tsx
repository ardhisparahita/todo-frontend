import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import Header from "../components/Header";
import CategoryForm from "../components/CategoryForm";
import CategoryGrid from "../components/CategoryGrid";
import { useCategory } from "../api/useCategory";
import { useTodo } from "../api/useTodo";
import "./../styles/todopage.css";

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

  const [username, setUsername] = useState("Guest");
  const [darkMode, setDarkMode] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [errorTrigger, setErrorTrigger] = useState(false);

  // Ambil token dan decode nama user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUsername(decoded.name);
      } catch (err) {
        console.error("Invalid token", err);
      }
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
      setErrorTrigger((prev) => !prev);
      return;
    }

    addCategory();
    setNewCategory("");
    setCategoryError("");
    setErrorTrigger((prev) => !prev);
  };

  return (
    <div className={`todo-page ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <Header
        username={username}
        timeGreeting={timeGreeting}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Category Form */}
      <CategoryForm
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        categoryError={categoryError}
        darkMode={darkMode}
        errorTrigger={errorTrigger}
      />

      {/* Category & Todo Grid */}
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
