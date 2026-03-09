import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transcript = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/transcript/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    }).then(res => setData(res.data));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Öğrenci Transkripti</h2>



      {Object.keys(data).filter((semester) => semester !== "summary").map((semester) => (
        <div key={semester} className="mb-8">
          <h3 className="bg-gray-100 p-2 font-semibold border-l-4 border-indigo-600 mb-2">
            {semester}
            <p className="text-sm font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-md mb-1">
              Dönem Ortalaması: {data[semester].semester_gpa}
            </p>
          </h3>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-2">Kod</th>
                <th>Ders Adı</th>
                <th>Kredi</th>
                <th>Not</th>
                <th>Harf</th>
                <th>Sonuç</th>
              </tr>
            </thead>

            <tbody>
              {(data[semester].courses || []).map((course, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.credit}</td>
                  <td>{course.point}</td>
                  <td className={`font-bold ${course.letter === 'FF' ? 'text-red-500' : 'text-green-600'}`}>
                    {course.letter}
                  </td>
                  <td>{course.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {data.summary && (
        <div className="mt-12 bg-gradient-to-r from-indigo-700 to-blue-800 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h4 className="text-indigo-200 uppercase text-xs font-bold tracking-widest mb-1">
              Genel Akademik Not Ortalaması
            </h4>
            <h2 className="text-3xl font-black italic">GANO</h2>
          </div>

          <div className="flex gap-12 items-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-inner">
              <p className="text-indigo-100 text-[10px] font-bold uppercase mb-1 text-center">Genel Ortalama</p>
              <p className="text-6xl font-black text-white leading-none">
                {data.summary.overall_gpa}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Transcript;