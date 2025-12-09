// src/api/useCategory.ts
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { Todo } from "./useTodo";

export interface CategoryTodos {
  id: number;
  name: string;
  todos: Todo[];
}

export const useCategory = () => {
  const [categories, setCategories] = useState<CategoryTodos[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Fetch semua kategori beserta todos
  // ----------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ----------------------------
  // Tambah kategori baru
  // ----------------------------
  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;

    try {
      const res = await axiosInstance.post("/api/categories", { name });
      setCategories((prev) => [...prev, res.data.data]);
      setNewCategory("");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  // ----------------------------
  // Hapus kategori
  // ----------------------------
  const deleteCategory = async (categoryId: number) => {
    try {
      await axiosInstance.delete(`/api/categories/${categoryId}`);
      // hapus kategori dari UI
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return {
    categories,
    setCategories,
    newCategory,
    setNewCategory,
    addCategory,
    deleteCategory,
    loading,
  };
};
