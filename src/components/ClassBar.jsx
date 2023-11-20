import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import SearchResult from "./SearchResult"; // SearchResult 컴포넌트 경로에 맞게 수정해야합니다.
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// 추론된 꽃(클래스)에 대한 percentage bar를 생성
const ClassBar = (props) => {
  const { label, bgcolor, completed } = props;

  const [currentLabel, setCurrentLabel] = useState(label);
  const [currentBgColor, setCurrentBgColor] = useState(bgcolor);
  const [currentCompleted, setCurrentCompleted] = useState(completed);
  const [open, setOpen] = useState(false); // Dialog 열림/닫힘 상태 관리
  // const navigate = useNavigate();
  
  useEffect(() => {
    setCurrentLabel(label);
    setCurrentBgColor(bgcolor);
    setCurrentCompleted(completed);
  }, [label, bgcolor, completed]);

  const containerStyles = {
    marginBottom: "10px",
    width: '100%',
    display: 'flex', // Flexbox 레이아웃 사용
    alignItems: 'center', // 아이템을 수직 가운데로 정렬
  };

  const progressBarStyles = {
    flex: 1, // ProgressBar가 남은 공간을 모두 차지하도록 설정
    height: 20,
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: '0 10px', // 좌우 여백 추가
  };

  const fillerStyles = {
    height: '100%',
    width: `${currentCompleted}%`,
    backgroundColor: currentBgColor,
    transition: 'width 1s ease-in-out',
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const percentStyle = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  const labelStyles = {
    padding: 5,
    color: 'blue',
    fontWeight: 'bold',
    fontSize: '15px', // 글씨 크기 설정
    fontFamily: "Malgun Gothic",
    width: '120px',
    cursor: 'pointer',
    display: 'inline'
  }

  const handleButtonClick = () => {
    setOpen(true); // Dialog 열기
  };

  const handleClose = () => {
    setOpen(false); // Dialog 닫기
  };


  return (
    <div style={containerStyles}>
      <p style={labelStyles} onClick={() => handleButtonClick(currentLabel)}>
        {currentLabel}
      </p>
      <div style={progressBarStyles}>
        <div style={fillerStyles}>
          <span style={percentStyle}>{`${currentCompleted}%`}</span>
        </div>
      </div>

      {/* SearchResult 컴포넌트를 Dialog로 띄우기 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
      >
        <DialogContent>
          <SearchResult key={currentLabel} label={currentLabel} />
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            color="success" 
            autoFocus onClick={handleClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClassBar;
