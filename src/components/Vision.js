import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
  } from "@mediapipe/tasks-vision";

function Vision() {
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [runningMode, setRunningMode] = useState("VIDEO");
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [videoHeight] = useState("360px");
  const [videoWidth] = useState("480px");
  const [canvasCtx, setCanvasCtx] = useState(null);
  // const [lastVideoTime, setLastVideoTime] = useState(-1); //initialize lastVideoTime
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const enableWebcamButtonRef = useRef(null);

  useEffect(() => {
    async function createPoseLandmarker() {
        console.log("Loading Model")
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      const newPoseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: runningMode,
        numPoses: 1,
      });

      setPoseLandmarker(newPoseLandmarker);

      const newCanvasCtx = canvasRef.current.getContext("2d");
      setCanvasCtx(newCanvasCtx);
    }

    createPoseLandmarker();
  }, [runningMode]);




  async function enableCam() {
    if (!poseLandmarker) {//if the pose landmarks not loaded, don't enableCam
      console.log("Wait! poseLandmaker not loaded yet.");
      return;
    }

    const constraints = {
      video: true
    };

    // Function to start the webcam
    const startWebcam = () => {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.removeEventListener("loadeddata", predictWebcam); //to avoid lags
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    };

    // Function to stop the webcam
    const stopWebcam = () => {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    };



    //Toggle Effect
    if (webcamRunning === true) {
      await setWebcamRunning(false);
      console.log(webcamRunning)
      console.log("Web Off");
      enableWebcamButtonRef.current.innerText = "ENABLE PREDICTIONS";
      stopWebcam();
      
    
    } else {
      await setWebcamRunning(true);
      console.log(webcamRunning)
      console.log("Web On");
      enableWebcamButtonRef.current.innerText = "DISABLE PREDICTIONS";
      startWebcam();
    }    

    // Cleanup function to stop the webcam when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
  }
}


  let lastVideoTime = -1;
  
  
  
  //Function: Running Mediapipe Pose Estimation
  async function predictWebcam() {
    canvasRef.current.style.height = videoHeight;
    videoRef.current.style.height = videoHeight;
    canvasRef.current.style.width = videoWidth;
    videoRef.current.style.width = videoWidth;
    // console.log("Running Cam")
    // console.log(`Last Video: ${lastVideoTime}`)
    // console.log(`Webcam Running: ${webcamRunning}`)

    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    }

    let startTimeMs = performance.now();
    if (lastVideoTime !== videoRef.current.currentTime) {
      lastVideoTime = videoRef.current.currentTime;
      
      //AI Detectin
      poseLandmarker.detectForVideo(videoRef.current, startTimeMs, (result) => {
        const canvasCtx = canvasRef.current.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        for (const landmark of result.landmarks) {
          drawingUtils.drawLandmarks(landmark, {
            radius: 5
          });
          drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS,{color: "#00FF00"});
        }
        canvasCtx.restore();
      });
    }

    // As long as the webcam is running, keep calling predictwebcam
    if (webcamRunning === false) {
      window.requestAnimationFrame(predictWebcam);
    }
  }

  return (
    <div>
      <h1>Hello, World!</h1>
      <Button  ref={enableWebcamButtonRef} variant="contained" id="webcamButton" onClick={enableCam}>
        {webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS"}
      </Button>
      <p>This is a generic React component.</p>      
      <video
        ref={videoRef}
        id="webcam"
        autoPlay
        style={{ width: '100%', maxWidth: '640px' }}
      ></video>

      <canvas
        ref={canvasRef}
        id="output_canvas"
        className="output_canvas"
        width={videoWidth}
        height={videoHeight}
      ></canvas>
    </div>
  );
}

export default Vision;
