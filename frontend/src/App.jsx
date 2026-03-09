import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import StudentDashboard from './features/student/StudentDashboard';
import InstructorDashboard from './features/instructor/InstructorDashboard';
import CourseSelection from "./features/student/CourseSelection.jsx";
import CourseStudentsPage from './features/instructor/CourseStudentsPage';
import Calendar from "./features/student/Calendar.jsx";
import CourseGrade from "./features/student/CourseGrade.jsx";
import Transcript from "./features/student/Transcript.jsx";
import Settings from "./features/student/Settings.jsx";
import 'react-toastify/dist/ReactToastify.css';
import Curriculum from "./features/student/Curriculum.jsx";

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
        <Route path="/grades/" element={<CourseGrade/>}/>
        <Route path="/transcript/" element={<Transcript/>}/>
        <Route path="/settings/" element={<Settings/>}/>
        <Route path="/curriculum/" element={<Curriculum/>}/>

      </Routes>
    </Router>
  );
}

export default App;