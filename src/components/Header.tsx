import React from "react";

interface HeaderProps {
  username: string;
  timeGreeting: string;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  username,
  timeGreeting,
  darkMode,
  setDarkMode,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "2rem",
      }}
    >
      {/* Left: Toggle + Greeting */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.3rem",
        }}
      >
        {/* Dark Mode Toggle */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            display: "flex",
            alignItems: "center",
            width: "40px",
            height: "20px",
            borderRadius: "10px",
            padding: "1px",
            backgroundColor: darkMode ? "#333" : "#FFD700",
            cursor: "pointer",
            position: "relative",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1px",
              left: darkMode ? "20px" : "1px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: darkMode ? "#FFA500" : "#fff",
              transition: "left 0.3s ease, background-color 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="#FFA500"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a1 1 0 011 1v2.292a1 1 0 01-2 0V5.354a1 1 0 011-1zm0 12a4 4 0 100-8 4 4 0 000 8zm7.657-5.657a1 1 0 010 1.414l-1.625 1.625a1 1 0 01-1.414-1.414l1.625-1.625a1 1 0 011.414 0zm-13.314 0a1 1 0 011.414 0l1.625 1.625a1 1 0 01-1.414 1.414L5.343 11.11a1 1 0 010-1.414zm9.9-6.243a1 1 0 010 1.414l-1.625 1.625a1 1 0 01-1.414-1.414l1.625-1.625a1 1 0 011.414 0zm-7.778 0l1.625 1.625a1 1 0 01-1.414 1.414L4.868 5.928a1 1 0 011.414-1.414zM20 12a1 1 0 011 1h2.292a1 1 0 010-2H21a1 1 0 01-1 1zm-18 0a1 1 0 011 1H1.708a1 1 0 010-2H3a1 1 0 01-1 1zm16.485 5.657a1 1 0 010 1.414l-1.625 1.625a1 1 0 01-1.414-1.414l1.625-1.625a1 1 0 011.414 0zm-12.97 0l1.625 1.625a1 1 0 01-1.414 1.414L4.868 19.07a1 1 0 011.414-1.414z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="#FFD700"
                viewBox="0 0 24 24"
              >
                <path d="M21.752 15.002A9 9 0 1112 3a7 7 0 009.752 12.002z" />
              </svg>
            )}
          </div>
        </div>

        {/* Greeting */}
        <div
          style={{
            paddingTop: "20px",
            fontSize: "1.5rem",
            color: darkMode ? "#fff" : "#333",
          }}
        >
          Hello {username}, {timeGreeting}
        </div>
      </div>

      {/* Right: Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        style={{
          padding: "0.4rem 0.8rem",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#f44336",
          color: "#fff",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
