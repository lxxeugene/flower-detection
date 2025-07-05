import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

  const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

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
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#2e7d32", margin: "10px 0" }}>나의 식물 도감</h2>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/main")}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          뒤로가기
        </Button>
      </div>

      {collections.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "30px" }}>저장된 꽃이 없습니다.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
          marginTop: "20px"
        }}>
          {collections.map((item, idx) => (
            <div key={idx} style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "14px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "transform 0.2s ease-in-out"
            }}>
              <img
                src={item.image}
                alt={item.flower?.flowername_kr || "꽃"}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
              <h3 style={{ margin: "10px 0 4px", color: "#388e3c" }}>
                {item.flower?.flowername_kr || "이름 없음"}
              </h3>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                <strong>📅 날짜:</strong> {new Date(item.date).toLocaleDateString()}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#777" }}>
                <strong>📝 메모:</strong> {item.memo || "없음"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
//   return (
//       <div style={{ padding: "20px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <h2>나의 식물 도감</h2>
//           <button
//             onClick={() => navigate("/main")}
//             style={{
//               backgroundColor: "#4CAF50",
//               color: "white",
//               padding: "8px 16px",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             ← 뒤로가기
//           </button>
//         </div>
//
//         {collections.length === 0 ? (
//           <p>저장된 꽃이 없습니다.</p>
//         ) : (
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px"
//           }}>
//             {collections.map((item, idx) => (
//               <div key={idx} style={{
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 padding: "10px",
//                 boxShadow: "0 0 8px rgba(0,0,0,0.1)",
//                 backgroundColor: "#fff"
//               }}>
//                 <img
//                   src={item.image}
//                   alt={item.flower?.flowername_kr || "꽃"}
//                   style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px" }}
//                 />
//                 <h3>{item.flower?.flowername_kr || "이름 없음"}</h3>
//                 <p><strong>날짜:</strong> {new Date(item.date).toLocaleDateString()}</p>
//                 <p><strong>메모:</strong> {item.memo || "없음"}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

export default CollectionPage;