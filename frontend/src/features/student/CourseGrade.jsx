import React, { useEffect, useState } from "react";
import axios from "axios";

const CourseGrade = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/courses/student-grade/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setGrades(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Notlar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded m-6">{error}</div>;
  if (grades.length === 0) return <div className="text-center mt-10 text-gray-500">Henüz kayıtlı ders bulunmuyor.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Not Durumu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((grade) => (
          <div key={grade.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-400 text-xs font-mono">{grade.course_id}</span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">{grade.course_name}</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 font-medium">Vize</span>
                <span className={`text-sm font-bold ${grade.midterm === null ? 'text-gray-400' : 'text-indigo-600'}`}>
                  {grade.midterm ?? "-"}
                </span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 font-medium">Final</span>
                <span className={`text-sm font-bold ${grade.final === null ? 'text-gray-400' : 'text-indigo-600'}`}>
                  {grade.final ?? "-"}
                </span>
              </div>
              {grade.is_active_makeup_grade && (
               <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 font-medium">Bütünleme</span>
                <span className={`text-sm font-bold ${grade.makeup === null ? 'text-gray-400' : 'text-indigo-600'}`}>
                  {grade.makeup ?? "-"}
                </span>
              </div>)}
              <div className="flex justify-between items-center bg-indigo-50 p-2 rounded mt-2">
                  <span className="text-sm text-indigo-700 font-bold">Harf Notu</span>
                  <span className="text-lg font-black text-indigo-900">
                      {grade.letter ?? "Belli Değil"}
                  </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseGrade;