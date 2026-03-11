import {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const InstructorDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState(false)
  const token = localStorage.getItem('access')
  const fullName = localStorage.getItem('full_name');
  const title = localStorage.getItem('title');
useEffect(() => {
  if (!token) return;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/users/profile/",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setInstructorData(res.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err.response?.status);
    }
  };

  fetchProfile();
}, [token]);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      {/* Başlık */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Hoş geldiniz, {title} {fullName}
          </h2>
        </div>
      </div>

      {/* Ders Listesi */}
      <div className="grid gap-4">
        {instructorData?.courses?.map(course => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-400 transition-colors group"
          >
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {course.code}
                </span>
                <h3 className="text-xl font-bold text-slate-800">{course.course_name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex flex-col items-center px-4">
                <span className="text-2xl font-black text-slate-800">{course.remaining_capacity}</span>
                <span className="text-xs text-slate-400 font-bold uppercase">Öğrenci</span>
              </div>
              <div className="flex gap-2 flex-grow md:flex-grow-0">
                <button
                  onClick={() => navigate(`/instructor/course/${course.id}/students`)}
                  className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Liste
                </button>
                <button
                  onClick={() => navigate(`/instructor/course/${course.id}/grades`)}
                  className="flex-1 md:flex-none px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition"
                >
                  Notlar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorDashboard;