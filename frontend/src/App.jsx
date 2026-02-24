import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import StudentDashboard from './features/student/StudentDashboard';
import InstructorDashboard from './features/instructor/InstructorDashboard';
import CourseSelection from "./features/student/CourseSelection.jsx";
import CourseStudentsPage from './features/instructor/CourseStudentsPage';
import Calendar from "./features/student/Calendar.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/CourseSelection" element={<CourseSelection/>} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/InstructorDashboard"  element={<InstructorDashboard/>} />
        <Route path="/StudentDashboard"  element={<StudentDashboard/>} />
        <Route path="/instructor/course/:id/students" element={<CourseStudentsPage />} />
        <Route path="/StudentDashboard/Calendar/" element={<Calendar/>}/>
      </Routes>
    </Router>
  );
}

export default App;