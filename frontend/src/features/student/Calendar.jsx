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

  if (!calendarData) return <p>Yükleniyor...</p>;

  return (
    <div className="calendar-container">
      <h2>Haftalık Ders Programı</h2>
      <div className="calendar-grid">
        {Object.keys(calendarData).map((day) => (
          <div key={day} className="calendar-day-column">
            <h3>{day}</h3>
            {calendarData[day].length > 0 ? (
              calendarData[day].map((course, index) => (
                <div key={index} className="course-card">
                  <strong>{course.course_name}</strong>
                  <p>{course.course_start_time} - {course.course_end_time}</p>
                  <span>📍 {course.classroom}</span>
                </div>
              ))
            ) : (
              <p className="empty-day">Ders yok</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;