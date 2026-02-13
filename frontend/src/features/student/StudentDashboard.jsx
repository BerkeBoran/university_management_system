import { useState } from 'react';

const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fullName = localStorage.getItem('full_name') || "Berke Boran"; // Örnek isim

  // Örnek Ders Programı Verisi
  const schedule = [
    { id: 1, name: "Veri Yapıları", day: "Pazartesi", time: "09:00 - 12:00", room: "Lab 2" },
    { id: 2, name: "Web Programlama", day: "Salı", time: "13:00 - 16:00", room: "Derslik 101" },
    { id: 3, name: "Nesne Yönelimli Programlama", day: "Çarşamba", time: "10:00 - 12:00", room: "Amfi 1" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Üst Bar */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-4">
          {/* Açılır Menü Butonu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-700">UniSystem</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{fullName}</span>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {fullName.charAt(0)}
          </div>
        </div>

        {/* Sol Üst Açılır Menü Content */}
        {isMenuOpen && (
          <div className="absolute top-16 left-4 w-64 bg-white shadow-xl rounded-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-1">
              <button className="flex items-center gap-3 p-3 hover:bg-blue-50 text-blue-700 rounded-lg font-medium">
                <span>🏠 Dashboard</span>
              </button>
              <button className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 rounded-lg">
                <span>📚 Ders Kaydı</span>
              </button>
              <button className="flex items-center gap-3 p-3 hover:bg-gray-50 text-gray-600 rounded-lg">
                <span>📝 Notlarım</span>
              </button>
              <hr className="my-2" />
              <button className="flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg">
                <span>🚪 Çıkış Yap</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Ana İçerik */}
      <main className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sol Kolon: Ders Programı */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              📅 Haftalık Ders Programı
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3">Gün</th>
                    <th className="pb-3">Ders</th>
                    <th className="pb-3">Saat</th>
                    <th className="pb-3">Yer</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {schedule.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 font-semibold text-gray-700">{item.day}</td>
                      <td className="py-4 text-blue-600 font-medium">{item.name}</td>
                      <td className="py-4 text-gray-600">{item.time}</td>
                      <td className="py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.room}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sağ Kolon: Hızlı Ders Kaydı */}
        <div className="space-y-6">
          <section className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <h2 className="text-lg font-bold mb-2">Ders Kaydı Aktif!</h2>
            <p className="text-blue-100 text-sm mb-4">2025-2026 Bahar dönemi için ders seçiminizi yapabilirsiniz.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition">
              Ders Seçimine Git
            </button>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Duyurular</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 pl-3">
                <p className="text-sm font-medium">Vize sınav takvimi açıklandı.</p>
                <span className="text-xs text-gray-400">2 saat önce</span>
              </div>
              <div className="border-l-4 border-green-400 pl-3">
                <p className="text-sm font-medium">Staj başvuruları başladı.</p>
                <span className="text-xs text-gray-400">Dün</span>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;