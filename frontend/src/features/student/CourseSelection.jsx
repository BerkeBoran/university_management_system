import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseSelection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedSections,setSelectedSections] = useState([])

    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/courses/course-list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Gelen Veri:", response.data); // Buraya bak!
                setCourses(response.data);
                setLoading(false);
            } catch (err) {
                setError("Kurslar yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        };
        fetchCourses();
    }, [token]);

    const handleSectionChange = async (courseId, sectionId) =>{
        setSelectedSections(prev => ({...prev,[courseId]: sectionId}));
    };

    const handleEnroll = async (courseId) => {
            const section_id = selectedSections[courseId];
            if (!section_id) {
            alert("Lütfen bir şube seçin!");
            return;}
            setEnrollingId(courseId);
            try {
            const response = await axios.post('http://localhost:8000/api/users/courses/',
                { course_id: courseId,section_id: section_id },
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
                                    {course.ects} AKTS
                                </span>
                                 <span className="text-gray-500 text-sm font-medium">
                                    {selectedSections[course.id] ? (
                                        (() => {
                                            const selectedSec = course.sections.find(
                                                (s) => s.id.toString() === selectedSections[course.id].toString()
                                            );
                                            return selectedSec
                                                ? `${selectedSec.remaining_capacity ?? '0'} / ${selectedSec.capacity ?? course.capacity} Kontenjan`
                                                : `${course.capacity} Toplam Kapenjan`;
                                        })()
                                    ) : (
                                        `Toplam: ${course.capacity} Kontenjan`
                                    )}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {course.sections[0]?.course_name || "İsimsiz Ders"}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {course.sections[0]?.course_detail || "Açıklama mevcut değil."}
                            </p>
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-500">
                                    Kod: <span className="font-mono font-bold text-gray-700">{course.course_id}</span>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Şube Seçiniz:</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={selectedSections[course.id] || ""}
                                        onChange={(e) => handleSectionChange(course.id, e.target.value)}
                                    >
                                        <option value="">Lütfen seçin...</option>

                                        {course.sections && course.sections.length > 0 ? (
                                            course.sections.map((sec) => (
                                                <option key={sec.id} value={sec.id}>
                                                     Instructor: {sec.instructor} --  Day: {sec.course_days} -- Start Time: {sec.course_start_time.slice(0,5)} -- End Time:{sec.course_end_time.slice(0,5)}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Şube bulunamadı</option>
                                        )}
                                    </select>
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