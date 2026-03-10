import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import StudentDashboard from './features/student/StudentDashboard';
import InstructorDashboard from './features/instructor/InstructorDashboard';
import CourseSelection from "./features/student/CourseSelection.jsx";
import CourseStudentsPage from './features/instructor/CourseStudentsPage';
import InstructorCoursesPage from './features/instructor/InstructorCoursesPage'
import Calendar from "./features/student/Calendar.jsx";
import CourseGrade from "./features/student/CourseGrade.jsx";
import Transcript from "./features/student/Transcript.jsx";
import Settings from "./features/student/Settings.jsx";
import 'react-toastify/dist/ReactToastify.css';
import Curriculum from "./features/student/Curriculum.jsx";
import Layout from "./components/layout/Layout";
import ForumPage from "./features/forum/ForumPage";
import ForumHome from "./features/forum/ForumHome";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/CourseSelection" element={<Layout><CourseSelection/></Layout>} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/InstructorDashboard"  element={<Layout><InstructorDashboard /></Layout>} />
        <Route path="/StudentDashboard"  element={<Layout><StudentDashboard/></Layout>} />
        <Route path="/StudentDashboard/Calendar/" element={<Layout><Calendar/></Layout>} />
        <Route path="/grades/" element={<Layout><CourseGrade/></Layout>} />
        <Route path="/transcript/" element={<Layout><Transcript/></Layout>} />
        <Route path="/settings/" element={<Layout><Settings/></Layout>} />
        <Route path="/curriculum/" element={<Layout><Curriculum/></Layout>} />
        <Route path="/InstructorCourses/:id" element={<Layout><CourseStudentsPage/></Layout>} />
        <Route path="/InstructorCourses" element={<Layout><InstructorCoursesPage/></Layout>} />
        <Route path="/forum/:id" element={<Layout><ForumPage/></Layout>} />
        <Route path="/forum/" element={<Layout><ForumHome/></Layout>} />


      </Routes>
    </Router>
  );
}

export default App;