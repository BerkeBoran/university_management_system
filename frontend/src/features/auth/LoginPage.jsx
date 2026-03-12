import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const [role, setRole] = useState('student')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/users/login/",
      {
        username,
        password,
        role,
      }
    );

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("user_role", role);
    localStorage.setItem("full_name", response.data.full_name);
    localStorage.setItem("user_id", response.data.user_id)
    localStorage.setItem("title", response.data.title)

    alert("Giriş Başarılı!");

    if (role === "student") {
      navigate("/StudentDashboard");
    } else {
      navigate("/InstructorDashboard");
    }

  } catch (error) {
    console.error("TAM HATA:", error);

    const code = error.response?.data?.code;

    if (code === "invalid_role") {
      alert("Seçtiğiniz rol ile hesabınız eşleşmiyor!");
    } else {
      alert("Kullanıcı adı veya şifre hatalı.");
    }
  }
};


return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .lp-wrap * { box-sizing: border-box; }
      .lp-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        min-height: 100vh;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      .lp-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 40px;
        width: 100%;
        max-width: 420px;
        box-shadow: 0 4px 24px #0f172a0a;
      }

      .lp-logo {
        text-align: center;
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -.5px;
        margin-bottom: 6px;
      }
      .lp-logo span { color: #3b82f6; }
      .lp-tagline {
        text-align: center;
        font-size: 13px;
        color: #94a3b8;
        font-weight: 500;
        margin-bottom: 28px;
      }

      /* Role toggle */
      .lp-toggle {
        display: flex;
        background: #f1f5f9;
        border-radius: 10px;
        padding: 4px;
        margin-bottom: 24px;
        gap: 4px;
      }
      .lp-toggle-btn {
        flex: 1;
        padding: 9px;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer;
        transition: all .15s;
        background: transparent;
        color: #64748b;
      }
      .lp-toggle-btn.active {
        background: #fff;
        color: #1d4ed8;
        box-shadow: 0 1px 4px #0f172a14;
      }

      /* Form fields */
      .lp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
      .lp-label { font-size: 12px; font-weight: 700; color: #475569; }
      .lp-input {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 11px 14px;
        font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1e293b;
        background: #f8fafc;
        outline: none;
        transition: border-color .15s, background .15s;
      }
      .lp-input:focus { border-color: #3b82f6; background: #fff; }
      .lp-input::placeholder { color: #cbd5e1; }

      /* Submit */
      .lp-btn {
        width: 100%;
        padding: 12px;
        background: #1d4ed8;
        color: #fff;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer;
        margin-top: 8px;
        transition: background .15s;
      }
      .lp-btn:hover { background: #1e40af; }
      .lp-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
    `}</style>

    <div className="lp-wrap">
      <div className="lp-card">

        <div className="lp-logo">Üniversite Yönetim Sistemi</div>
        {/* Role toggle */}
        <div className="lp-toggle">
          <button
            className={`lp-toggle-btn${role === 'student' ? ' active' : ''}`}
            onClick={() => setRole('student')}
            type="button"
          >
            Öğrenci
          </button>
          <button
            className={`lp-toggle-btn${role === 'instructor' ? ' active' : ''}`}
            onClick={() => setRole('instructor')}
            type="button"
          >
            Akademisyen
          </button>
        </div>

        {/* Form */}
        <div>
          <div className="lp-field">
            <label className="lp-label">Kullanıcı Adı / No</label>
            <input
              className="lp-input"
              type="text"
              required
              placeholder="Kullanıcı adınızı girin"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="lp-field">
            <label className="lp-label">Şifre</label>
            <input
              className="lp-input"
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="lp-btn" onClick={handleLogin}>
            Giriş Yap
          </button>
        </div>

      </div>
    </div>
  </>
);
};

export default LoginPage;