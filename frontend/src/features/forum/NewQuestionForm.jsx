import React, { useState } from "react";
import axios from "axios";

const NewQuestionForm = ({ id, onAdded }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("access");

    await axios.post("http://localhost:8000/api/courses/questions/",
      {
        question_title: title,
        question_text: body,
        course: Number(id)

      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    setTitle("");
    setBody("");
    onAdded();
  } catch (err) {
    console.error("Soru gönderilirken hata oluştu:", err.response?.data);
    alert("Soru gönderilemedi. Lütfen giriş yaptığınızdan emin olun.");
    console.log("Course id:", id);
    console.log("Title:", title);
    console.log("Body:", body);
  }
};

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .nqf-wrap * { box-sizing: border-box; }
      .nqf-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-top: 12px;
      }

      .nqf-heading {
        font-size: 16px;
        font-weight: 800;
        color: #0f172a;
      }

      .nqf-field { display: flex; flex-direction: column; gap: 6px; }
      .nqf-label { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: .5px; text-transform: uppercase; }

      .nqf-input,
      .nqf-textarea {
        width: 100%;
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
      .nqf-input:focus,
      .nqf-textarea:focus { border-color: #3b82f6; background: #fff; }
      .nqf-input::placeholder,
      .nqf-textarea::placeholder { color: #cbd5e1; }
      .nqf-textarea { resize: vertical; min-height: 110px; }

      .nqf-footer { display: flex; justify-content: flex-end; margin-top: 2px; }

      .nqf-btn {
        display: inline-flex; align-items: center; gap: 6px;
        background: #1d4ed8; color: #fff;
        border: none; border-radius: 10px;
        padding: 10px 22px;
        font-size: 13px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer;
        transition: background .15s;
      }
      .nqf-btn:hover { background: #1e40af; }
      .nqf-btn svg { width: 15px; height: 15px; }
    `}</style>

    <div className="nqf-wrap">
      <p className="nqf-heading">Soru Sor</p>

      <div className="nqf-field">
        <label className="nqf-label">Başlık</label>
        <input
          className="nqf-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sorunun başlığını yaz..."
        />
      </div>

      <div className="nqf-field">
        <label className="nqf-label">Soru</label>
        <textarea
          className="nqf-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Soruyu detaylı anlat..."
        />
      </div>

      <div className="nqf-footer">
        <button className="nqf-btn" onClick={handleSubmit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
          </svg>
          Soruyu Gönder
        </button>
      </div>
    </div>
  </>
);
};

export default NewQuestionForm;