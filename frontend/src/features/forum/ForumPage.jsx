import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuestionList from "./QuestionList";
import NewQuestionForm from "./NewQuestionForm";

const ForumPage = () => {
  const {id} = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/courses/questions/?course_id=${id}`, {
        headers: {Authorization: `Bearer ${localStorage.getItem("access")}`}
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

  // Mevcut import, hook, state ve handler'larını bu dosyanın üstüne ekle.

  if (loading) return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#f1f5f9',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6',
          animation: 'spin .8s linear infinite',
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
  );

  return (
      <>
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .fp-wrap * { box-sizing: border-box; }
      .fp-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #f1f5f9;
        min-height: 100vh;
        padding: 36px 48px;
        color: #1e293b;
      }

      .fp-header { margin-bottom: 24px; }
      .fp-title    { font-size: 26px; font-weight: 800; color: #0f172a; }
      .fp-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

      .fp-divider {
        height: 1px;
        background: #e2e8f0;
        margin: 24px 0;
      }

      @media (max-width: 640px) { .fp-wrap { padding: 24px 16px; } }
    `}</style>

        <div className="fp-wrap">

          <div className="fp-header">
            <h1 className="fp-title">Ders Forumu</h1>
            <p className="fp-subtitle">Soru sor, cevapla, tartış</p>
          </div>

          <NewQuestionForm id={id} onAdded={fetchQuestions}/>

          <div className="fp-divider"/>

          <QuestionList questions={questions} refresh={fetchQuestions}/>

        </div>
      </>
  );
}

export default ForumPage;