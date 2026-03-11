import React, { useState } from "react";
import axios from "axios";

const NewAnswerForm = ({ questionId, onAdded }) => {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!body.trim()) {
      alert("Cevap boş olamaz.");
      return;
    }

    const token = localStorage.getItem("access");

    try {
      setLoading(true);

      await axios.post(
          "http://localhost:8000/api/courses/answers/",
          {
            answer_text: body,
            question: Number(questionId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      setBody("");

      if (onAdded) {
        onAdded();
      }

    } catch (err) {
      console.error("Cevap gönderilirken hata:", err.response?.data || err);
      alert("Cevap gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };


  return (
      <>
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .naf-wrap * { box-sizing: border-box; }
      .naf-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;
      }

      .naf-label {
        font-size: 13px;
        font-weight: 700;
        color: #475569;
      }

      .naf-textarea {
        width: 100%;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 14px;
        font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #1e293b;
        background: #f8fafc;
        resize: vertical;
        outline: none;
        transition: border-color .15s, background .15s;
        min-height: 90px;
      }
      .naf-textarea:focus { border-color: #3b82f6; background: #fff; }
      .naf-textarea::placeholder { color: #cbd5e1; }

      .naf-footer { display: flex; justify-content: flex-end; }

      .naf-btn {
        display: inline-flex; align-items: center; gap: 6px;
        background: #1d4ed8; color: #fff;
        border: none; border-radius: 10px;
        padding: 10px 22px;
        font-size: 13px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        cursor: pointer;
        transition: background .15s;
      }
      .naf-btn:hover:not(:disabled) { background: #1e40af; }
      .naf-btn:disabled { background: #cbd5e1; color: #94a3b8; cursor: not-allowed; }
      .naf-btn svg { width: 15px; height: 15px; }
    `}</style>

        <div className="naf-wrap">
          <span className="naf-label">Cevabını Yaz</span>

          <textarea
              className="naf-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Cevabını buraya yaz..."
              rows={3}
          />

          <div className="naf-footer">
            <button type="button" className="naf-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                         style={{animation: 'spin .8s linear infinite'}}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                    </svg>
                    Gönderiliyor...
                  </>
              ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
                    Cevap Gönder
                  </>
              )}
            </button>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
  );
}
export default NewAnswerForm;