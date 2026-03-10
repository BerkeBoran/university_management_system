import React, { useState } from "react";
import axios from "axios";

const NewAnswerForm = ({ questionId, onAdded }) => {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!body.trim()) {
      alert("Cevap boş olamaz.");
      return;
    }

    const token = localStorage.getItem("access");

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8000/api/courses/answers/",
        {
          answer_text: body,
          question: Number(questionId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBody("");

      if (onAdded) {
        onAdded();
      }

    } catch (err) {
      console.error("Cevap gönderilirken hata:", err.response?.data || err);
      alert("Cevap gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Answer..."
        rows="3"
        style={{ width: "100%" }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Add Answer"}
      </button>
    </form>
  );
};

export default NewAnswerForm;