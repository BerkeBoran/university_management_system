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

 // Mevcut import, hook, state ve handler'larını bu dosyanın üstüne ekle.

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .fcl-wrap * { box-sizing: border-box; }
      .fcl-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .fcl-header { margin-bottom: 28px; }
      .fcl-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .fcl-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      .fcl-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }

      .fcl-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 22px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: border-color .15s, box-shadow .15s, transform .15s;
      }
      .fcl-card:hover {
        border-color: #bfdbfe;
        box-shadow: 0 4px 20px #3b82f614;
        transform: translateY(-2px);
      }

      .fcl-card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .fcl-code {
        font-size: 11px; font-weight: 700; color: #3b82f6;
        background: #eff6ff; padding: 3px 10px; border-radius: 999px;
      }
      .fcl-arrow { color: #cbd5e1; transition: color .15s; }
      .fcl-card:hover .fcl-arrow { color: #3b82f6; }
      .fcl-arrow svg { width: 18px; height: 18px; }

      .fcl-name {
        font-size: 15px; font-weight: 700; color: #0f172a;
        line-height: 1.35;
      }

      .fcl-footer {
        display: flex; align-items: center; gap: 12px;
        padding-top: 10px;
        border-top: 1px solid #f1f5f9;
        margin-top: auto;
      }
      .fcl-chip {
        display: flex; align-items: center; gap: 5px;
        font-size: 11px; font-weight: 600; color: #94a3b8;
      }
      .fcl-chip svg { width: 12px; height: 12px; }

      @media (max-width: 640px) { .fcl-wrap { padding: 24px 16px; } }
    `}</style>

    <div className="fcl-wrap">

      <div className="fcl-header">
        <h1 className="fcl-title">Ders Forumları</h1>
        <p className="fcl-subtitle">Tartışmalara katılmak için bir ders seçin.</p>
      </div>

      <div className="fcl-grid">
        {courses.map((course) => (
          <div key={course.id} className="fcl-card" onClick={() => navigate(`/forum/${course.id}`)}>

            <div className="fcl-card-top">
              <span className="fcl-code">{course.course_id}</span>
              <span className="fcl-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </div>

            <p className="fcl-name">{course.course_name || 'Ders Adı Belirtilmemiş'}</p>

            <div className="fcl-footer">
              <span className="fcl-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"/>
                </svg>
                {course.department_name || 'CENG'}
              </span>
              <span className="fcl-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                {course.ects} AKTS
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  </>
);
};

export default ForumHome;