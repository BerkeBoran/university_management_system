import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuestionList from "./QuestionList";
import NewQuestionForm from "./NewQuestionForm";

const ForumPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/courses/questions/?course_id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Sorular yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  if (loading) return <div>Forum yükleniyor...</div>;

  return (
    <div className="container mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <h2 className="mb-4">Ders Forumu</h2>
      <NewQuestionForm id={id} onAdded={fetchQuestions} />
      <hr />
      <QuestionList questions={questions} refresh={fetchQuestions} />
    </div>
  );
};

export default ForumPage;