import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForumHome = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://localhost:8000/api/courses/forum-course-list/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Gelen veri:", res.data);
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setCourses(data);
    } catch (err) {
      console.error("Dersler çekilemedi:", err);
      setCourses([]);
    }
  };
  fetchCourses();
}, []);

 return (
    <div className="container mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-chat-dots-fill text-primary me-2" style={{ fontSize: "24px" }}></i>
        <h2 className="m-0" style={{ fontWeight: 600, color: "#333" }}>Ders Forumları</h2>
      </div>

      <p className="text-muted mb-4">Tartışmalara katılmak için bir ders seçin.</p>

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <div
              onClick={() => navigate(`/forum/${course.id}`)}
              style={{
                padding: "24px",
                borderRadius: "16px",
                backgroundColor: "#fff",
                border: "1px solid #f0f0f0",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#4F46E5";
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(79, 70, 229, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#f0f0f0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#4F46E5",
                  backgroundColor: "#EEF2FF",
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}>
                  {course.course_id}
                </span>
                <i className="bi bi-arrow-right-short text-muted" style={{ fontSize: "20px" }}></i>
              </div>

              <h5 style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#1e293b",
                margin: "10px 0"
              }}>
                {course.course_name || "Ders Adı Belirtilmemiş"}
              </h5>

              <div className="mt-auto pt-3 d-flex align-items-center" style={{ borderTop: "1px solid #f8fafc" }}>
                <small className="text-muted">
                  <i className="bi bi-mortarboard me-1"></i> {course.department_name || 'CENG'}
                </small>
                <small className="text-muted ms-3">
                  <i className="bi bi-star me-1"></i> {course.ects} ECTS
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumHome;