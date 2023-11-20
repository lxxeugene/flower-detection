import React, { useState } from "react";
import Guide1 from "../images/guide_2.gif";
import Guide2 from "../images/guide_3.gif";
import Guide3 from "../images/guide_4.gif";
import Guide4 from "../images/guide_5.gif";
import { Button } from "@mui/material";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import "../style/Guide.css";
import guide_movie1 from "../images/guide_movie1.mp4"
import guide_movie2 from "../images/guide_movie2.mp4"
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';



const Guide = () => {
  const [imageOpen, setImageOpen] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const imageInference = [
    {
      image: Guide1,
      title: "1. 작업 선택",
      text: "사용하고자 하는 방식으로 버튼을 눌러주세요.",
    },
    {
      image: Guide2,
      title: "2. 이미지 선택",
      text: "꽃을 탐지할 이미지를 선택해주세요. 스마트폰은 카메라 촬영으로 이미지 업로드가 가능합니다.",
    },
    {
      image: Guide3,
      title: "3. 꽃 선택",
      text: "탐지된 꽃 이름을 클릭하여 꽃에 대한 정보를 얻으세요.",
    },
  ];

  const webcamInference = [
    {
      image: Guide1,
      title: "1. 작업 선택",
      text: "사용하고자 하는 방식으로 버튼을 눌러주세요.",
    },
    {
      image: Guide4,
      title: "2. 실시간 탐지",
      text: "카메라에 비춰지는 꽃들을 탐지합니다. 꽃을 가까이서 촬영해주세요.",
    },
    {
      image: Guide3,
      title: "3. 꽃 선택",
      text: "탐지된 꽃 이름을 클릭하여 꽃에 대한 정보를 얻으세요.",
    },
  ];

  

  const imageGuideOpen = () => {
    setImageOpen(true); // Dialog 열기
  };

  const imageGuideClose = () => {
    setImageOpen(false); // Dialog 닫기
  };

  const webcamGuideOpen = () => {
    setWebcamOpen(true); // Dialog 열기
  };

  const webcamGuideClose = () => {
    setWebcamOpen(false); // Dialog 닫기
  };


  return (
    <div className="guide-section-wrapper">
      <div className="guide-section-top">
        <p className="guide-primary-subheading">모델 사용법</p>
        <h1 className="guide-primary-heading">이미지</h1>
        <p className="guide-primary-text">
          이미지 파일 또는 카메라 촬영을 사용해서 꽃을 찾아보세요.
        </p>
        <Button sx={{ fontSize: 15, marginTop: "15px" }} color="success" variant="contained" onClick={() => imageGuideOpen()} startIcon={<PlayCircleFilledIcon color="action" sx={{ fontSize: 40 }} />}>동영상으로 보기</Button>
      </div>
      {/* SearchResult 컴포넌트를 Dialog로 띄우기 */}
      <Dialog
        maxWidth="xs"
        open={imageOpen}
        onClose={imageGuideClose}
        justifyContent="center"
      >
        <DialogContent>
          <video muted autoPlay loop width="100%" height="auto" >
              <source src={guide_movie1} type="video/mp4" />
          </video>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            color="success" 
            autoFocus onClick={imageGuideClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="guide-section-bottom">
        {imageInference.map((data) => (
          <div className="guide-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
      <div className="guide-section-top">
        <p className="guide-primary-subheading">모델 사용법</p>
        <h1 className="guide-primary-heading">웹캠</h1>
        <p className="guide-primary-text">
          카메라 또는 웹캠으로 카메라를 실시간으로 찾아보세요.
        </p>
        <Button sx={{ fontSize: 15, marginTop: "15px" }} color="success" variant="contained" onClick={() => webcamGuideOpen()} startIcon={<PlayCircleFilledIcon color="action" sx={{ fontSize: 40 }} />}>동영상으로 보기</Button>
      </div>
      {/* SearchResult 컴포넌트를 Dialog로 띄우기 */}
      <Dialog
        open={webcamOpen}
        onClose={webcamGuideClose}
        maxWidth="xs"
      >
        <DialogContent>
          <video muted autoPlay loop width="100%" height="auto">
              <source src={guide_movie2} type="video/mp4" />
          </video>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            color="success" 
            autoFocus onClick={webcamGuideClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <div className="guide-section-bottom">
        {webcamInference.map((data) => (
          <div className="guide-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guide;