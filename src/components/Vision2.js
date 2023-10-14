import React, { useState, useEffect, useRef } from 'react';

function WebcamImageProcessing() {
  const [webcamOn, setWebcamOn] = useState(false);
  const [frames, setFrames] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offScreenCanvasRef = useRef(null); // Off-screen canvas for processing
  const maxFrames = 1; // Maximum number of frames to keep in memory

  useEffect(() => {
    let frameCaptureInterval;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const offScreenCanvas = offScreenCanvasRef.current;
    const offScreenCtx = offScreenCanvas.getContext('2d');
    
    let frameIndex = 0; // Index for the circular buffer
    const circularBuffer = new Array(maxFrames).fill(null); // Circular buffer to store frames

    const captureFrame = () => {
      
      offScreenCtx.clearRect(0, 0, canvas.width, canvas.height);
      offScreenCtx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply image processing (e.g., grayscale filter)
      const processedFrame = applyGrayscaleFilter(offScreenCtx.getImageData(0, 0, canvas.width, canvas.height));
      // ctx.putImageData(processedFrame, 0, 0); // Corrected putImageData arguments
      // Store the processed frame in the circular buffer
      circularBuffer[frameIndex] = processedFrame;

      // Set the frames state with a subset of the circular buffer (latest frames)
      setFrames([...circularBuffer.filter(frame => frame !== null)]);

      // Update the circular buffer index (cycling through frames)
      frameIndex = (frameIndex + 1) % maxFrames;
    };

    const startFrameCapture = () => {
      frameCaptureInterval = setInterval(() => {
        if (webcamOn) {
          captureFrame();
        }
      }, 100); // Capture frames every 100 milliseconds (adjust as needed)
    };

    if (webcamOn) {
      startWebcam();
      startFrameCapture();
    } else {
      stopWebcam();
      clearInterval(frameCaptureInterval);
    }

    return () => {
      clearInterval(frameCaptureInterval);
      stopWebcam();
    };
  }, [webcamOn]);


  useEffect(() => {
    console.log(frames);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // console.log(JSON.stringify(frames));

      
    frames.forEach((frame, index) => {
      // Inside this callback, you can safely draw the image onto the canvas
      ctx.save();
      ctx.putImageData(frame, 0, 0); // Corrected putImageData arguments
      console.log("Image loaded");
    });
  }, [frames]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  


  const applyGrayscaleFilter = (imageData) => {
    // Implement your grayscale filter logic here
    // Example: Convert pixel data to grayscale
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    return imageData;
  };

  return (
    <div>
      <h1>Webcam Image Processing</h1>
      <button onClick={() => setWebcamOn((prevWebcamOn) => !prevWebcamOn)}>
        {webcamOn ? 'Turn Off Webcam' : 'Turn On Webcam'}
      </button>
      <video ref={videoRef} autoPlay playsInline muted />
      <div>
      <canvas ref={canvasRef} width={videoRef.current?.videoWidth} height={videoRef.current?.videoHeight} />
      <canvas ref={offScreenCanvasRef} width={videoRef.current?.videoWidth} height={videoRef.current?.videoHeight} />
      </div>
    </div>
  );
}

export default WebcamImageProcessing;
