import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const InstructorDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fullName = localStorage.getItem('full_name') || "Dr. Berke Boran";
  const title = localStorage.getItem('title') || "Öğretim Görevlisi";

  const myCourses = [
    { id: 1, code: "CENG204", name: "Veri Yapıları", students: 42, semester: "Güz" },
    { id: 2, code: "CENG101", name: "Bilgisayar Mühendisliğine Giriş", students: 120, semester: "Güz" },
    { id: 3, code: "CENG405", name: "Dağıtık Sistemler", students: 25, semester: "Güz" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-800 shadow-lg p-4 flex justify-between items-center relative z-50 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none">Üniversite Yönetim Sistemi</h1>
            <span className="text-xs text-slate-400">Akademik Personel Paneli</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-700 p-1 pr-3 rounded-full">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">
            {fullName.charAt(0)}
          </div>
          <span className="text-sm font-medium">{fullName}</span>
        </div>

        {/* Sol Üst Açılır Menü */}
        {isMenuOpen && (
          <div className="absolute top-16 left-4 w-64 bg-white shadow-2xl rounded-xl border border-slate-200 p-2 text-slate-800 animate-in fade-in zoom-in duration-200">
            <nav className="flex flex-col gap-1">
              <Link to="/InstructorDashboard" className="flex items-center gap-3 p-3 bg-slate-100 text-blue-700 rounded-lg font-semibold">
                <span>📂 Derslerim</span>
              </Link>
              <button className="flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 rounded-lg transition">
                <span>📝 Not Girişi</span>
              </button>
              <button className="flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 rounded-lg transition">
                <span>📊 İstatistikler</span>
              </button>
              <hr className="my-2 border-slate-100" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg w-full transition"
              >
                <span>🚪 Güvenli Çıkış</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="p-8 max-w-6xl mx-auto w-full flex-grow">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Hoş geldiniz, {title} {fullName}</h2>
            <p className="text-slate-500 font-medium">Bu dönem verdiğiniz dersler aşağıda listelenmiştir.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            📢 Yeni Duyuru Yayınla
          </button>
        </div>

        <div className="grid gap-4">
          {myCourses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-400 transition-colors group">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{course.code}</span>
                    <span className="text-xs font-medium text-slate-400">{course.semester} Dönemi</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{course.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col items-center px-4">
                  <span className="text-2xl font-black text-slate-800">{course.students}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase">Öğrenci</span>
                </div>
                <div className="flex gap-2 flex-grow md:flex-grow-0">
                  <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition">
                    Liste
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition">
                    Notlar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;