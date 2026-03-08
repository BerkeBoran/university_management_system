// Transcript.jsx
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

      {Object.keys(data).map((semester) => (
        <div key={semester} className="mb-8">
          <h3 className="bg-gray-100 p-2 font-semibold border-l-4 border-indigo-600 mb-2">
            {semester}
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
              {data[semester].courses.map((course, index) => (
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
    </div>
  );
};
export default Transcript;