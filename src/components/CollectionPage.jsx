import React, { useEffect, useState } from "react";
import axios from "axios";

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    axios.get(`http://localhost:8000/collection/${userId}`)
      .then(res => {
        setCollections(res.data);
      })
      .catch(err => {
        console.error("도감 불러오기 실패", err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌸 나의 꽃 도감</h2>
      {collections.length === 0 ? (
        <p>저장된 꽃이 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {collections.map((item, idx) => (
            <div key={idx} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fff"
            }}>
              <img
                src={item.image}
                alt={item.flower?.flowername_kr || "꽃"}
                style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px" }}
              />
              <h3>{item.flower?.flowername_kr || "이름 없음"}</h3>
              <p><strong>날짜:</strong> {new Date(item.date).toLocaleDateString()}</p>
              <p><strong>메모:</strong> {item.memo || "없음"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
