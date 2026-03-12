import React, { useEffect, useState } from "react";
import axios from "axios";
import AnswerList from "./AnswerList";
import NewAnswerForm from "./NewAnswerForm";

const QuestionItem = ({ question, refresh }) => {
  const [answers, setAnswers] = useState([]);
  const currentUserId = localStorage.getItem("user_id")
  const userRole = localStorage.getItem("user_role")
  const canDelete = userRole === 'instructor' || question.author == currentUserId;

 const fetchAnswers = async () => {
  const token = localStorage.getItem("access");

      try {
        const res = await axios.get(
          `http://localhost:8000/api/courses/answers/?question_id=${question.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnswers(res.data);
      } catch (err) {
        console.error("Answers yüklenirken hata:", err.response?.data || err);
      }
    };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const handleDelete = async () => {
      if (!window.confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;

      try {
        const token = localStorage.getItem("access");

        await axios.delete(`http://localhost:8000/api/courses/questions/${question.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert("Soru başarıyla silindi.");
        refresh();
      } catch (err) {
        console.error("Soru silinirken hata:", err.response?.data);
        alert("Soru silinemedi: " + (err.response?.data?.detail || "Yetkiniz olmayabilir."));
      }
    };


return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .qi-wrap * { box-sizing: border-box; }
      .qi-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 24px;
        margin-bottom: 16px;
        transition: border-color .15s, box-shadow .15s;
      }
      .qi-wrap:hover { border-color: #bfdbfe; box-shadow: 0 2px 16px #3b82f612; }

      /* Header row */
      .qi-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .qi-title { font-size: 16px; font-weight: 800; color: #0f172a; line-height: 1.3; }
      .qi-text  { font-size: 14px; color: #475569; line-height: 1.65; margin-bottom: 14px; }

      /* Meta row */
      .qi-meta {
        display: flex; align-items: center;
        justify-content: space-between;
        flex-wrap: wrap; gap: 10px;
        padding-top: 14px;
        border-top: 1px solid #f1f5f9;
        margin-bottom: 20px;
      }
      .qi-author { font-size: 12px; color: #94a3b8; font-weight: 500; }
      .qi-author strong { color: #64748b; font-weight: 700; }

      .qi-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

      /* Status badges */
      .qi-badge-resolved {
        display: inline-flex; align-items: center; gap: 5px;
        background: #f0fdf4; color: #15803d;
        border: 1px solid #bbf7d0;
        font-size: 11px; font-weight: 700;
        padding: 3px 10px; border-radius: 999px;
      }
      .qi-badge-pending {
        display: inline-flex; align-items: center; gap: 5px;
        background: #fffbeb; color: #b45309;
        border: 1px solid #fde68a;
        font-size: 11px; font-weight: 700;
        padding: 3px 10px; border-radius: 999px;
      }
      .qi-badge-resolved svg,
      .qi-badge-pending svg { width: 11px; height: 11px; }

      /* Delete button */
      .qi-delete-btn {
        display: inline-flex; align-items: center; gap: 4px;
        background: none; border: 1px solid #fecaca;
        color: #dc2626; font-size: 11px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 3px 10px; border-radius: 999px;
        cursor: pointer; transition: background .12s;
      }
      .qi-delete-btn:hover { background: #fef2f2; }
      .qi-delete-btn svg { width: 12px; height: 12px; }

      /* Answers section */
      .qi-answers-section {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .qi-answers-label {
        font-size: 11px; font-weight: 700;
        color: #94a3b8; letter-spacing: .5px;
        text-transform: uppercase; margin-bottom: 4px;
      }
    `}</style>

    <div className="qi-wrap">

      {/* Title + text */}
      <div className="qi-header">
        <h4 className="qi-title">{question.question_title}</h4>
      </div>
      <p className="qi-text">{question.question_text}</p>

      {/* Meta */}
      <div className="qi-meta">
        <span className="qi-author">Soran: <strong>{question.author_name}</strong></span>

        <div className="qi-actions">
          {question.is_resolved ? (
            <span className="qi-badge-resolved">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Çözüldü
            </span>
          ) : (
            <span className="qi-badge-pending">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/>
              </svg>
              Çözüm Bekleniyor
            </span>
          )}

          {canDelete && (
            <button className="qi-delete-btn" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Sil
            </button>
          )}
        </div>
      </div>

      {/* Answers */}
      <div className="qi-answers-section">
        <p className="qi-answers-label">Cevaplar</p>
        <AnswerList answers={answers} refresh={fetchAnswers} questionAuthorId={question.author} />
        <NewAnswerForm questionId={question.id} onAdded={fetchAnswers} />
      </div>

    </div>
  </>
);
};

export default QuestionItem;