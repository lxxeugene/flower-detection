import { useState, useRef, useEffect, useMemo } from "react";
import { Webcam } from "../utils/webcam";
import Button from '@mui/material/Button';
import Videocam from "@mui/icons-material/Videocam";
import VideocamOff from "@mui/icons-material/VideocamOff";
import Upload from "@mui/icons-material/Upload";

import { Stack } from "@mui/material";
import HideImage from "@mui/icons-material/HideImage";


const ButtonHandler = ({ imageRef, cameraRef, handleResetMyDict }) => {
  const [streaming, setStreaming] = useState(null); // streaming state
  const inputImageRef = useRef(null); // image input reference

  // useMemo를 사용해서 웹캠 객체를 생성
  const webcam = useMemo(() => new Webcam(), []);

  // 이미지 닫기 함수
  const closeImage = () => {
    handleResetMyDict();
    const url = imageRef.current.src; // 이미지 소스 저장
    imageRef.current.src = "#"; 
    URL.revokeObjectURL(url); // url 해제

    // 초기화
    setStreaming(null);
    inputImageRef.current.value = ""; 
    imageRef.current.style.display = "none";
  };

  // 컴포넌트가 언마운트될 때 카메라를 정리 (켜져있는 상태)
  useEffect(() => {
    // cameraRef 값을 사용하기 위한 변수 선언
    const currentCameraRef = cameraRef.current;

    return () => {
      if (streaming === "camera") {
        webcam.close(currentCameraRef);
        currentCameraRef.style.display = "none";
        setStreaming(null);
      }
    };
  }, [streaming, cameraRef, webcam]);

  // 이미지 또는 웹캠을 사용할 수 있는 버튼을 화면에 출력
  // streaming 상태에 따라 출력되는 버튼들을 변경
  return (
    <div>
      {streaming === "camera" && (
        <p style={{
          textAlign: "center", 
          marginBottom: "1rem",
          marginTop: "2rem",
          color: "#C00000",
          fontWeight: "bold",
        }}>*웹캠을 사용한 추론은 꽃을 제외한 다른 사물도 인식될 수 있습니다.</p>
      )}
      <Stack direction="row" justifyContent="center" style={{ position: "relative" }}>
        <div style={streaming === null ? { marginRight: '8px' } : {}}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                handleResetMyDict();
                const url = URL.createObjectURL(selectedFile); // Blob URL 생성
                imageRef.current.src = url; 
                imageRef.current.style.display = "block"; 
                setStreaming("image"); 
              }
            }}
            ref={inputImageRef}
          />
          {(streaming === null || streaming === "image") && (
            <Button
              variant="contained"
              color="success"
              endIcon={streaming === null ? <Upload /> : <Upload />}
              onClick={() => {
                // if not streaming
                if (streaming === null || streaming === "image") inputImageRef.current.click();
                else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`);
              }}
            >
              {streaming === "image" ? "다른 이미지" : "이미지 업로드"}
            </Button>
          )}
          {(streaming === "image") && (
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="primary"
              endIcon={<HideImage />}
              onClick={() => {
                if (streaming === "image") closeImage();
              }}
            >
              이미지 닫기
            </Button>
          )}
        </div>

        {/* Webcam Handler */}
        <div style={streaming === null ? { marginRight: '8px' } : {}}>
          {(streaming === null || streaming === "camera") && (
            <Button
              endIcon={streaming === null ? <Videocam /> : <VideocamOff />}
              variant="contained"
              color="primary"
              onClick={() => {
                // if not streaming
                if (streaming === null) {
                  handleResetMyDict();
                  // closing image streaming
                  if (streaming === "image") closeImage();
                  webcam.open(cameraRef.current); // open webcam
                  cameraRef.current.style.display = "block"; // show camera
                  setStreaming("camera"); // set streaming to camera
                }
                // closing video streaming
                else if (streaming === "camera") {
                  webcam.close(cameraRef.current);
                  cameraRef.current.style.display = "none";
                  setStreaming(null);
                }
                else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`);
              }}
            >
              {streaming === "camera" ? "웹캠 닫기" : "웹캠"}
            </Button>
          )}
        </div>
      </Stack>
      {/* 이전 검색한 꽃 리스트 (히스토리) */}
      <div style={{ marginTop: "2rem", padding: "0 1rem" }}>
        <h3 style={{ textAlign: "center", color: "#444" }}>이전 검색한 꽃</h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "1rem"
        }}>
          {(JSON.parse(localStorage.getItem("flowerHistory")) || []).map((f, i) => (
            <div key={i} style={{
              backgroundColor: "#f6f6f6",
              borderRadius: "10px",
              padding: "12px",
              width: "160px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 4px", color: "#2e7d32" }}>{f.flowername_kr}</h4>
              <p style={{ fontSize: "13px", margin: 0 }}>{f.flowername}</p>
              <p style={{ fontSize: "12px", margin: "2px 0", color: "#777" }}>{f.habitat}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ButtonHandler;