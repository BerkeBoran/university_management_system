import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EXAM_TYPES = [
  { key: 'midterm', label: 'Ara Sınav', field: 'midterm_grade', color: '#4f46e5' },
  { key: 'final', label: 'Final Sınavı', field: 'final_grade', color: '#0891b2' },
  { key: 'makeup', label: 'Bütünleme', field: 'makeup_grade', color: '#d97706' },
];

const InstructorGradesPage = () => {
  const { id:courseId } = useParams();
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (!selectedExam) return;
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/courses/enrollment-grade/?course_id=${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      })
      .then((res) => {
        setEnrollments(res.data);
        const initial = {};
        res.data.forEach((e) => {
          initial[e.student_id] = e[selectedExam.field] ?? '';
        });
        setGrades(initial);
        if (res.data[0]) setCourseName(res.data[0].course_name || '');
      })
      .finally(() => setLoading(false));
  }, [selectedExam, courseId]);

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setSaveStatus(null);
  };

  const handleGradeChange = (studentId, value) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setGrades((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const requests = enrollments.map((enrollment) =>
        axios.patch(
          `http://localhost:8000/api/courses/enrollment-grade/`,
          {
            student_no: enrollment.student_id,
            course_id: courseId,
            [selectedExam.field]: grades[enrollment.student_id] === '' ? null : Number(grades[enrollment.student_id]),
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }
        )
      );
      await Promise.all(requests);
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const accentColor = selectedExam?.color || '#4f46e5';

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Geri
        </button>
        <div>
          <h1 style={styles.title}>Not Girişi</h1>
          {courseName && <p style={styles.subtitle}>{courseName}</p>}
        </div>
      </div>

      {/* Exam Type Cards */}
      <div style={styles.examGrid}>
        {EXAM_TYPES.map((exam) => {
          const active = selectedExam?.key === exam.key;
          return (
            <button
              key={exam.key}
              onClick={() => handleSelectExam(exam)}
              style={{
                ...styles.examCard,
                borderColor: active ? exam.color : '#e2e8f0',
                background: active ? exam.color : '#fff',
                color: active ? '#fff' : '#334155',
                boxShadow: active ? `0 4px 20px ${exam.color}44` : '0 1px 4px #0001',
                transform: active ? 'translateY(-2px)' : 'none',
              }}
            >
              <span style={{ fontSize: 28 }}>{exam.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 15, marginTop: 6 }}>{exam.label}</span>
            </button>
          );
        })}
      </div>

      {/* Student List */}
      {selectedExam && (
        <div style={styles.tableWrapper}>
          <div style={{ ...styles.tableHeader, background: accentColor }}>
            <span>{selectedExam.icon} {selectedExam.label} — Öğrenci Listesi</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>{enrollments.length} öğrenci</span>
          </div>

          {loading ? (
            <div style={styles.loading}>Yükleniyor...</div>
          ) : enrollments.length === 0 ? (
            <div style={styles.empty}>Bu derse kayıtlı öğrenci bulunamadı.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Öğrenci No</th>
                  <th style={styles.th}>Ad Soyad</th>
                  <th style={styles.th}>Mevcut Not</th>
                  <th style={styles.th}>Yeni Not</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, idx) => {
                  const current = enrollment[selectedExam.field];
                  const changed =
                    grades[enrollment.student_id] !== '' &&
                    Number(grades[enrollment.student_id]) !== Number(current);
                  return (
                    <tr
                      key={enrollment.student_id}
                      style={{
                        ...styles.tr,
                        background: idx % 2 === 0 ? '#f8fafc' : '#fff',
                      }}
                    >
                      <td style={styles.td}>{idx + 1}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{enrollment.student_id}</span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{enrollment.student_name}</td>
                      <td style={styles.td}>
                        {current !== null && current !== undefined ? (
                          <span style={styles.currentGrade}>{current}</span>
                        ) : (
                          <span style={styles.noGrade}>—</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {selectedExam.key === 'makeup' && !enrollment.is_active_makeup_grade ? (
                          <span style={{
                            fontSize: 12, fontWeight: 600,
                            color: '#94a3b8',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            padding: '4px 12px',
                            borderRadius: 8,
                          }}>
                            Hak Yok
                          </span>
                        ) : (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={grades[enrollment.student_id] ?? ''}
                            onChange={(e) => handleGradeChange(enrollment.student_id, e.target.value)}
                            placeholder="0–100"
                            style={{
                              ...styles.input,
                              borderColor: changed ? accentColor : '#cbd5e1',
                              boxShadow: changed ? `0 0 0 2px ${accentColor}33` : 'none',
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Save Button */}
          {!loading && enrollments.length > 0 && (
            <div style={styles.footer}>
              {saveStatus === 'success' && (
                <div style={styles.successMsg}>✅ Notlar başarıyla kaydedildi!</div>
              )}
              {saveStatus === 'error' && (
                <div style={styles.errorMsg}>❌ Kaydetme sırasında hata oluştu.</div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  ...styles.saveBtn,
                  background: saving ? '#94a3b8' : accentColor,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? '⏳ Kaydediliyor...' : '💾 Notları Kaydet'}
              </button>
            </div>
          )}
        </div>
      )}

      {!selectedExam && (
        <div style={styles.hint}>
          Yukarıdan bir sınav türü seçerek not girişine başlayın.
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)',
    padding: '32px 24px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 32,
  },
  backBtn: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '8px 18px',
    cursor: 'pointer',
    fontWeight: 600,
    color: '#475569',
    fontSize: 14,
    transition: 'all .15s',
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#0f172a',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#64748b',
    fontSize: 14,
  },
  examGrid: {
    display: 'flex',
    gap: 16,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  examCard: {
    flex: '1 1 160px',
    maxWidth: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '22px 16px',
    borderRadius: 16,
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all .2s ease',
    fontFamily: 'inherit',
  },
  tableWrapper: {
    background: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 24px #0000000d',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: '#f1f5f9',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e2e8f0',
  },
  tr: {
    transition: 'background .1s',
  },
  td: {
    padding: '13px 16px',
    fontSize: 14,
    color: '#334155',
    borderBottom: '1px solid #f1f5f9',
  },
  badge: {
    background: '#eff6ff',
    color: '#3b82f6',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  currentGrade: {
    background: '#f0fdf4',
    color: '#16a34a',
    padding: '3px 12px',
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 14,
  },
  noGrade: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  input: {
    width: 90,
    padding: '7px 10px',
    borderRadius: 8,
    border: '2px solid',
    fontSize: 14,
    fontWeight: 600,
    outline: 'none',
    transition: 'all .15s',
    color: '#0f172a',
  },
  footer: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
    borderTop: '1px solid #f1f5f9',
    flexWrap: 'wrap',
  },
  saveBtn: {
    padding: '12px 32px',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    fontFamily: 'inherit',
    transition: 'all .2s',
  },
  successMsg: {
    background: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
  },
  errorMsg: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 600,
  },
  loading: {
    padding: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
  },
  empty: {
    padding: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
  },
  hint: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
    marginTop: 40,
  },
};

export default InstructorGradesPage;