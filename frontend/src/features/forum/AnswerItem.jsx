import React from "react";

const AnswerItem = ({ answer }) => {
  return (
    <div style={{ borderTop: "1px solid #eee", padding: "5px" }}>
      <p>{answer.answer_text}</p>
      <small>By: {answer.author_name}</small>
    </div>
  );
};

export default AnswerItem;