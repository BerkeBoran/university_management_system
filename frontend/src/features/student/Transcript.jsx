import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transcript = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/transcript/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    }).then(res => setData(res.data));
  }, []);


return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .tr-wrap * { box-sizing: border-box; }
      .tr-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .tr-header { margin-bottom: 32px; }
      .tr-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .tr-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      /* Semester block */
      .tr-semester { margin-bottom: 24px; }

      .tr-sem-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      .tr-sem-badge {
        background: #1d4ed8;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 999px;
        white-space: nowrap;
      }
      .tr-sem-gpa {
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 999px;
        white-space: nowrap;
      }
      .tr-sem-line  { flex: 1; height: 1px; background: #e2e8f0; }

      /* Table card */
      .tr-table-wrap {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
      }
      table.tr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .tr-table thead tr { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
      .tr-table th {
        padding: 11px 16px;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        letter-spacing: .6px;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .tr-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background .12s; }
      .tr-table tbody tr:last-child { border-bottom: none; }
      .tr-table tbody tr:hover { background: #f8fafc; }
      .tr-table td { padding: 12px 16px; vertical-align: middle; }

      .tr-code {
        font-size: 12px; font-weight: 700; color: #3b82f6;
        background: #eff6ff; padding: 2px 8px; border-radius: 5px;
      }
      .tr-name   { font-weight: 600; color: #0f172a; }
      .tr-num    { font-weight: 600; color: #334155; }
      .tr-letter-pass { font-weight: 800; color: #15803d; }
      .tr-letter-fail { font-weight: 800; color: #dc2626; }
      .tr-result-pass {
        font-size: 11px; font-weight: 700;
        background: #f0fdf4; color: #15803d;
        padding: 2px 8px; border-radius: 999px;
      }
      .tr-result-fail {
        font-size: 11px; font-weight: 700;
        background: #fef2f2; color: #dc2626;
        padding: 2px 8px; border-radius: 999px;
      }

      /* Summary card */
      .tr-summary {
        margin-top: 32px;
        background: #1d4ed8;
        border-radius: 16px;
        padding: 28px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .tr-summary-label {
        font-size: 11px; font-weight: 700;
        color: #93c5fd; letter-spacing: 1.5px;
        text-transform: uppercase; margin-bottom: 4px;
      }
      .tr-summary-title {
        font-size: 22px; font-weight: 800; color: #fff;
      }
      .tr-gpa-box {
        background: rgba(255,255,255,.12);
        border: 1px solid rgba(255,255,255,.2);
        border-radius: 14px;
        padding: 20px 32px;
        text-align: center;
      }
      .tr-gpa-box-label {
        font-size: 10px; font-weight: 700;
        color: #bfdbfe; letter-spacing: 1px;
        text-transform: uppercase; margin-bottom: 6px;
      }
      .tr-gpa-value {
        font-size: 48px; font-weight: 800;
        color: #fff; line-height: 1;
      }

      @media (max-width: 640px) {
        .tr-wrap { padding: 24px 16px; }
        .tr-summary { flex-direction: column; align-items: flex-start; }
      }
    `}</style>

    <div className="tr-wrap">

      <div className="tr-header">
        <h1 className="tr-title">Transkript</h1>
        <p className="tr-subtitle">Akademik not dökümü</p>
      </div>

      {Object.keys(data)
        .filter((s) => s !== 'summary')
        .map((semester) => (
          <div key={semester} className="tr-semester">

            <div className="tr-sem-head">
              <span className="tr-sem-badge">{semester}</span>
              {data[semester].semester_gpa && (
                <span className="tr-sem-gpa">Dönem GNO: {data[semester].semester_gpa}</span>
              )}
              <div className="tr-sem-line" />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {(data[semester].courses || []).length} ders
              </span>
            </div>

            <div className="tr-table-wrap">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Ders Adı</th>
                    <th>Kredi</th>
                    <th>Not</th>
                    <th>Harf</th>
                    <th>Sonuç</th>
                  </tr>
                </thead>
                <tbody>
                  {(data[semester].courses || []).map((course, i) => {
                    const fail = course.letter === 'FF';
                    return (
                      <tr key={i}>
                        <td><span className="tr-code">{course.course_code}</span></td>
                        <td><span className="tr-name">{course.course_name}</span></td>
                        <td><span className="tr-num">{course.credit}</span></td>
                        <td><span className="tr-num">{course.point}</span></td>
                        <td>
                          <span className={fail ? 'tr-letter-fail' : 'tr-letter-pass'}>
                            {course.letter}
                          </span>
                        </td>
                        <td>
                          <span className={fail ? 'tr-result-fail' : 'tr-result-pass'}>
                            {course.result}
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

      {data.summary && (
        <div className="tr-summary">
          <div>
            <p className="tr-summary-label">Genel Akademik Ortalama</p>
            <p className="tr-summary-title">GANO</p>
          </div>
          <div className="tr-gpa-box">
            <p className="tr-gpa-box-label">Genel Ortalama</p>
            <p className="tr-gpa-value">{data.summary.overall_gpa}</p>
          </div>
        </div>
      )}

    </div>
  </>
);
};
export default Transcript;