import React from "react";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questions, refresh }) => {
  const questionArray = Array.isArray(questions) ? questions : [];
  if (questionArray.length === 0) {
    return <div className="text-muted p-4">Bu ders için henüz soru sorulmamış.</div>;
  }
 // Mevcut import, hook, state ve handler'larını bu dosyanın üstüne ekle.

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .ql-wrap * { box-sizing: border-box; }
      .ql-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .ql-section-head {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 4px;
      }
      .ql-section-title { font-size: 14px; font-weight: 700; color: #475569; }
      .ql-section-line  { flex: 1; height: 1px; background: #e2e8f0; }
      .ql-section-count { font-size: 12px; color: #94a3b8; font-weight: 600; }

      .ql-empty {
        background: #fff;
        border: 2px dashed #e2e8f0;
        border-radius: 14px;
        padding: 48px;
        text-align: center;
        color: #94a3b8;
        font-size: 14px;
        font-weight: 500;
      }
    `}</style>

    <div className="ql-wrap">

      <div className="ql-section-head">
        <span className="ql-section-title">Sorular</span>
        <div className="ql-section-line" />
        <span className="ql-section-count">{questions.length} soru</span>
      </div>

      {questions.length > 0 ? (
        questions.map((q) => (
          <QuestionItem key={q.id} question={q} refresh={refresh} />
        ))
      ) : (
        <div className="ql-empty">Henüz soru sorulmamış. İlk soruyu sen sor!</div>
      )}

    </div>
  </>
);
};

export default QuestionList;