// CollectionWritePage.jsx (예시)
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CollectionWritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flower, imageUrl } = location.state || {};

  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(""); // 날짜 저장
  const [imageBase64, setImageBase64] = useState("");

  // 날짜 설정
  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().split("T")[0]; // YYYY-MM-DD
    setDate(formatted);
  }, []);

  // 이미지 base64 변환
  useEffect(() => {
    if (!imageUrl) return;

    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result); // base64 문자열 저장
        reader.readAsDataURL(blob);
      });
  }, [imageUrl]);

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8000/collection", {
        userId: localStorage.getItem("userId") || "guest",
        flower,
        memo,
        date,
        imageBase64,
      });
      alert("도감에 저장되었습니다!");
      navigate("/");
    } catch (err) {
      alert("저장 실패!");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>도감 작성</h2>
      <p><strong>이름:</strong> {flower?.flowername_kr}</p>
      <p><strong>날짜:</strong> {date}</p>
      {imageUrl && <img src={imageUrl} alt="사용자 사진" width="200" />}
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모를 남겨보세요"
        style={{ display: "block", width: "100%", minHeight: "80px", marginTop: "1rem" }}
      />
      <button onClick={handleSave} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        저장하기
      </button>
    </div>
  );
};

export default CollectionWritePage;
