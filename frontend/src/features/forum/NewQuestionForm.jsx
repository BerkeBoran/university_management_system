import React, { useState } from "react";
import axios from "axios";

const NewQuestionForm = ({ id, onAdded }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("access");

    await axios.post("http://localhost:8000/api/courses/questions/",
      {
        question_title: title,
        question_text: body,
        course: Number(id)

      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    setTitle("");
    setBody("");
    onAdded();
  } catch (err) {
    console.error("Soru gönderilirken hata oluştu:", err.response?.data);
    alert("Soru gönderilemedi. Lütfen giriş yaptığınızdan emin olun.");
    console.log("Course id:", id);
    console.log("Title:", title);
    console.log("Body:", body);
  }
};
  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Question..." />
      <button type="submit">Add Question</button>
    </form>
  );
};

export default NewQuestionForm;