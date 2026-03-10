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

  return (
      <div className="p-2 border-bottom d-flex justify-content-between">
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