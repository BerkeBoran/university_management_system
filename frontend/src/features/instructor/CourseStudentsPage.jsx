import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CourseStudentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/courses/instructor-courses/${id}/students/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API DATA:", response.data);

        setStudents(response.data);
      } catch (err) {
        console.error(err);
        setError("Öğrenciler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  // Mevcut import, hook, state ve handler'larını bu dosyanın üstüne ekle.

if (loading) return (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: '#f1f5f9',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid #e2e8f0',
      borderTopColor: '#3b82f6',
      animation: 'spin .8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

if (error) return (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: '#f1f5f9',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }}>
    <div style={{
      background: '#fef2f2', border: '1px solid #fecaca',
      color: '#b91c1c', borderRadius: 12, padding: '16px 24px',
      fontSize: 14, fontWeight: 600,
    }}>{error}</div>
  </div>
);

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .cs-wrap * { box-sizing: border-box; }
      .cs-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .cs-header {
        display: flex; align-items: center; gap: 16px;
        margin-bottom: 28px;
      }
      .cs-back-btn {
        display: flex; align-items: center; gap: 6px;
        background: #fff; border: 1px solid #e2e8f0;
        color: #475569; font-size: 13px; font-weight: 600;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 8px 14px; border-radius: 10px;
        cursor: pointer; transition: background .15s;
        text-decoration: none; flex-shrink: 0;
      }
      .cs-back-btn:hover { background: #f8fafc; }
      .cs-back-btn svg { width: 14px; height: 14px; }

      .cs-title-wrap {}
      .cs-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .cs-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      /* Table card */
      .cs-table-wrap {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
      }
      table.cs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .cs-table thead tr { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
      .cs-table th {
        padding: 11px 20px;
        text-align: left;
        font-size: 11px; font-weight: 700;
        color: #94a3b8; letter-spacing: .6px;
        text-transform: uppercase; white-space: nowrap;
      }
      .cs-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background .12s; }
      .cs-table tbody tr:last-child { border-bottom: none; }
      .cs-table tbody tr:hover { background: #f8fafc; }
      .cs-table td { padding: 14px 20px; vertical-align: middle; }

      .cs-avatar {
        width: 32px; height: 32px;
        background: #eff6ff; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 800; color: #3b82f6;
        flex-shrink: 0;
      }
      .cs-name-cell { display: flex; align-items: center; gap: 10px; }
      .cs-full-name { font-weight: 600; color: #0f172a; }
      .cs-username  {
        font-size: 12px; font-weight: 600; color: #64748b;
        font-family: 'DM Mono', monospace;
        background: #f8fafc; border: 1px solid #e2e8f0;
        padding: 2px 8px; border-radius: 5px;
      }

      .cs-empty {
        padding: 48px; text-align: center;
        color: #94a3b8; font-size: 14px; font-weight: 500;
      }

      @media (max-width: 640px) { .cs-wrap { padding: 24px 16px; } }
    `}</style>

    <div className="cs-wrap">

      <div className="cs-header">
        <button className="cs-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Geri
        </button>
        <div className="cs-title-wrap">
          <h1 className="cs-title">Öğrenci Listesi</h1>
          <p className="cs-subtitle">{students.length} kayıtlı öğrenci</p>
        </div>
      </div>

      <div className="cs-table-wrap">
        <table className="cs-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Kullanıcı Adı</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="cs-name-cell">
                      <div className="cs-avatar">
                        {student.full_name?.charAt(0) || '?'}
                      </div>
                      <span className="cs-full-name">{student.full_name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="cs-username">{student.username}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="cs-empty">
                  Bu derse kayıtlı öğrenci yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  </>
);
};

export default CourseStudentsPage;
