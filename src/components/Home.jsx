import React from "react";
import BannerBackground from "../images/home-background-image.jpg";
import BannerImage from "../images/guide_1.gif";
// import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import About from "./About"
import "../style/Home.css"

const Home = () => {
    const navigate = useNavigate();

    const goMainPage = () => {
        navigate('/main');
        
    }
  return (
    <div className="home-container">
      <div className="home-banner-container">
      <div className="home-overlay"></div>
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="home-primary-heading">
            Flower Detection With YOLOv8
          </h1>
          <p className="home-primary-text">
            옥스포드 꽃 데이터셋을 학습시킨 YOLOv8 객체 탐지 모델을 사용해서 꽃을 탐지하고 정보를 얻어보세요.
          </p>
          <button className="secondary-button" onClick={goMainPage}>
            시작하기 <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
      <About />
    </div>
  );
};

export default Home;
