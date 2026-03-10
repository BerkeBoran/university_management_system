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

  if (loading) return <div className="container mt-4">Yükleniyor...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Öğrenci Listesi</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Kullanıcı Adı</th>
            <th>Ad Soyad</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.username}</td>
                <td>{student.full_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                Bu derse kayıtlı öğrenci yok
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Geri Dön
      </button>
    </div>
  );
};

export default CourseStudentsPage;
