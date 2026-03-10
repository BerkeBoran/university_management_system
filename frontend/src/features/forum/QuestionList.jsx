import React from "react";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questions, refresh }) => {
  const questionArray = Array.isArray(questions) ? questions : [];
  if (questionArray.length === 0) {
    return <div className="text-muted p-4">Bu ders için henüz soru sorulmamış.</div>;
  }
  return (
    <div>
      {questions.map((q) => (
        <QuestionItem key={q.id} question={q} refresh={refresh} />
      ))}
    </div>
  );
};

export default QuestionList;