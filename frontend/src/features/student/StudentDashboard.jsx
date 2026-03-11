import { useState, useEffect } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import Calendar from './Calendar';

const StudentDashboard = () => {
  const fullName = localStorage.getItem('full_name')
  const token = localStorage.getItem('access')
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
            "http://localhost:8000/api/users/profile/",
            {
              headers: {Authorization: `Bearer ${token}`}
            }
        );
        setStudentData(res.data);
      } catch (err) {
        console.error("Veri çekme hatası:", err.response?.status);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);


  if (loading) return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f8fafc',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6',
          animation: 'spin .8s linear infinite',
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
  );

  return (
      <>
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .sd-wrap * { box-sizing: border-box; }
      .sd-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      /* Top bar */
      .sd-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }
      .sd-greeting-label { font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 4px; }
      .sd-greeting-name  { font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.1; }
      .sd-dept-chip {
        background: #fff;
        border: 1px solid #e2e8f0;
        color: #475569;
        font-size: 13px;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 999px;
      }

      /* Stats */
      .sd-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-bottom: 36px;
      }
      .sd-stat {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 22px 24px;
      }
      .sd-stat-label { font-size: 12px; font-weight: 600; color: #94a3b8; letter-spacing: .5px; text-transform: uppercase; margin-bottom: 8px; }
      .sd-stat-value { font-size: 30px; font-weight: 800; color: #0f172a; line-height: 1; }
      .sd-stat-sub   { font-size: 12px; color: #94a3b8; margin-top: 4px; }
      .sd-stat.accent { background: #1d4ed8; border-color: #1d4ed8; }
      .sd-stat.accent .sd-stat-label { color: #93c5fd; }
      .sd-stat.accent .sd-stat-value { color: #fff; }
      .sd-stat.accent .sd-stat-sub   { color: #93c5fd; }

      /* Section head */
      .sd-section-head {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 16px;
      }
      .sd-section-title { font-size: 16px; font-weight: 700; color: #0f172a; }
      .sd-section-count { font-size: 12px; color: #94a3b8; font-weight: 600; }

      /* Course rows */
      .sd-courses { display: flex; flex-direction: column; gap: 10px; }
      .sd-course-row {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: border-color .15s, box-shadow .15s;
      }
      .sd-course-row:hover { border-color: #bfdbfe; box-shadow: 0 2px 12px #3b82f610; }
      .sd-course-icon {
        width: 40px; height: 40px;
        background: #eff6ff;
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .sd-course-icon svg { width: 18px; height: 18px; stroke: #3b82f6; }
      .sd-course-code {
        font-size: 12px; font-weight: 700; color: #3b82f6;
        background: #eff6ff; padding: 2px 8px; border-radius: 5px;
        margin-bottom: 3px; display: inline-block;
      }
      .sd-course-name { font-size: 14px; font-weight: 600; color: #1e293b; }

      /* Empty */
      .sd-empty {
        padding: 48px; background: #fff;
        border: 2px dashed #e2e8f0; border-radius: 14px;
        text-align: center; color: #94a3b8; font-size: 14px;
      }

      @media (max-width: 640px) { .sd-wrap { padding: 24px 16px; } }
    `}</style>

        <div className="sd-wrap">

          {/* Top bar */}
          <div className="sd-topbar">
            <div>
              <p className="sd-greeting-label">Hoş geldin 👋</p>
              <h1 className="sd-greeting-name">{fullName}</h1>
            </div>
            <div className="sd-dept-chip">
              {studentData?.department || 'Bilgisayar Mühendisliği'}
            </div>
          </div>

          {/* Stats */}
          <div className="sd-stats">
            <div className="sd-stat accent">
              <p className="sd-stat-label">Genel Not Ort.</p>
              <p className="sd-stat-value">{studentData?.overall_gpa || '0.00'}</p>
              <p className="sd-stat-sub">GNO</p>
            </div>
            <div className="sd-stat">
              <p className="sd-stat-label">Kayıtlı Ders</p>
              <p className="sd-stat-value">{studentData?.courses?.length || 0}</p>
              <p className="sd-stat-sub">bu dönem</p>
            </div>
          </div>

          {/* Course List */}
          <div className="sd-section-head">
            <h2 className="sd-section-title">Aktif Derslerim</h2>
            <span className="sd-section-count">{studentData?.courses?.length || 0} ders</span>
          </div>

          <div className="sd-courses">
            {studentData?.courses?.length > 0 ? (
                studentData.courses.map((course) => (
                    <div key={course.id} className="sd-course-row">
                      <div className="sd-course-icon">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                      <div>
                        <span className="sd-course-code">{course.course_id}</span>
                        <p className="sd-course-name">{course.course_name}</p>
                      </div>
                    </div>
                ))
            ) : (
                <div className="sd-empty">Henüz ders seçimi yapmadınız.</div>
            )}
          </div>

        </div>
      </>
  );
}
export default StudentDashboard;