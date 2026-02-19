import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import StudentDashboard from './features/student/StudentDashboard';
import InstructorDashboard from './features/instructor/InstructorDashboard';
import CourseSelection from "./features/student/CourseSelection.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/CourseSelection" element={<CourseSelection/>} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/InstructorDashboard"  element={<InstructorDashboard/>} />
        <Route path="/StudentDashboard"  element={<StudentDashboard/>} />


      </Routes>
    </Router>
  );
}

export default App;