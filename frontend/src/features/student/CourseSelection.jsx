import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const CourseSelection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedSections,setSelectedSections] = useState([])

    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/courses/course-list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(response.data);
                setLoading(false);
            } catch (err) {
                setError("Kurslar yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        };
        fetchCourses();
    }, [token]);

    const visibleCourses = useMemo(() => {
        const map = new Map();
        courses.forEach((course, index) => {
            const key =
                course.course_id ??
                course.id ??
                course.sections?.[0]?.course_name ??
                course.course_name ??
                `__idx_${index}`;
            if (!map.has(key)) {
                map.set(key, course);
            }
        });
        return Array.from(map.values());
    }, [courses]);

    const handleSectionChange = async (courseId, sectionId) =>{
        setSelectedSections(prev => ({...prev,[courseId]: sectionId}));
    };

    const handleEnroll = async (courseId) => {
            const section_id = selectedSections[courseId];
            if (!section_id) {
            alert("Lütfen bir şube seçin!");
            return;}
            setEnrollingId(courseId);
            try {
            const response = await axios.post('http://localhost:8000/api/users/courses/',
                { course_id: courseId,section_id: section_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message || "Kaydınız başarıyla tamamlandı!");
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Kayıt başarısız!";
            alert(errorMsg);
        } finally {
            setEnrollingId(null);
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

      /* Page header */
      .cs-header { margin-bottom: 28px; }
      .cs-title { font-size: 26px; font-weight: 800; color: #0f172a; }
      .cs-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      /* Error */
      .cs-error {
        background: #fef2f2; border: 1px solid #fecaca;
        color: #b91c1c; font-size: 13px; font-weight: 500;
        padding: 12px 16px; border-radius: 10px; margin-bottom: 20px;
      }

      /* Grid */
      .cs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
      }

      /* Card */
      .cs-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        transition: border-color .15s, box-shadow .15s;
      }
      .cs-card:hover { border-color: #bfdbfe; box-shadow: 0 2px 16px #3b82f612; }

      /* Card top row */
      .cs-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
      .cs-dept-badge {
        background: #eff6ff; color: #1d4ed8;
        font-size: 11px; font-weight: 700;
        padding: 3px 10px; border-radius: 999px;
        letter-spacing: .3px;
      }
      .cs-meta { display: flex; gap: 8px; align-items: center; }
      .cs-ects {
        background: #f8fafc; border: 1px solid #e2e8f0;
        color: #475569; font-size: 11px; font-weight: 600;
        padding: 3px 10px; border-radius: 999px;
      }
      .cs-capacity {
        background: #f0fdf4; border: 1px solid #bbf7d0;
        color: #15803d; font-size: 11px; font-weight: 600;
        padding: 3px 10px; border-radius: 999px;
      }

      /* Course info */
      .cs-course-code {
        display: inline-block;
        font-size: 11px; font-weight: 700; color: #3b82f6;
        background: #eff6ff; padding: 2px 8px; border-radius: 5px;
        margin-bottom: 4px;
      }
      .cs-course-name { font-size: 16px; font-weight: 700; color: #0f172a; line-height: 1.3; }
      .cs-course-desc { font-size: 13px; color: #64748b; line-height: 1.5; }

      /* Section select */
      .cs-select-wrap {}
      .cs-select-label { font-size: 11px; font-weight: 600; color: #94a3b8; letter-spacing: .5px; text-transform: uppercase; margin-bottom: 6px; }
      .cs-select {
        width: 100%;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 9px 12px;
        font-size: 13px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1e293b;
        background: #f8fafc;
        outline: none;
        cursor: pointer;
        transition: border-color .15s;
      }
      .cs-select:focus { border-color: #3b82f6; background: #fff; }

      /* Enroll button */
      .cs-btn {
        width: 100%;
        padding: 11px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        border: none;
        cursor: pointer;
        transition: background .15s, opacity .15s;
        background: #1d4ed8;
        color: #fff;
        margin-top: 2px;
      }
      .cs-btn:hover:not(:disabled) { background: #1e40af; }
      .cs-btn:disabled { background: #cbd5e1; color: #94a3b8; cursor: not-allowed; }

      @media (max-width: 640px) { .cs-wrap { padding: 24px 16px; } }
    `}</style>

    <div className="cs-wrap">

      {/* Header */}
      <div className="cs-header">
        <h1 className="cs-title">Ders Seçimi</h1>
        <p className="cs-subtitle">{visibleCourses.length} ders mevcut</p>
      </div>

      {/* Error */}
      {error && <div className="cs-error">{error}</div>}

      {/* Grid */}
      <div className="cs-grid">
        {visibleCourses.map((course) => {
          const selectedSec = course.sections?.find(
            (s) => s.id.toString() === (selectedSections[course.id] || '').toString()
          );
          const capacityText = selectedSec
            ? `${selectedSec.remaining_capacity ?? 0} / ${selectedSec.capacity ?? course.capacity} Kontenjan`
            : `${course.capacity} Kontenjan`;

          return (
            <div key={course.id} className="cs-card">

              {/* Top badges */}
              <div className="cs-card-top">
                <span className="cs-course-code">{course.course_id}</span>
                <div className="cs-meta">
                  <span className="cs-ects">{course.ects} AKTS</span>
                  <span className="cs-capacity">{capacityText}</span>
                </div>
              </div>

              {/* Course info */}
              <div>
                <h3 className="cs-course-name">{course.sections[0]?.course_name || 'İsimsiz Ders'}</h3>
                {course.sections[0]?.course_detail && (
                  <p className="cs-course-desc" style={{ marginTop: 6 }}>
                    {course.sections[0].course_detail}
                  </p>
                )}
              </div>

              {/* Section select */}
              <div className="cs-select-wrap">
                <p className="cs-select-label">Şube Seçiniz</p>
                <select
                  className="cs-select"
                  value={selectedSections[course.id] || ''}
                  onChange={(e) => handleSectionChange(course.id, e.target.value)}
                >
                  <option value="">Şube seçin...</option>
                  {course.sections?.length > 0 ? (
                    course.sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                          {sec.instructor_title}.{sec.instructor_name} — {sec.course_days} {sec.course_start_time.slice(0, 5)}–{sec.course_end_time.slice(0, 5)}
                      </option>
                    ))
                  ) : (
                    <option disabled>Şube bulunamadı</option>
                  )}
                </select>
              </div>

              {/* Enroll button */}
              <button
                className="cs-btn"
                onClick={() => handleEnroll(course.id)}
                disabled={enrollingId === course.id}
              >
                {enrollingId === course.id ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  </>
);
};

export default CourseSelection;
