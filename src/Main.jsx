import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import ButtonHandler from "./components/btn-handler";
import { renderBoxes, Colors } from "./utils/renderBox";
import labels from "./utils/labels.json";
import "./style/Main.css";
import LinearWithValueLabel from "./components/LinearWithValueLabel";
import ClassBar from "./components/ClassBar";
import Work from "./components/Guide";
import Button from "@mui/material/Button";
import { Box, Slider } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';



const Main = () => {
  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape


  // references
  const imageRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const [dict, setDict] = useState({});
  const [myDict, setMyDict] = useState({});
  const [isVisible, setVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const inputForm = useRef();
  const [scoreThreshold, setScoreThreshold] = useState(0.6);

  // preprocess function
  const numClass = labels.length;
  const colors = new Colors();

  // model configs
  const modelName = "yolov8n";

  useEffect(() => {
    const loadModel = async () => {
      try {
        const currentPath = window.location.href.replace('/main', ''); // main 컴포넌트에서 json 파일 가져오기 위해 replace
        const yolov8 = await tf.loadGraphModel(
          `${currentPath}/${modelName}_web_model/model.json`,
          {
            onProgress: (fractions) => {
              setLoading({ loading: true, progress: fractions });
            },
          }
        );

        const dummyInput = tf.randomUniform(yolov8.inputs[0].shape, 0, 1, "float32");
        const warmupResults = yolov8.execute(dummyInput);
        setLoading({ loading: false, progress: 1 });

        setModel({
          net: yolov8,
          inputShape: yolov8.inputs[0].shape,
          outputShape: warmupResults.shape,
        });

        tf.dispose([warmupResults, dummyInput]);
      } catch (error) {
        console.error("모델 로드 중 오류 발생:", error);
        setLoading({ loading: false, progress: 0 });
      }
    };

    // 모델이 아직 로드되지 않았을 때 재귀로 모델을 로드
    if (!model.net) {
      tf.ready().then(loadModel);
    }
  }, [model.net]);

  useEffect(() => {
    // Update myDict based on the original dict
    for (const key in dict) {
      const value = dict[key];
      if (key in myDict) {
        if (parseFloat((value.score * 100).toFixed(1)) > myDict[key].score) {
          setMyDict((prevDict) => ({
            ...prevDict,
            [key]: {
              ...prevDict[key], // Preserve other properties
              score: parseFloat((value.score * 100).toFixed(1)),
              color: value.color, // Update the color as well
            },
          }));
        }
      } else {
        if (key !== '' && value !== undefined) {
          setMyDict((prevDict) => ({
            ...prevDict,
            [key]: {
              score: parseFloat((value.score * 100).toFixed(1)),
              color: value.color, // Set the color for new keys
            },
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict]);


  // 이미지 전처리 함수 
  // 모델로 전달되기 전에 이미지 전처리 단계
  const preprocess = (source, modelWidth, modelHeight) => {
    let xRatio, yRatio; // 바운딩 박스 비율

    const input = tf.tidy(() => {
      const img = tf.browser.fromPixels(source);

      // 이미지를 사각형으로 패딩 => [n, m] to [n, n], n > m
      const [h, w] = img.shape.slice(0, 2); // 너비와 높이 추출
      const maxSize = Math.max(w, h);
      const imgPadded = img.pad([
        [0, maxSize - h], // padding y [아래쪽으로만]
        [0, maxSize - w], // padding x [오른쪽으로만]
        [0, 0],
      ]);

      xRatio = maxSize / w; 
      yRatio = maxSize / h;

      return tf.image
        .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // 프레임 resize
        .div(255.0) // 정규화
        .expandDims(0); // add batch
    });

    return [input, xRatio, yRatio];
  };


  // 이미지 탐지 함수
  const detectFrame = async (source, model, canvasRef, callback = () => { }) => {
    
    // 모델의 폭과 너비를 가져오기
    const [modelHeight, modelWidth] = model.inputShape.slice(1, 3);
    
    // start scoping tf engine
    tf.engine().startScope();

    const [input, xRatio, yRatio] = preprocess(source, modelWidth, modelHeight); // 이미지 전처리 (모델 크기에 맞게 이미지 리사이즈)
    const res = model.net.execute(input); // 모델 실행
    const transRes = tf.tidy(() => res.transpose([0, 2, 1]).squeeze()); // transpose main result

    //  바운딩 박스들 얻기 [y1, x1, y2, x2]
    const boxes = tf.tidy(() => {
      const w = transRes.slice([0, 2], [-1, 1]);
      const h = transRes.slice([0, 3], [-1, 1]);
      const x1 = tf.sub(transRes.slice([0, 0], [-1, 1]), tf.div(w, 2)); //x1
      const y1 = tf.sub(transRes.slice([0, 1], [-1, 1]), tf.div(h, 2)); //y1
      return tf
        .concat(
          [
            y1,
            x1,
            tf.add(y1, h), //y2
            tf.add(x1, w), //x2
          ],
          1
        ) // [y1, x1, y2, x2]
        .squeeze(); // [n, 4]
    }); 

    // 점수(신뢰도)와 클래스 명 가져오기
    const [scores, classes] = tf.tidy(() => {
      const rawScores = transRes.slice([0, 4], [-1, numClass]).squeeze(); // [n, 1]
      return [rawScores.max(1), rawScores.argMax(1)];
    });
    
    // Tensorflow.js에서 제공하는 NMS 함수로 중복되거나 겹치는 객체 박스를 제거합니다.
    const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, scoreThreshold); // do nms to filter boxes
    const detReady = tf.tidy(() =>
      tf.concat(
        [
          boxes.gather(nms, 0),
          scores.gather(nms, 0).expandDims(1),
          classes.gather(nms, 0).expandDims(1),
        ],
        1 // axis
      )
    ); 

    // 박스를 그리기 위한 변수
    const toDraw = [];
    let value = {};

    for (let i = 0; i < detReady.shape[0]; i++) {
      const rowData = detReady.slice([i, 0], [1, 6]); 
      let [y1, x1, y2, x2, score, label] = rowData.dataSync(); // [y1, x1, y2, x2, score, label]
      const color = colors.get(label); // get label color

      const upSampleBox = [
        Math.floor(y1 * yRatio), // y
        Math.floor(x1 * xRatio), // x
        Math.round((y2 - y1) * yRatio), // h
        Math.round((x2 - x1) * xRatio), // w
      ]; // upsampled box 전처리 됐던 비율에 맞춰서 다시 업샘플링 

      toDraw.push({
        box: upSampleBox,
        score: score,
        class: label,
        label: labels[label],
        color: color,
      }); // toDraw의 내용으로 캔버스에 바운딩 박스를 그림
      
      // score 갱신
      if (value.hasOwnProperty(labels[label])) {
        if (value[labels[label]] < score) {
          value[labels[label]] = {
            score: score,
            color: color,
          };
        }
      } else {
        value[labels[label]] = {
          score: score,
          color: color,
        };
      }

      tf.dispose([rowData]); // 사용하지 않는 텐서를 해제하여 메모리를 확보
    }
    setDict(value);

    const ctx = canvasRef.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 캔버스 초기화
    renderBoxes(ctx, toDraw); // 캔버스에 바운딩 박스를 그림

      

    tf.engine().endScope(); // end of scoping
  };

  
  // 웹캠(스트림) 실시간 탐지 함수
  // 실행되는 모든 프레임을 탐지
  const detectVideo = (vidSource, model, canvasRef) => {
    const detect = async () => {
      if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
        const ctx = canvasRef.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 캔버스 초기화
        return; // handle if source is closed
      }

      // requestAnimationFrame을 사용해서 다음 프레임을 가져옴
      detectFrame(vidSource, model, canvasRef, () => {
        requestAnimationFrame(detect); 
      });
    };
    detect(); 
  };

  const classbar = Object.entries(myDict).map(([key, value]) => (    
    <div key={key} style={{ margin: "15px 0" }}>
      <ClassBar key={key} label={key} bgcolor={value.color} completed={value.score} />
    </div>
    
  ));
  
  const handleResetMyDict = () => {
    setMyDict({}); // 초기화
  };

  // 사용법 
  const handleClick = () => {
    setVisible(!isVisible);

    if (!isVisible) {
      // 1초 후에 inputForm.current.scrollIntoView() 함수를 호출
      setTimeout(() => {
        inputForm.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);}
  };
  const handleSetting = () => {
    setSettingVisible(!settingVisible);
  };

  const newScoreThreshold = (event, newValue) => {
    setScoreThreshold(newValue);
    console.log(newValue);
  };

  const valuetext = (value) => {
    return `${value}`;
  }
  
  
  
  return (
    <div className="Main" >
      {loading.loading && <LinearWithValueLabel value={parseFloat((loading.progress * 100).toFixed(2))} />}
      <div className="header">
        <p className="Main-primary-subheading">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;꽃 찾아보기
          <Button size="small"><SettingsIcon fontSize="small" color="action" onClick={handleSetting} /></Button>
          </p>
        <h1>YOLOv8 모델을 사용한 꽃 탐지</h1>
        <p>꽃 사진이나 웹캠을 통해 AI가 꽃을 찾아 알려드립니다.</p>
        <p>아래 옵션 중 하나를 선택해서 시작하세요!</p>
      </div>

      <div className="bg-content">
        <div className="content">
          <img
            src="#"
            alt=""
            ref={imageRef}
            onLoad={() => detectFrame(imageRef.current, model, canvasRef.current)}
          />
          
          <video
            autoPlay
            muted
            ref={cameraRef}
            onPlay={() => detectVideo(cameraRef.current, model, canvasRef.current)}
          />
          <canvas width={model.inputShape[2]} height={model.inputShape[1]} ref={canvasRef} />
        </div>
        {classbar}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10px" }}>
          <ButtonHandler imageRef={imageRef} cameraRef={cameraRef} handleResetMyDict={() => handleResetMyDict()} />
          <div style={{ marginLeft: '8px' }}>
          </div>
        </div>
      </div>
      {settingVisible && (
        <Box sx={{width: '75%', maxWidth: 500, alignItems: 'center'}}>
          <Slider
              aria-label="ScoreThreshold"
              defaultValue={0.6}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={0.05}
              marks
              min={0.5}
              max={0.95}
              onChange={newScoreThreshold}
          />      
          <p style={{
          textAlign: "center", 
          color: "#000000",
          fontWeight: "bold",
        }} >ScoreThreshold: {scoreThreshold}</p>
        <p style={{
          textAlign: "center", 
          marginBottom: "1rem",
          color: "#C00000",
          fontWeight: "bold",
          wordBreak: "keep-all"
        }} >* ScoreThreshold 값이 1에 가까울수록 더 정확한 꽃만 탐지합니다.</p>
        </Box> 
      )}
      <div ref={inputForm}>
        {isVisible && <Work />}
      </div>
      <Button onClick={handleClick} variant="outlined" style={{marginBottom: "1rem", fontWeight: "bold"}}>
        {isVisible ? "닫기" : "? 사용법"}
      </Button>
    </div>

  );
};

export default Main;