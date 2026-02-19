import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseSelection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/courses/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(response.data);
                setLoading(false);
            } catch (err) {
                setError("Kurslar yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        };
        fetchCourses();
    }, [token]);

    const handleEnroll = async (courseId) => {
        setEnrollingId(courseId);
        try {
            const response = await axios.post('http://localhost:8000/api/users/courses/',
                { course_id: courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message || "Kaydınız başarıyla tamamlandı!");
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Kayıt başarısız!";
            alert(errorMsg);
        } finally {
            setEnrollingId(null);
        }
    };

    if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Ders Seçimi</h2>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {course.department_name || 'Genel'}
                                </span>
                                <span className="text-gray-500 text-sm font-medium">
                                    {course.ects} ECTS
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.course_name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {course.course_detail || "Bu ders için açıklama bulunmuyor."}
                            </p>

                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-500">
                                    Kod: <span className="font-mono font-bold text-gray-700">{course.course_id}</span>
                                </div>

                                <button
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={enrollingId === course.id}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        enrollingId === course.id
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {enrollingId === course.id ? 'Kaydediliyor...' : 'Kayıt Ol'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseSelection;