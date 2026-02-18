import { useState, useEffect } from 'react';
import axios from "axios";

const StudentDashboard = () => {
  const fullName = localStorage.getItem('full_name')
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState(null);

useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
          console.error("Token bulunamadı!");
          setLoading(false);
          return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/users/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentData(res.data);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600">UniPort</h2>
        </div>
        <nav className="mt-4">
          <a href="#" className="block py-2.5 px-6 bg-blue-50 text-blue-700 border-r-4 border-blue-700 font-medium">Panelim</a>
          <a href="#" className="block py-2.5 px-6 text-gray-600 hover:bg-gray-50 transition">Ders Seçimi</a>
          <a href="#" className="block py-2.5 px-6 text-gray-600 hover:bg-gray-50 transition">Notlarım</a>
          <a href="#" className="block py-2.5 px-6 text-gray-600 hover:bg-gray-50 transition">Ayarlar</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Tekrar Hoş Geldin, {studentData?.first_name || fullName}! 👋</h1>
          <p className="mt-2 text-blue-100">Bölüm: Bilgisayar Mühendisliği | Genel Not Ortalaman: <span className="font-bold text-white">{studentData?.gpa || "0.00"}</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-semibold">Kayıtlı Ders</p>
            <p className="text-2xl font-bold text-gray-800">{studentData?.courses?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-semibold">Toplam AKTS</p>
            <p className="text-2xl font-bold text-gray-800">
                {studentData?.courses?.reduce((sum, c) => sum + (c.ects || 0), 0) || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-semibold">Devamsızlık Durumu</p>
            <p className="text-2xl font-bold text-green-600">%100 Katılım</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Aktif Derslerim</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {studentData?.courses?.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{course.course_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{course.course_id}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold">
                  {course.ects} AKTS
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>Kredi: {course.credit}</span>
                <button className="text-blue-600 hover:underline font-medium">Detaylara Git</button>
              </div>
            </div>
          ))}
          {studentData?.courses?.length === 0 && (
            <div className="col-span-full p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                Henüz ders seçimi yapmadınız.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;