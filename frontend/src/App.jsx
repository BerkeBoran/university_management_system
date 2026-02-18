import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import StudentDashboard from './features/student/StudentDashboard';
import InstructorDashboard from './features/instructor/InstructorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/InstructorDashboard"  element={<InstructorDashboard/>} />
        <Route path="/StudentDashboard"  element={<StudentDashboard/>} />


      </Routes>
    </Router>
  );
}

export default App;