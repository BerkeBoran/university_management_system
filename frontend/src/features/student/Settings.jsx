import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (formData.new_password !== formData.confirm_password) {
        setLoading(false)
      return setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor!' });
    }

    try {
      const response = await axios.patch('http://localhost:8000/api/users/settings/',
        {
          old_password: formData.old_password,
          new_password: formData.new_password
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }
      );
      toast.success('Şifreniz başarıyla değiştirildi! Yönlendiriliyorsunuz...');
     localStorage.clear();
        setTimeout(() => navigate("/"), 2000);
      setMessage({ type: 'success', text: response.data.message });
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Bir hata oluştu.' });
    }
  };


return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .sp-wrap * { box-sizing: border-box; }
      .sp-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .sp-header { margin-bottom: 28px; }
      .sp-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .sp-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      .sp-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 28px;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      /* Message */
      .sp-msg-error {
        background: #fef2f2; border: 1px solid #fecaca;
        color: #b91c1c; font-size: 13px; font-weight: 500;
        padding: 10px 14px; border-radius: 10px;
      }
      .sp-msg-success {
        background: #f0fdf4; border: 1px solid #bbf7d0;
        color: #15803d; font-size: 13px; font-weight: 500;
        padding: 10px 14px; border-radius: 10px;
      }

      /* Fields */
      .sp-field { display: flex; flex-direction: column; gap: 6px; }
      .sp-label  { font-size: 12px; font-weight: 700; color: #475569; }
      .sp-input {
        border: 1px solid #e2e8f0; border-radius: 10px;
        padding: 11px 14px; font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1e293b; background: #f8fafc;
        outline: none; transition: border-color .15s, background .15s;
        width: 100%;
      }
      .sp-input:focus { border-color: #3b82f6; background: #fff; }
      .sp-input::placeholder { color: #cbd5e1; }

      /* Rules box */
      .sp-rules {
        background: #eff6ff; border: 1px solid #bfdbfe;
        border-radius: 10px; padding: 14px 16px;
      }
      .sp-rules-title {
        font-size: 12px; font-weight: 700;
        color: #1d4ed8; margin-bottom: 8px;
      }
      .sp-rules-list {
        display: flex; flex-direction: column; gap: 5px;
        padding-left: 0; margin: 0; list-style: none;
      }
      .sp-rules-list li {
        font-size: 12px; color: #3b82f6; font-weight: 500;
        display: flex; align-items: flex-start; gap: 6px;
      }
      .sp-rules-list li::before {
        content: '·'; font-size: 18px; line-height: 1; flex-shrink: 0; margin-top: -1px;
      }

      /* Button */
      .sp-btn {
        width: 100%; padding: 12px;
        background: #1d4ed8; color: #fff;
        border: none; border-radius: 10px;
        font-size: 14px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer; transition: background .15s;
      }
      .sp-btn:hover { background: #1e40af; }

      @media (max-width: 640px) { .sp-wrap { padding: 24px 16px; } }
    `}</style>

    <div className="sp-wrap">

      <div className="sp-header">
        <h1 className="sp-title">Ayarlar</h1>
        <p className="sp-subtitle">Şifrenizi güncelleyin</p>
      </div>

      <div className="sp-card">

        {message.text && (
          <div className={message.type === 'error' ? 'sp-msg-error' : 'sp-msg-success'}>
            {message.text}
          </div>
        )}

        <div className="sp-field">
          <label className="sp-label">Eski Şifre</label>
          <input
            className="sp-input" type="password" placeholder="••••••••"
            value={formData.old_password}
            onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
          />
        </div>

        <div className="sp-field">
          <label className="sp-label">Yeni Şifre</label>
          <input
            className="sp-input" type="password" placeholder="••••••••"
            value={formData.new_password}
            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
          />
        </div>

        <div className="sp-field">
          <label className="sp-label">Yeni Şifre Tekrar</label>
          <input
            className="sp-input" type="password" placeholder="••••••••"
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
          />
        </div>

        <div className="sp-rules">
          <p className="sp-rules-title">Güvenli Şifre Kuralları</p>
          <ul className="sp-rules-list">
            <li>En az 8 karakter uzunluğunda olmalı.</li>
            <li>Kişisel bilgilerinizle benzer olmamalı.</li>
            <li>Çok yaygın kullanılan şifrelerden biri olmamalı.</li>
            <li>Tamamen rakamlardan oluşmamalı.</li>
          </ul>
        </div>

        <button className="sp-btn" onClick={handleSubmit}>
          Güncelle
        </button>

      </div>
    </div>
  </>
);
};

export default Settings;