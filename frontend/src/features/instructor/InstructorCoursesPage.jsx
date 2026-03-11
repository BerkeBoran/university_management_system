import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/instructor-courses/', {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    }).then(res =>{
    console.log(res.data);
    setCourses(res.data);
  }); }, []);

  // Mevcut import, hook, state ve handler'larını bu dosyanın üstüne ekle.

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .ic-wrap * { box-sizing: border-box; }
      .ic-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .ic-header { margin-bottom: 28px; }
      .ic-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .ic-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      .ic-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }

      .ic-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: border-color .15s, box-shadow .15s, transform .15s;
      }
      .ic-card:hover {
        border-color: #bfdbfe;
        box-shadow: 0 4px 20px #3b82f614;
        transform: translateY(-2px);
      }

      /* Clickable top area */
      .ic-card-body {
        padding: 22px;
        cursor: pointer;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ic-code {
        font-size: 11px; font-weight: 700; color: #3b82f6;
        background: #eff6ff; padding: 3px 10px; border-radius: 999px;
        display: inline-block; align-self: flex-start;
      }
      .ic-name {
        font-size: 15px; font-weight: 700; color: #0f172a;
        line-height: 1.35;
      }
      .ic-students-link {
        font-size: 12px; color: #94a3b8; font-weight: 500;
        margin-top: auto; padding-top: 8px;
        display: flex; align-items: center; gap: 4px;
      }
      .ic-students-link svg { width: 12px; height: 12px; }

      /* Footer button */
      .ic-card-footer {
        padding: 12px 22px;
        border-top: 1px solid #f1f5f9;
      }
      .ic-grade-btn {
        width: 100%;
        display: flex; align-items: center; justify-content: center; gap: 6px;
        background: #1d4ed8; color: #fff;
        border: none; border-radius: 10px;
        padding: 10px;
        font-size: 13px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer;
        transition: background .15s;
      }
      .ic-grade-btn:hover { background: #1e40af; }
      .ic-grade-btn svg { width: 14px; height: 14px; }

      @media (max-width: 640px) { .ic-wrap { padding: 24px 16px; } }
    `}</style>

    <div className="ic-wrap">

      <div className="ic-header">
        <h1 className="ic-title">Verdiğiniz Dersler</h1>
        <p className="ic-subtitle">{courses.length} ders bu dönem</p>
      </div>

      <div className="ic-grid">
        {courses.map((course) => (
          <div key={course.id} className="ic-card">

            <div className="ic-card-body" onClick={() => navigate(`/InstructorCourses/${course.id}`)}>
              <span className="ic-code">{course.course_id}</span>
              <h3 className="ic-name">{course.course_name}</h3>
              <span className="ic-students-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
                Öğrencileri Gör
              </span>
            </div>

            <div className="ic-card-footer">
              <button
                className="ic-grade-btn"
                onClick={() => navigate(`/InstructorCourses/${course.id}/grades`)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Not Girişi Yap
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  </>
);
};
export default InstructorCoursesPage;