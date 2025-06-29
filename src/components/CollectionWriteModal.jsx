import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

const CollectionWriteModal = ({ flower, imageUrl, onClose, onSave }) => {
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!imageUrl) return;
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => setImageBase64(reader.result);
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
      onSave();
    } catch (err) {
      alert("저장 실패!");
      console.error(err);
    }
  };

  return (
    <div className="modal-background" style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      <div style={{
          position: "relative",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>도감 작성</h2>
          <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999"
              }}
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
        </div>
        <p><strong>이름:</strong> {flower?.flowername_kr}</p>
        <p><strong>날짜:</strong> {date}</p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="사용자 사진"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "6px",
              objectFit: "cover"
            }}
          />
        )}
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 남겨보세요"
          style={{
            width: "100%",
            minHeight: "80px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            padding: "8px"
          }}
        />
        <button
          onClick={handleSave}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default CollectionWriteModal;
