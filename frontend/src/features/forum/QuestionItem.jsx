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
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h4>Title:{question.question_title}</h4>
      <p>Text:{question.question_text}</p>
      <small>Soran: {question.author_name}</small><p></p>
        {canDelete && (
      <button onClick={handleDelete}>Delete</button>)}


      <AnswerList answers={answers} />
      <NewAnswerForm questionId={question.id} onAdded={fetchAnswers} />
    </div>
  );
};

export default QuestionItem;