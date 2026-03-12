import React, {useState} from "react";
import axios from "axios";

const AnswerItem = ({ answer, questionAuthorId,refresh }) => {
    const currentUserId = localStorage.getItem("user_id")
    const userRole = localStorage.getItem("user_role")
    const [upvotesCount, setUpvotesCount] = useState(answer.upvotes_count || 0);
    const canDelete = userRole === 'instructor' || answer.author == currentUserId || questionAuthorId == currentUserId;


    const handleDelete = async () => {
        if (!window.confirm("Bu cevabı silmek istediğinize emin misiniz?")) return;

        try{
            const token = localStorage.getItem("access")
            await axios.delete(`http://localhost:8000/api/courses/answers/${answer.id}/`,{
                headers: { Authorization: `Bearer ${token}`}
            });
            refresh();
        }catch (err){
            alert("Silme yetkiniz yok veya bir hata oluştu.");
        }
    }
    const canAccept =
    String(questionAuthorId) === String(currentUserId) ||
    userRole?.toLowerCase() === 'instructor';

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("access");
      await axios.post(`http://localhost:8000/api/courses/answers/${answer.id}/accept/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refresh();
    } catch (err) {
      alert("Cevap kabul edilirken bir hata oluştu.");
    }
  };

  const handleUpvote = async () =>{
      try{
          const token = localStorage.getItem("access")
          const response = await axios.post(`http://localhost:8000/api/courses/answers/${answer.id}/upvote/`, {},{
              headers: {Authorization: `Bearer ${token}`}
          });
          setUpvotesCount(response.data.upvotes_count);
      }catch (err){
          console.error("Hata detayı:", err.response?.data);
          alert("Cevap beğenilirken bir hata oluştu.");
      }
  }


return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .ans-wrap * { box-sizing: border-box; }
      .ans-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 18px 20px;
        display: flex;
        gap: 16px;
        align-items: flex-start;
        transition: border-color .15s, box-shadow .15s;
      }
      .ans-wrap:hover { border-color: #bfdbfe; box-shadow: 0 2px 12px #3b82f610; }

      /* Vote column */
      .ans-vote {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
      }
      .ans-vote-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 8px;
        color: #94a3b8;
        transition: background .12s, color .12s;
        display: flex; align-items: center; justify-content: center;
      }
      .ans-vote-btn:hover { background: #eff6ff; color: #3b82f6; }
      .ans-vote-btn.active { color: #1d4ed8; }
      .ans-vote-btn svg { width: 20px; height: 20px; }
      .ans-vote-count { font-size: 13px; font-weight: 800; color: #334155; }

      /* Main content */
      .ans-body { flex: 1; min-width: 0; }

      .ans-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
      .ans-accepted-badge {
        display: inline-flex; align-items: center; gap: 5px;
        background: #f0fdf4; color: #15803d;
        border: 1px solid #bbf7d0;
        font-size: 11px; font-weight: 700;
        padding: 3px 10px; border-radius: 999px;
      }
      .ans-accepted-badge svg { width: 12px; height: 12px; }

      .ans-accept-btn {
        display: inline-flex; align-items: center; gap: 5px;
        background: none;
        border: 1px solid #bbf7d0;
        color: #15803d;
        font-size: 11px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 3px 10px; border-radius: 999px;
        cursor: pointer;
        transition: background .12s;
      }
      .ans-accept-btn:hover { background: #f0fdf4; }
      .ans-accept-btn svg { width: 12px; height: 12px; }

      .ans-text {
        font-size: 14px; color: #334155;
        line-height: 1.65; margin-bottom: 10px;
      }

      .ans-footer {
        display: flex; align-items: center;
        justify-content: space-between; gap: 8px; flex-wrap: wrap;
      }
      .ans-author { font-size: 12px; color: #94a3b8; font-weight: 500; }
      .ans-author strong { color: #64748b; font-weight: 700; }

      .ans-delete-btn {
        display: inline-flex; align-items: center; gap: 4px;
        background: none; border: 1px solid #fecaca;
        color: #dc2626; font-size: 11px; font-weight: 700;
        font-family: 'Plus Jakarta Sans', sans-serif;
        padding: 3px 10px; border-radius: 999px;
        cursor: pointer; transition: background .12s;
      }
      .ans-delete-btn:hover { background: #fef2f2; }
      .ans-delete-btn svg { width: 12px; height: 12px; }
    `}</style>

    <div className="ans-wrap">

      {/* Vote */}
      <div className="ans-vote">
        <button
          className={`ans-vote-btn${upvotesCount > 0 ? ' active' : ''}`}
          onClick={handleUpvote}
          title="Beğen"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l8 8H4z"/>
          </svg>
        </button>
        <span className="ans-vote-count">{upvotesCount}</span>
      </div>

      {/* Body */}
      <div className="ans-body">

        {/* Badges */}
        {(answer.is_accepted || canAccept) && (
          <div className="ans-badges">
            {answer.is_accepted && (
              <span className="ans-accepted-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Çözüm Olarak İşaretlendi
              </span>
            )}
            {canAccept && !answer.is_accepted && (
              <button className="ans-accept-btn" onClick={handleAccept}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Kabul Et
              </button>
            )}
          </div>
        )}

        {/* Answer text */}
        <p className="ans-text">{answer.answer_text}</p>

        {/* Footer */}
        <div className="ans-footer">
          <span className="ans-author">
            Yazar: <strong>{answer.author_title} {answer.author_name}</strong>
          </span>

          {canDelete && (
            <button className="ans-delete-btn" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Sil
            </button>
          )}
        </div>

      </div>
    </div>
  </>
);
};

export default AnswerItem;