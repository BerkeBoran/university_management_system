import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/instructor-courses/', {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    }).then(res => setCourses(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Verdiğiniz Dersler</h2>
      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-3">
            <div
              className="card h-100 shadow-sm hover-shadow cursor-pointer"
              onClick={() => navigate(`/InstructorCourses/${course.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary">{course.course_name}</h5>
                <p className="card-text text-muted">{course.course_id}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Öğrencileri Gör &rarr;</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InstructorCoursesPage;