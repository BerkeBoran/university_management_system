import React, { useEffect, useState } from "react";
import axios from "axios";

const Curriculum = () => {

    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurriculum();
    }, []);

    const fetchCurriculum = async () => {
        try {
            const token = localStorage.getItem("access");

            const response = await axios.get(
                "http://localhost:8000/api/courses/curriculum/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response.data)

            setCurriculum(response.data);
            setLoading(false);

        } catch (error) {
            console.error("Curriculum alınamadı:", error);
        }
    };


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

const TYPE_COLORS = {
  'Zorunlu': { bg: '#eff6ff', color: '#1d4ed8' },
  'Seçmeli': { bg: '#f0fdf4', color: '#15803d' },
  'Mesleki': { bg: '#fdf4ff', color: '#7e22ce' },
};

const getTypeStyle = (type) =>
  TYPE_COLORS[type] || { bg: '#f8fafc', color: '#475569' };

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .cur-wrap * { box-sizing: border-box; }
      .cur-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .cur-header { margin-bottom: 32px; }
      .cur-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .cur-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      /* Semester block */
      .cur-semester { margin-bottom: 28px; }

      .cur-sem-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      .cur-sem-badge {
        background: #1d4ed8;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 999px;
        letter-spacing: .3px;
        white-space: nowrap;
      }
      .cur-sem-line { flex: 1; height: 1px; background: #e2e8f0; }
      .cur-sem-count { font-size: 12px; color: #94a3b8; font-weight: 600; white-space: nowrap; }

      /* Table card */
      .cur-table-wrap {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
      }

      table.cur-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .cur-table thead tr {
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }
      .cur-table th {
        padding: 11px 16px;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        letter-spacing: .6px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .cur-table tbody tr {
        border-bottom: 1px solid #f1f5f9;
        transition: background .12s;
      }
      .cur-table tbody tr:last-child { border-bottom: none; }
      .cur-table tbody tr:hover { background: #f8fafc; }

      .cur-table td {
        padding: 12px 16px;
        color: #1e293b;
        vertical-align: middle;
      }

      .cur-code {
        font-size: 12px;
        font-weight: 700;
        color: #3b82f6;
        background: #eff6ff;
        padding: 2px 8px;
        border-radius: 5px;
        white-space: nowrap;
      }
      .cur-course-name { font-weight: 600; color: #0f172a; }
      .cur-num { font-weight: 700; color: #334155; }
      .cur-type-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 999px;
        white-space: nowrap;
      }

      @media (max-width: 640px) {
        .cur-wrap { padding: 24px 16px; }
        .cur-table th, .cur-table td { padding: 10px 12px; }
      }
    `}</style>

    <div className="cur-wrap">

      <div className="cur-header">
        <h1 className="cur-title">Müfredat</h1>
        <p className="cur-subtitle">Bölüm ders planı</p>
      </div>

      {Object.keys(curriculum).map((semester) => (
        <div key={semester} className="cur-semester">

          {/* Semester heading */}
          <div className="cur-sem-head">
            <span className="cur-sem-badge">{semester}. Dönem</span>
            <div className="cur-sem-line" />
            <span className="cur-sem-count">{curriculum[semester].length} ders</span>
          </div>

          {/* Table */}
          <div className="cur-table-wrap">
            <table className="cur-table">
              <thead>
                <tr>
                  <th>Ders Kodu</th>
                  <th>Ders Adı</th>
                  <th>Kredi</th>
                  <th>AKTS</th>
                  <th>Tür</th>
                </tr>
              </thead>
              <tbody>
                {curriculum[semester].map((course, i) => {
                  const typeStyle = getTypeStyle(course.course_type);
                  return (
                    <tr key={i}>
                      <td><span className="cur-code">{course.cours_code}</span></td>
                      <td><span className="cur-course-name">{course.course_name}</span></td>
                      <td><span className="cur-num">{course.course_credit}</span></td>
                      <td><span className="cur-num">{course.course_ects}</span></td>
                      <td>
                        <span
                          className="cur-type-badge"
                          style={{ background: typeStyle.bg, color: typeStyle.color }}
                        >
                          {course.course_type}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      ))}

    </div>
  </>
);
}


export default Curriculum;