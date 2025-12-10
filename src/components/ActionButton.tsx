import React from "react";
import "./../styles/actionbutton.css";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  background?: string;
  color?: string;
  fontSize?: string;
  padding?: string;
  type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  background = "#007bff",
  color = "#fff",
  fontSize = "0.85rem",
  padding = "0.3rem 0.6rem",
  type = "button",
}) => {
  return (
    <button
      type={type}
      className="action-button"
      style={{ background, color, fontSize, padding }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ActionButton;
