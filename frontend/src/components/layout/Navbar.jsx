import React from "react";

const Navbar = () => {
    const full_name = localStorage.getItem("full_name");
    const user_role = localStorage.getItem("user_role");
  return (
    <nav
      style={{
        height: "60px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        zIndex: 1000,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "20px", color: "#333" }}>
        University Management
          <span style={{ fontSize: "12px", marginLeft: "10px", color: "#888", fontWeight: 400 }}>
          {user_role === "instructor" ? "(Akademisyen)" : "(Öğrenci)"}
        </span>
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ color: "#555", fontWeight: "500" }}>{full_name}</span>
        <button className="btn btn-outline-danger btn-sm" onClick={() => {
            localStorage.clear();
            window.location.href = "/";
        }}>
          Çıkış
        </button>
      </div>
    </nav>
  );
};

export default Navbar;