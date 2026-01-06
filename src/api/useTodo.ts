import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { CategoryTodos } from "./useCategory";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
}

export const useTodo = (
  categories: CategoryTodos[],
  setCategories: React.Dispatch<React.SetStateAction<CategoryTodos[]>>
) => {
  const [newTodos, setNewTodos] = useState<{
    [key: number]: { title: string; description: string };
  }>({});

  useEffect(() => {
    if (categories.length === 0) return;

    let isMounted = true;

    const fetchTodos = async () => {
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (cat) => {
            const res = await axiosInstance.get(
              `/api/categories/${cat.id}/tasks`
            );
            return { ...cat, todos: res.data.data || [] };
          })
        );

        if (isMounted) setCategories(updatedCategories);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };

    fetchTodos();

    return () => {
      isMounted = false;
    };
  }, [categories.length, setCategories]);

  const addTodo = async (categoryId: number) => {
    const todoInput = newTodos[categoryId];
    if (!todoInput || !todoInput.title.trim()) return;

    try {
      const res = await axiosInstance.post(
        `/api/categories/${categoryId}/tasks`,
        {
          title: todoInput.title,
          description: todoInput.description,
        }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, todos: [...(cat.todos || []), res.data.data] }
            : cat
        )
      );

      setNewTodos((prev) => ({
        ...prev,
        [categoryId]: { title: "", description: "" },
      }));
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const toggleTodoStatus = async (categoryId: number, todoId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const todo = category.todos.find((t) => t.id === todoId);
    if (!todo) return;

    const newStatus = todo.status === "pending" ? "completed" : "pending";

    try {
      const res = await axiosInstance.patch(
        `/api/categories/${categoryId}/tasks/${todoId}/status`,
        { status: newStatus }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                todos: cat.todos.map((t) =>
                  t.id === todoId ? { ...t, status: res.data.data.status } : t
                ),
              }
            : cat
        )
      );
    } catch (err) {
      console.error("Failed to toggle todo status:", err);
    }
  };

  const deleteTodo = async (categoryId: number, todoId: number) => {
    try {
      await axiosInstance.delete(
        `/api/categories/${categoryId}/tasks/${todoId}`
      );
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, todos: cat.todos.filter((t) => t.id !== todoId) }
            : cat
        )
      );
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return { newTodos, setNewTodos, addTodo, toggleTodoStatus, deleteTodo };
};
