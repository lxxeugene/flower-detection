import React, { useState, useEffect } from "react";
import axios from "axios";
import naver from "../images/btnG_아이콘사각.png";
import { useNavigate } from "react-router-dom";

/* 꽃 정보 제공 컴포넌트
 * 데이터베이스에서 꽃 정보를 가져오고 출력하는 컴포넌트
 */
const SearchResult = (props) => {
  // props로부터 key 값을 받아옵니다.
  const { label, imageRef } = props;
  const [flowerInfo, setFlowerInfo] = useState(null);
  const [flowerImages, setFlowerImages] = useState([]);
  const navigate = useNavigate();

  const goShoppingPage = () => {
    navigate(`/naverShopping/${flowerInfo.flowername_kr}`);
  };

const goToWritePage = () => {
    navigate("/collection/new", {
      state: {
        flower: flowerInfo,
        imageUrl: imageRef?.current?.src || "",
      },
    });
  };

  useEffect(() => {
    const fetchFlowerInfo = async () => {
      try {
        // 서버에 key 값을 포함하여 요청합니다.
        const response = await axios.get(
          `http://localhost:8000/flowers?flowername=${label}`
        );
        const flower = response.data;
        setFlowerInfo(flower);
        //히스토리 추가
        const prev = JSON.parse(localStorage.getItem("flowerHistory")) || [];
        const updated = [flower, ...prev.filter(f => f.flowername !== flower.flowername)];
        localStorage.setItem("flowerHistory", JSON.stringify(updated.slice(0, 10)));

        const imageRes = await axios.get(`http://localhost:8000/naver-images?flowername=${flower.flowername_kr}`);
        setFlowerImages(imageRes.data.images);
      } catch (error) {
        console.error("Error searching for flower:", error);
        setFlowerInfo(null);
      }
    };
    fetchFlowerInfo();
  }, [label]);

const [memo, setMemo] = useState("");


  // key 값을 이용하여 원하는 작업을 수행하거나, 컴포넌트에서 출력합니다.
  return (
    <div>
      {flowerInfo && (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              color: "darkgreen",
              fontSize: "20px",
              alignSelf: "flex-start",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                borderBottom: `3px solid darkgreen`,
                paddingBottom: "2px",
              }}
            >
              {flowerInfo.flowername_kr}
            </span>
          </h2>
          {flowerImages.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
              {flowerImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`꽃 이미지 ${idx + 1}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px" }}
                />
              ))}
            </div>
          )}
          <table style={{ borderSpacing: "10px", wordBreak: "keep-all" }}>
            <tbody>
              <tr>
                <td style={{ color: "black", width: "15%" }}>
                  <strong>이름</strong>
                </td>
                <td style={{ color: "black", width: "85%" }}>
                  {flowerInfo.flowername}
                </td>
              </tr>
              <tr>
                <td style={{ color: "black", width: "15%" }}>
                  <strong>서식지</strong>
                </td>
                <td style={{ color: "black", width: "85%" }}>
                  {flowerInfo.habitat}
                </td>
              </tr>
              <tr>
                <td style={{ color: "black", width: "15%" }}>
                  <strong>학명</strong>
                </td>
                <td style={{ color: "black", width: "85%" }}>
                  {flowerInfo.binomialName}
                </td>
              </tr>
              <tr>
                <td style={{ color: "black", width: "15%" }}>
                  <strong>분류</strong>
                </td>
                <td style={{ color: "black", width: "85%" }}>
                  {flowerInfo.classification}
                </td>
              </tr>
              <tr>
                <td style={{ color: "black", width: "15%" }}>
                  <strong>판매 검색</strong>
                </td>
                <td style={{ color: "black", width: "85%" }}>
                  <button
                    onClick={goShoppingPage}
                    style={{
                      backgroundColor: "#03C75A",
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "none",
                    }}
                  >
                    <img
                      src={naver}
                      style={{ marginRight: "5px" }}
                      width="20"
                      height="20"
                      alt="네이버 로고"
                    />
                    네이버 쇼핑
                  </button>
                </td>
              </tr>
              <tr>
                  <td style={{ color: "black", width: "15%" }}>
                      <strong>도감 작성</strong>
                  </td>
                  <td colSpan={2}>
                    <div>
                      <button onClick={goToWritePage} style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}>
                        작성하기
                      </button>
                    </div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
