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
    <div className="modal-background">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}><CloseIcon /></button>
        <h2>도감 작성</h2>
        <p><strong>이름:</strong> {flower?.flowername_kr}</p>
        <p><strong>날짜:</strong> {date}</p>
        {imageUrl && <img src={imageUrl} alt="사용자 사진" width="200" />}
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 남겨보세요"
          style={{ width: "100%", minHeight: "80px", marginTop: "1rem" }}
        />
        <button onClick={handleSave} className="save-button">저장하기</button>
      </div>
    </div>
  );
};

export default CollectionWriteModal;
