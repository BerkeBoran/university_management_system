import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [role, setRole] = useState('student')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        username: username,
        password: password,
        role: role
      });

      if (response.status === 200) {
        alert("Giriş Başarılı!");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_role', role )
        if (role == 'student') navigate('/StudentDashboard')
        else navigate('/InstructorDashboard')
      }
    } catch (error) {
      alert("Hatalı kullanıcı adı veya şifre!");
      console.error("Login hatası:", error);
    }
  };

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Üniversite Sistemi</h2>

        {/* Seçim Sekmeleri */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-md transition ${role === 'student' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}
          >
            Öğrenci
          </button>
          <button
            onClick={() => setRole('instructor')}
            className={`flex-1 py-2 rounded-md transition ${role === 'instructor' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}
          >
            Akademisyen
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı / No</label>
            <input
              type="text" required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password" required
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
             {role === 'student' ? 'Öğrenci Girişi' : 'Akademisyen Girişi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;