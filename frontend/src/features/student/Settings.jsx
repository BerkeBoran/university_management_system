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
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Şifre Değiştir</h2>
      {message.text && (
        <div className={`p-2 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Eski Şifre"
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, old_password: e.target.value})}
          value={formData.old_password}
        />
        <input
          type="password"
          placeholder="Yeni Şifre"
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, new_password: e.target.value})}
          value={formData.new_password}
        />
        <input
          type="password"
          placeholder="Yeni Şifre Tekrar"
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
          value={formData.confirm_password}
        />
          <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Güvenli Şifre Kuralları:</h4>
              <ul className="text-xs text-blue-700 list-disc ml-4 space-y-1">
                <li>En az 8 karakter uzunluğunda olmalı.</li>
                <li>Kişisel bilgilerinizle benzer olmamalı.</li>
                <li>Çok yaygın kullanılan şifrelerden biri olmamalı.</li>
                <li>Tamamen rakamlardan oluşmamalı.</li>
              </ul>
            </div>
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Güncelle
        </button>
      </form>
    </div>
  );
};

export default Settings;