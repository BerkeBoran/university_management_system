import React from "react";
import axios from "axios";

const AnswerItem = ({ answer, questionAuthorId,refresh }) => {
    const currentUserId = localStorage.getItem("user_id")
    const userRole = localStorage.getItem("user_role")

    console.log("Kullanıcı Rolü:", userRole, "Soru Sahibi ID:", questionAuthorId, "Cevap Sahibi ID:", answer.author);

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

  return (
      <div className="p-2 border-bottom d-flex justify-content-between">
          <div>
        {answer.is_accepted && (
          <span className="badge bg-success mb-2">
            <i className="bi bi-patch-check-fill me-1"></i> Çözüm Olarak İşaretlendi
          </span>
        )}
        {canAccept && !answer.is_accepted && (
          <button onClick={handleAccept} className="btn btn-sm btn-outline-success">
            <i className="bi bi-check2-circle"></i> Kabul Et
          </button>
        )}
        <p className="mb-1">{answer.answer_text}</p>
        <small className="text-muted">Yazar: {answer.author_name}</small>
      </div>
    <div style={{ borderTop: "1px solid #eee", padding: "5px" }}>
      <p>{answer.answer_text}</p>
      <small>By: {answer.author_name}</small>
    </div>

      {canDelete && (
        <button onClick={handleDelete} className="btn btn-sm text-danger">
          <i className="bi bi-x-circle"></i> Delete
        </button>
      )}
      </div>

  );
};

export default AnswerItem;