import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const user_role = localStorage.getItem("user_role")
  const isActive = (path) => location.pathname === path;
  const location = useLocation();

const sidebarStyle = {
    width: "260px",
    height: "calc(100vh - 60px)",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #f0f0f0",
    padding: "24px 16px",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };
  const navItemStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
    color: active ? "#4F46E5" : "#64748b",
    backgroundColor: active ? "#EEF2FF" : "transparent",
    transition: "all 0.3s ease",
    marginBottom: "8px"
  });

  const sectionLabelStyle = {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "20px 0 12px 16px"
  };

  return (
<aside style={sidebarStyle}>
      <ul className="list-unstyled">
        {user_role === "instructor" && (
          <>
               <li className="mb-2">
          <Link to="/InstructorDashboard" style={navItemStyle(isActive("/InstructorDashboard"))}> <i className="nav-link text-dark"></i>Ana Sayfa</Link>
                </li>
            <li className="mb-2">
              <Link to="/InstructorCourses" style={navItemStyle(isActive("/InstructorCourses"))}> <i className="nav-link text-dark"></i>Ders İşlemleri</Link>
            </li>
              <li className="mb-2">
              <Link to="/settings/" style={navItemStyle(isActive("/settings/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Ayarlar</Link>
            </li>
               <li className="mb-2">
              <Link to="/forum/" style={navItemStyle(isActive("/forum/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Forum</Link>
            </li>
                <li className="mb-2">
              <Link to="/InstructorCalendar/" style={navItemStyle(isActive("/InstructorCalendar/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Ders Programı</Link>
            </li>
          </>
        )}

        {user_role === "student" && (
          <>
               <li className="mb-2">
                 <Link to="/StudentDashboard" style={navItemStyle(isActive("/StudentDashboard"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Ana Sayfa</Link>
                </li>
              <li className="mb-2">
              <Link to="/CourseSelection" style={navItemStyle(isActive("/CourseSelection"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Ders Seçimi</Link>
            </li>
              <li className="mb-2">
              <Link to="/grades/" style={navItemStyle(isActive("/grades/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Notlarım</Link>
            </li>
              <li className="mb-2">
              <Link to="/StudentDashboard/Calendar/" style={navItemStyle(isActive("/StudentDashboard/Calendar/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Ders Programı</Link>
            </li>
            <li className="mb-2">
              <Link to="/transcript/" style={navItemStyle(isActive("/transcript/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Transkriptim</Link>
            </li>
            <li className="mb-2">
              <Link to="/curriculum/" style={navItemStyle(isActive("/curriculum/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Müfredat</Link>
            </li>
              <li className="mb-2">
              <Link to="/settings/" style={navItemStyle(isActive("/settings/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Ayarlar</Link>
            </li>
              <li className="mb-2">
              <Link to="/forum/" style={navItemStyle(isActive("/forum/"))}>
              <i className="bi bi-file-earmark-text-fill"></i>Forum</Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;