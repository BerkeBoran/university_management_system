import React from "react";
import AnswerItem from "./AnswerItem";

const AnswerList = ({ answers, refresh, questionAuthorId }) => {
    const answerArray = Array.isArray(answers) ? answers : [];
    if (answerArray.length === 0) {
        return <div className="text-muted p-4">Bu ders için henüz cevap yapılmamış.</div>;
    }
 // Mevcut import, hook, state ve handler'larını bu dosyanın üstüne ekle.

return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .al-wrap * { box-sizing: border-box; }
      .al-wrap {
        font-family: 'Plus Jakarta Sans', sans-serif;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .al-section-head {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 2px;
      }
      .al-section-title { font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: .5px; text-transform: uppercase; }
      .al-section-line  { flex: 1; height: 1px; background: #e2e8f0; }
      .al-section-count { font-size: 11px; color: #cbd5e1; font-weight: 600; }

      .al-empty {
        font-size: 13px;
        color: #cbd5e1;
        font-weight: 500;
        padding: 12px 0;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
    `}</style>

    <div className="al-wrap">

      <div className="al-section-head">
        <div className="al-section-line" />
        <span className="al-section-count">{answerArray.length}</span>
      </div>

      {answerArray.length > 0 ? (
        answerArray.map((a) => (
          <AnswerItem key={a.id} answer={a} refresh={refresh} questionAuthorId={questionAuthorId} />
        ))
      ) : (
        <p className="al-empty">Henüz cevap yok.</p>
      )}

    </div>
  </>
);
};

export default AnswerList;