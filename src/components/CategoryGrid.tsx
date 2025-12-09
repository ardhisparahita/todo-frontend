import React from "react";
import TodoCard from "./TodoCard";
import { CategoryTodos } from "./../api/useCategory";

interface CategoryGridProps {
  categories: CategoryTodos[];
  toggleTodoStatus: (categoryId: number, todoId: number) => void;
  deleteTodo: (categoryId: number, todoId: number) => void;
  newTodos: any;
  setNewTodos: any;
  addTodo: any;
  deleteCategory: (id: number) => void;
  darkMode: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  toggleTodoStatus,
  deleteTodo,
  newTodos,
  setNewTodos,
  addTodo,
  deleteCategory,
  darkMode,
}) => {
  return (
    <>
      <div className="category-grid">
        {categories.map((cat) => (
          <TodoCard
            key={cat.id}
            category={cat.name}
            categoryId={cat.id}
            todos={cat.todos || []}
            toggleStatus={(todoId) => toggleTodoStatus(cat.id, todoId)}
            deleteTodo={deleteTodo}
            newTodos={newTodos}
            setNewTodos={setNewTodos}
            addTodo={addTodo}
            deleteCategory={deleteCategory}
            darkMode={darkMode}
          />
        ))}
      </div>

      <style>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          width: 100%;
        }
        @media (max-width: 992px) { .category-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .category-grid { grid-template-columns: repeat(1, 1fr); } }
      `}</style>
    </>
  );
};

export default CategoryGrid;
