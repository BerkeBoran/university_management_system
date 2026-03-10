import React from "react";
import AnswerItem from "./AnswerItem";

const AnswerList = ({ answers, refresh, questionAuthorId }) => {
    const answerArray = Array.isArray(answers) ? answers : [];
    if (answerArray.length === 0) {
        return <div className="text-muted p-4">Bu ders için henüz cevap yapılmamış.</div>;
    }
  return (
    <div style={{ marginLeft: "20px" }}>
      {answerArray.map((a) => (
        <AnswerItem key={a.id} answer={a} refresh={refresh} questionAuthorId={questionAuthorId} />
      ))}
    </div>
  );
};

export default AnswerList;