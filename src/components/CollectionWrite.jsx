import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CollectionWritePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flower, imageUrl } = location.state || {};
  const [memo, setMemo] = useState("");

  const handleSave = async () => {
    const userId = localStorage.getItem("userId") || "guest";

    try {
      await axios.post("http://localhost:8000/collection", {
        userId,
        flower,
        memo,
        imageUrl,
        date: new Date().toISOString(),
      });
      alert("🌼 도감에 저장되었습니다!");
      navigate("/collection");
    } catch (error) {
      console.error("도감 저장 실패:", error);
      alert("❌ 저장 중 오류가 발생했습니다");
    }
  };

  if (!flower) {
    return <div>잘못된 접근입니다. 꽃 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", backgroundColor: "white", borderRadius: "8px" }}>
      <h2 style={{ color: "#2e7d32" }}>{flower.flowername_kr} 도감 작성</h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="선택된 꽃"
          style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginBottom: "1rem" }}
        />
      )}

      <p><strong>영문명:</strong> {flower.flowername}</p>
      <p><strong>학명:</strong> {flower.binomialName}</p>
      <p><strong>서식지:</strong> {flower.habitat}</p>

      <label style={{ display: "block", marginTop: "1rem" }}>메모:</label>
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        style={{ width: "100%", minHeight: "100px", marginTop: "0.5rem" }}
        placeholder="관찰한 내용을 기록하세요."
      />

      <button
        onClick={handleSave}
        style={{ marginTop: "1rem", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        저장하기
      </button>
    </div>
  );
};

export default CollectionWritePage;
