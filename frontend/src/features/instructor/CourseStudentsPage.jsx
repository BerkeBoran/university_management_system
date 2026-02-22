import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CourseStudentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Hatayı tanımladık

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // İstek başlarken loading true
        const response = await axios.get(`http://localhost:8000/api/courses/instructor/course-detail/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Gelen Veri Yapısı:", response.data);
        setCourseData(response.data);
        setError(null);
      } catch (err) {
        console.error("Öğrenciler yüklenemedi", err);
        setError("Veriler çekilirken bir hata oluştu.");
      } finally {
        setLoading(false); // VERİ GELSE DE GELMESE DE LOADING DURMALI
      }
    };

    if (id) {
        fetchStudents();
    }
  }, [id, token]);

  // Loading kontrolü burada duruyor
  if (loading) return <div className="container mt-4">Yükleniyor...</div>;

  // Error kontrolü artık hata vermez
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
        <h2>{courseData?.course_name} - Öğrenci Listesi</h2>
        <p>Kapasite: {courseData?.capacity}</p>

        <table className="table">
            <thead>
                <tr>
                    <th>Kullanıcı Adı</th>
                    <th>Ad Soyad</th>
                </tr>
            </thead>
            <tbody>
                {courseData?.students && courseData.students.length > 0 ? (
                    courseData.students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.username}</td>
                            <td>{student.full_name}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" className="text-center">Bu derse kayıtlı öğrenci yok.</td>
                    </tr>
                )}
            </tbody>
        </table>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Geri Dön</button>
    </div>
  );
};

export default CourseStudentsPage;