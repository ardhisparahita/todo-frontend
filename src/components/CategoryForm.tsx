import React from "react";

interface CategoryFormProps {
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  handleAddCategory: (e: React.FormEvent) => void;
  categoryError: string;
  darkMode: boolean;

  errorTrigger: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  newCategory,
  setNewCategory,
  handleAddCategory,
  categoryError,
  darkMode,
  errorTrigger,
}) => {
  return (
    <form
      onSubmit={handleAddCategory}
      style={{
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          key={errorTrigger ? "error" : "no-error"}
          type="text"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: categoryError ? "1px solid #ff4d4f" : "1px solid #ccc",
            backgroundColor: darkMode ? "#1e1e1e" : "#fff",
            color: darkMode ? "#fff" : "#333",
            transition: "border-color 0.2s ease",
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add Category
        </button>
      </div>

      {categoryError && (
        <span style={{ color: "#ff4d4f", fontSize: "0.85rem" }}>
          {categoryError}
        </span>
      )}
    </form>
  );
};

export default CategoryForm;
