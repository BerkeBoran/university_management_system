import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklyCalendar = () => {
  const [calendarData, setCalendarData] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://0.0.0.0:8000/api/courses/calendar/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCalendarData(response.data);
      } catch (error) {
        console.error("Takvim yüklenirken hata oluştu:", error);
      }
    };
    fetchCalendar();
  }, []);


if (!calendarData) return (
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

const DAY_COLORS = {
  Pazartesi: { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6' },
  Salı:      { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
  Çarşamba:  { bg: '#fdf4ff', border: '#e9d5ff', dot: '#a855f7' },
  Perşembe:  { bg: '#fff7ed', border: '#fed7aa', dot: '#f97316' },
  Cuma:      { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
  Cumartesi: { bg: '#f8fafc', border: '#e2e8f0', dot: '#64748b' },
  Pazar:     { bg: '#f8fafc', border: '#e2e8f0', dot: '#64748b' },
};

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .cal-wrap * { box-sizing: border-box; }
      .cal-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .cal-header { margin-bottom: 28px; }
      .cal-title   { font-size: 26px; font-weight: 800; color: #0f172a; }
      .cal-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      /* Grid — one column per day */
      .cal-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 14px;
        align-items: start;
      }

      /* Day column */
      .cal-day {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
      }

      .cal-day-head {
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .5px;
        text-transform: uppercase;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cal-day-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .cal-day-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; }

      /* Course slot */
      .cal-slot {
        border-radius: 10px;
        padding: 12px 14px;
        border: 1px solid;
        transition: opacity .15s;
      }
      .cal-slot:hover { opacity: .85; }
      .cal-slot-name {
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 5px;
        line-height: 1.3;
      }
      .cal-slot-time {
        font-size: 12px;
        font-weight: 600;
        color: #475569;
        margin-bottom: 4px;
      }
      .cal-slot-room {
        font-size: 11px;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Empty day */
      .cal-empty {
        padding: 20px 14px;
        text-align: center;
        font-size: 12px;
        color: #cbd5e1;
        font-weight: 500;
      }

      @media (max-width: 640px) {
        .cal-wrap { padding: 24px 16px; }
        .cal-grid  { grid-template-columns: 1fr; }
      }
    `}</style>

    <div className="cal-wrap">
      <div className="cal-header">
        <h1 className="cal-title">Haftalık Ders Programı</h1>
        <p className="cal-subtitle">Bu haftaki ders takviminiz</p>
      </div>

      <div className="cal-grid">
        {Object.keys(calendarData).map((day) => {
          const colors = DAY_COLORS[day] || DAY_COLORS['Cumartesi'];
          return (
            <div key={day} className="cal-day">

              {/* Day heading */}
              <div className="cal-day-head" style={{ background: colors.bg, color: '#1e293b' }}>
                <span className="cal-day-dot" style={{ background: colors.dot }} />
                {day}
              </div>

              <div className="cal-day-body">
                {calendarData[day].length > 0 ? (
                  (() => {
                    const seen = new Set();
                    const uniqueCourses = calendarData[day].filter((course) => {
                      const key =
                        course.course_id ??
                        `${course.course_name || ''}|${course.course_start_time || ''}|${course.course_end_time || ''}|${course.classroom || ''}`;
                      if (seen.has(key)) return false;
                      seen.add(key);
                      return true;
                    });
                    return uniqueCourses.map((course, i) => (
                    <div
                      key={i}
                      className="cal-slot"
                      style={{ background: colors.bg, borderColor: colors.border }}
                    >
                      <p className="cal-slot-name">{course.course_name}</p>
                      <p className="cal-slot-time">
                        {course.course_start_time} – {course.course_end_time}
                      </p>
                      <span className="cal-slot-room">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        {course.classroom}
                      </span>
                    </div>
                    ));
                  })()
                ) : (
                  <p className="cal-empty">Ders yok</p>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  </>
);
};

export default WeeklyCalendar;
