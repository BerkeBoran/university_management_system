import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="app-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ padding: "20px", background: "#f5f7fb", flexGrow: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;