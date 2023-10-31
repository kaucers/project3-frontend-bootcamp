import React, { useState, useEffect, useRef, useMemo} from 'react';
import React, { useState, useEffect, useRef, useMemo} from 'react';
import Button from '@mui/material/Button';
import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
  } from "@mediapipe/tasks-vision";
import { Typography, Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { SayUtterance} from 'react-say';
import Countdown from "./Countdown"
import { useAuth0 } from '@auth0/auth0-react';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import axios from 'axios';
import BACKEND_URL from './constant';
import { getDailyTargets } from './utils';

function PoseProcessing() {
  const { user } = useAuth0();
  const { email:userEmail }= user || {};
  const { user } = useAuth0();
  const { email:userEmail }= user || {};
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(null);
  const [disabledVideoButton,setDisabledVideoButton] = useState(true);
  const [disabledVideoButton,setDisabledVideoButton] = useState(true);
  const [videoHeight] = useState("360px");
  const [videoWidth] = useState("480px");
  const [canvasCtx, setCanvasCtx] = useState(null);
  const [lastVideoTime, setLastVideoTime] = useState(-1); //initialize lastVideoTime
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const enableWebcamButtonRef = useRef(null);
  //Define the state variable to hold the array of points
  const [points, setPoints] = useState(Array(33).fill({ x: 0, y: 0, z: 0 }));
  const [keyRoi, setKeyRoi] = useState([])
  //Push up counter
  const [inDownCycle, setInDownCycle] = useState(false);
  const [inUpCycle, setInUpCycle] = useState(false);
  const [pushUpCounter, setPushUpCounter] = useState(0);
  const [angleDegrees, setAngleDegrees] = useState(0);
  const [lastUpTime, setLastUpTime] = useState(new Date());
  const [targetCount, setTargetCount] = useState(40); //TARGET
  // Use a state variable to track when to play audio
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
  const [countDownTrigger, setCountDownTrigger] = useState(false); //if triggered timer starts
  const [session, setSession] = useState(true); //check whether cycle is completed. intially session is ongoing
  const [resetTime, setResetTime] = useState(false); //resetting timer
  // Constants for timing & threshold
  const MIN_TIME_BETWEEN_UP_PHASES = 500; // Minimum time (in milliseconds) between up phases
  const DOWN_ANGLE_THRESHOLD = 10; // Adjust as needed
  const UP_ANGLE_LOWER_THRESHOLD = 15; // Adjust as needed
  const UP_ANGLE_UPPER_THRESHOLD = 60; // Adjust as needed

  const utterance = useMemo(() => new SpeechSynthesisUtterance(pushUpCounter.toString()), [pushUpCounter]); 

  // Styles
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    alignItems: "center",
    height: "80px",
    color: theme.palette.text.secondary,
  }));

  const ItemTarget = styled(Paper)(({ theme }) => ({
    backgroundColor: '#FFD700', // Yellow background color
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    alignItems: "center",
    height: "80px",
    color: theme.palette.text.secondary,
  }));

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#ffe599' : '#f1c232',
    },
  }));
  
  const BorderCircularProgress = styled(CircularProgress)(({ theme }) => ({
    borderRadius: '50%',
    [`& .MuiCircularProgress-circle`]: {
      strokeLinecap: 'round',
      borderRadius: '5px', // Adjust the border radius as needed
    },
    '&.MuiCircularProgress-colorPrimary': {
      color: '#ffd700', // Change the color of the CircularProgress
    },
  }));

  useEffect(()=>{
    (async()=>{
      if(userEmail){
        try {
          const res = await axios.get(`${BACKEND_URL}/history`, {
            params: {
              email: userEmail,
            },
          });

          const restarget = await axios.get(`${BACKEND_URL}/target?email=${userEmail}`);
          if (res.status === 200&&res.status === 200) {
            const count  = getDailyTargets(
              res.data,
              restarget.data.tbl_target_pefs[0]?.push_up,
              new Date(restarget.data.tbl_target_pefs[0]?.end_date),
              3,
              'push_up'
            )[0]?.exerciseTarget||0
            setTargetCount(count);
            console.log(`Historical: ${JSON.stringify(res.data)}`);
          } else {
            console.error('Invalid response data format');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    })();
  },[userEmail])

  useEffect(() => {
    async function createPoseLandmarker() {
        console.log("Loading Model")
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      const newPoseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task`,
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      setPoseLandmarker(newPoseLandmarker);
      setDisabledVideoButton(false); //allow user to click
      setDisabledVideoButton(false); //allow user to click


    }

    createPoseLandmarker();
  }, []);

  //Effect that only executes when the state of the webcam running changes
  useEffect(()=>{
    console.log(`UseEffect: ${webcamRunning}`)
    // Function to run MediaPipe Pose Estimation

    const constraints = {
        video: true
      };

    //Calculation of angle between 2 points
    const calculateAngle = (point1, point2) => {
    return Math.atan2(Math.abs(point2.y - point1.y),Math.abs(point2.x - point1.x));
    };

    //Average coordinate
    function averageCoordinates(obj1, obj2) {
        if (!obj1 || !obj2) {
          return null; // Handle cases with missing objects
        }
      
        const averageX = (obj1.x + obj2.x) / 2;
        const averageY = (obj1.y + obj2.y) / 2;
        const averageZ = (obj1.z + obj2.z) / 2;
      
        return { x: averageX, y: averageY, z: averageZ };
      }

 
    //Calculation of angle between 2 points
    const calculateAngle = (point1, point2) => {
    return Math.atan2(Math.abs(point2.y - point1.y),Math.abs(point2.x - point1.x));
    };

    //Average coordinate
    function averageCoordinates(obj1, obj2) {
        if (!obj1 || !obj2) {
          return null; // Handle cases with missing objects
        }
      
        const averageX = (obj1.x + obj2.x) / 2;
        const averageY = (obj1.y + obj2.y) / 2;
        const averageZ = (obj1.z + obj2.z) / 2;
      
        return { x: averageX, y: averageY, z: averageZ };
      }

 
    
   function predictWebcam() {
    if (canvasRef.current && videoRef.current) { //If these parts are present
    if (canvasRef.current && videoRef.current) { //If these parts are present
      const videoTime = videoRef.current.currentTime; //Reset new videoref time
              
          // Continue with detection after setting options
          if (lastVideoTime !== videoTime) {
            setLastVideoTime(videoTime);
            poseLandmarker.detectForVideo(videoRef.current, performance.now(), (result) => {
              const canvasCtx = canvasRef.current.getContext("2d");
              const drawingUtils = new DrawingUtils(canvasCtx);
              canvasCtx.save();
              canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            //   console.log(result.landmarks.length !== 0 )
            //   console.log(result.landmarks.length !== 0 ? result.landmarks[0][0].z : null) //printing out the human pose
              //Update the coordinates for the pose
              setPoints(result.landmarks.length !== 0 ? result.landmarks[0] : null)
            //   console.log(result.landmarks.length !== 0 )
            //   console.log(result.landmarks.length !== 0 ? result.landmarks[0][0].z : null) //printing out the human pose
              //Update the coordinates for the pose
              setPoints(result.landmarks.length !== 0 ? result.landmarks[0] : null)

            //Drawing of the landmarks
            //Drawing of the landmarks
              for (const landmark of result.landmarks) {
                //Draw dots
                //Draw dots
                drawingUtils.drawLandmarks(landmark, {
                    color:"#000000",
                    radius: 1
                    color:"#000000",
                    radius: 1
                });
                canvasCtx.font = "12px Arial";
                //Draw connectors
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, { color: "#1877F2" });
                //Label the key points
                for (const [index, element] of landmark.entries()) {
                    // console.log(index, element.x, element.y)
                    canvasCtx.strokeText(index, (element.x)*canvasRef.current.width, element.y*canvasRef.current.height); //plot the numbers
                  }
                
            }

            //Push up counting
            if (result.landmarks.length !== 0){
            const leftShoulder = result.landmarks[0][11];
            const rightShoulder = result.landmarks[0][12];
            const leftHeel = result.landmarks[0][29];
            const rightHeel = result.landmarks[0][30];

            const angleShoulderHip = calculateAngle(averageCoordinates(rightHeel, leftHeel),averageCoordinates(rightShoulder, leftShoulder)) ;
            const angleDegrees = (angleShoulderHip * 180) / Math.PI;
            // console.log(result.landmarks[0][11]);
            // console.log(`Angle: ${angleDegrees.toFixed(2)}°`)        
            setAngleDegrees(angleDegrees)

        }
            
                canvasCtx.font = "12px Arial";
                //Draw connectors
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, { color: "#1877F2" });
                //Label the key points
                for (const [index, element] of landmark.entries()) {
                    // console.log(index, element.x, element.y)
                    canvasCtx.strokeText(index, (element.x)*canvasRef.current.width, element.y*canvasRef.current.height); //plot the numbers
                  }
                
            }

            //Push up counting
            if (result.landmarks.length !== 0){
            const leftShoulder = result.landmarks[0][11];
            const rightShoulder = result.landmarks[0][12];
            const leftHeel = result.landmarks[0][29];
            const rightHeel = result.landmarks[0][30];

            const angleShoulderHip = calculateAngle(averageCoordinates(rightHeel, leftHeel),averageCoordinates(rightShoulder, leftShoulder)) ;
            const angleDegrees = (angleShoulderHip * 180) / Math.PI;
            // console.log(result.landmarks[0][11]);
            // console.log(`Angle: ${angleDegrees.toFixed(2)}°`)        
            setAngleDegrees(angleDegrees)

        }
            
              canvasCtx.restore();
            });

            


            

          }
  
    }
    setCanvasCtx(canvasCtx)
    // console.log(`Webcam: ${webcamRunning}`)
    setCanvasCtx(canvasCtx)
    // console.log(`Webcam: ${webcamRunning}`)
    
    //To have additional conditions to check if the video feed is running
    if(videoRef.current && !videoRef.current.paused){ 
    //To have additional conditions to check if the video feed is running
    if(videoRef.current && !videoRef.current.paused){ 
        window.requestAnimationFrame(predictWebcam);
    }

    else{
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log(canvasCtx)
        console.log(canvasRef.current.width, canvasRef.current.height);
    }
    

    else{
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log(canvasCtx)
        console.log(canvasRef.current.width, canvasRef.current.height);
    }
    
  };

    // Function to start the webcam
    const startWebcam = () => {
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            videoRef.current.srcObject = stream;
            console.log("Add listener")
            videoRef.current.addEventListener("loadeddata", predictWebcam);

        })
        .catch((error) => {
            console.error("Error accessing webcam:", error);
        });
    };

    // Function to stop the webcam
    const stopWebcam = () => {
        // Remove the loadeddata event listener
        console.log("Remove listener")
        if(videoRef.current){
          videoRef.current.removeEventListener("loadeddata", predictWebcam);
        if(videoRef.current){
          videoRef.current.removeEventListener("loadeddata", predictWebcam);
      
        // Stop video tracks associated with the stream
        if (videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => {
            track.stop();
          });
      
          // Release access to the camera
          videoRef.current.srcObject = null;
          setLastVideoTime(-1)
        }
        }
        setPushUpCounter(0);//reset
        }
        setPushUpCounter(0);//reset
      };

      console.log(`Webcam-Post: ${webcamRunning}`)

    if (webcamRunning===true){
        // Check if webcam access is supported.
        const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
        if (hasGetUserMedia()) {
            startWebcam()
          } else {
            console.warn("getUserMedia() is not supported by your browser");
          }        
    }
    
    if (webcamRunning===false){
        console.log("Stopping Webcam")
        stopWebcam()        
        stopWebcam()        
    }

    // Define a cleanup function to stop the webcam when unmounting
  return () => {
    console.log("Unmounting")
    stopWebcam(); // Stop the webcam when the component unmounts
  };
    
  }, [webcamRunning])

  //Determining push up count
  useEffect(() => {
    function processPushUpAngle(angleDegrees) {
        const isDownCycle = angleDegrees < DOWN_ANGLE_THRESHOLD;
        const isUpCycle = angleDegrees > UP_ANGLE_LOWER_THRESHOLD && angleDegrees < UP_ANGLE_UPPER_THRESHOLD;
        
        return { isDownCycle, isUpCycle };
        }
        
    // Process the push-up angle
    let { isDownCycle, isUpCycle } = processPushUpAngle(angleDegrees);
    console.log(isUpCycle,isDownCycle)
    console.log(inUpCycle,inDownCycle)


    // Check for push-up phase transitions and count push-ups
    if (isDownCycle) {
        setInDownCycle(true);
        setInUpCycle(false);
        console.log("DOWN");
    } 
    else if (isUpCycle) {
        setLastUpTime(new Date());
        console.log("UP");
        console.log(inDownCycle);
        console.log(`Time Bet. Up: ${new Date() - lastUpTime}`)
        // console.log(`lastUpTime: ${lastUpTime}`)
        
        if (session && inDownCycle && ((new Date() - lastUpTime) >= MIN_TIME_BETWEEN_UP_PHASES)) {
        // If in the down cycle was detected prior, it's a complete push-up                    
            setPushUpCounter((pushUpCounter) => pushUpCounter + 1);
            setInDownCycle(false);
        }
        setInUpCycle(true);
    }

  }, [angleDegrees]); // Include the state variable as a dependency

  useEffect(() => {
    // This effect will run whenever pushUpCounter or utterance changes
    // Now you can use the utterance object as needed

    // Example: Speak the pushUpCounter whenever it changes
    if (pushUpCounter===0){
      window.speechSynthesis.cancel(); // Cancel any previous speech
    }
    else{
      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    }

  }, [pushUpCounter, utterance]);

  useEffect(() => {
    // If session is valid and the push up > 0, start timing
    console.log(`Push-Ups: ${pushUpCounter}`)
    if (pushUpCounter>0 && session=== true){
        setCountDownTrigger(true); //this will trigger the child to be true to start counting
        console.log(countDownTrigger)
      }
    }
, [countDownTrigger,pushUpCounter]);

  const updatePushUp = async()=>{
    const res = await axios.post(`${BACKEND_URL}/updatecurrentpef`,{
      email:userEmail,
      push_up:pushUpCounter
    });
    if (res.status === 200) {
      console.error('Push-up Updated');
    } else {
      console.error('Update Failed');
    }
  }

  const handleStateChange = (newState) => {
    // Update the parent state with the value from the child
    if (newState ===false){
      console.log("Time's Up. Turning off session.")
      updatePushUp();
      setSession(newState); //turn off the session retain the push-up value
    }
  };

  //Button and state toggling
  function enableCam() {
    if (!poseLandmarker) {//if the pose landmarks not loaded, don't enableCam
      console.log("Wait! poseLandmaker not loaded yet.");
      return;
    }


    //Toggle Effect
    if (webcamRunning === true) {
      setWebcamRunning(false);
      console.log(webcamRunning)
      console.log("Web Off");
      enableWebcamButtonRef.current.innerText = "START";
      //Reset the counting parameters:
      setPushUpCounter(0); //tops camera resets pushup
      setCountDownTrigger(false); //countdown stops
      setSession(false); //session stops counting when user stops session
      setResetTime(true); //reset timer to 1min
      enableWebcamButtonRef.current.innerText = "START";
      //Reset the counting parameters:
      setPushUpCounter(0); //tops camera resets pushup
      setCountDownTrigger(false); //countdown stops
      setSession(false); //session stops counting when user stops session
      setResetTime(true); //reset timer to 1min
      
    
    } else {
      setWebcamRunning(true);
      setResetTime(false);
      setSession(true); //reset session
      setResetTime(false);
      setSession(true); //reset session
      console.log(webcamRunning)
      console.log("Web On");
      enableWebcamButtonRef.current.innerText = "STOP";
      enableWebcamButtonRef.current.innerText = "STOP";

    }    

}

    function PushUpProgressBar(targetCount, currentCount ) {
        // Calculate the progress percentage
        // console.log(currentCount, targetCount)
        if (currentCount !== 0 ){
            let progress = (currentCount / targetCount) * 100;
            return progress
        }
        else{
            let progress = 0;
            return progress
        }
    }
}

    function PushUpProgressBar(targetCount, currentCount ) {
        // Calculate the progress percentage
        // console.log(currentCount, targetCount)
        if (currentCount !== 0 ){
            let progress = (currentCount / targetCount) * 100;
            return progress
        }
        else{
            let progress = 0;
            return progress
        }
    }



  
  

  return (
    <div>
    <Button onClick={()=>updatePushUp(20)}>Update</Button>
      {console.log(`States: Trigger${countDownTrigger} Session: ${session} Reset: ${resetTime}`)}
      <h1>Automatic Push-Up Counter</h1>
       {/* PUSH UP ROW */}
      <div className="alignItems">
      <Countdown trigger={countDownTrigger} onStateChange={handleStateChange} timer={resetTime}/>
      </div>

      <Grid
      className="data-container alignItems"
      container
      spacing={0}
      direction="row"
      sx={{ 
        width: '50vw', //set container width
        mx: 'auto', //center horizontally 
    }} // Set the total width of the container
    >

        <Grid  item xs={2}>
          <Item>
          <Typography variant="body1">Push-Up Reps</Typography> 
          <Divider variant="middle" />
          <Typography variant="h3">{pushUpCounter}</Typography>
          </Item>
        </Grid>

        <Grid  item xs={4} >
          <Item>
          <Typography variant="body1">Progress Bar</Typography> 
          <Divider variant="middle" />
          <div style={{ display: 'flex', alignItems: 'center', height: '70%' }}>
            <div style={{ width: '100%' }}>
              <BorderLinearProgress variant="determinate" value={(pushUpCounter / targetCount) * 100} />
            </div>
          </div>
          </Item>
        </Grid>


        <Grid item xs={2}>
          <ItemTarget>
          <Typography variant="body1">Today's Target</Typography> 
          <Divider variant="middle" />
          <Typography variant="h3">{targetCount}</Typography>
          </ItemTarget>
        </Grid>  
        
      </Grid>
      <br></br>

      <Button  disabled={disabledVideoButton} ref={enableWebcamButtonRef} variant="contained" id="webcamButton" onClick={enableCam}>  
        {webcamRunning ? "STOP" : "START"}
      </Button>
      <p>{(videoRef.current && !videoRef.current.paused) ? "To start, begin push up." : "Please wait, loading..."}</p>
      <div style={{ position: 'relative' }}>
      <p>{(videoRef.current && !videoRef.current.paused) ? "To start, begin push up." : "Please wait, loading..."}</p>
      <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        id="webcam"
        autoPlay
        width={videoWidth}
        height={videoHeight}
      ></video>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <BorderCircularProgress variant="determinate" value={PushUpProgressBar(targetCount,pushUpCounter).toFixed(2)} size={300} />
         <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        
        <Typography variant="h3" component="div" color="white">{PushUpProgressBar(targetCount,pushUpCounter).toFixed(2)}%</Typography>
        </Box>
        </Box>

        
      </div>
    </div>      
      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <BorderCircularProgress variant="determinate" value={PushUpProgressBar(targetCount,pushUpCounter).toFixed(2)} size={300} />
         <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        
        <Typography variant="h3" component="div" color="white">{PushUpProgressBar(targetCount,pushUpCounter).toFixed(2)}%</Typography>
        </Box>
        </Box>

        
      </div>
    </div>      
      

      <canvas
        ref={canvasRef}
        id="output_canvas"
        className="output_canvas"
        width={videoWidth}
        height={videoHeight}
      ></canvas>
      <Typography>{points === null ? "No objects detected" :  `NOSE - X: ${points[0].x.toFixed(2)}, Y: ${points[0].y.toFixed(2)}, Z:${points[0].z.toFixed(2)}`}</Typography>
      {/* <Typography>{`UpCycle: ${inUpCycle}`}</Typography>
      <Typography>{`DownCycle: ${inDownCycle}`}</Typography> */}
      <Typography>{`Audio: ${shouldPlayAudio}`}</Typography>
      <SayUtterance
      utterance={ utterance }
    />
      <Typography>{`Body Angle: ${angleDegrees.toFixed(2)}°`}</Typography>
      <Typography>{lastUpTime.toString()}</Typography>
      <Typography>{points === null ? "No objects detected" :  `NOSE - X: ${points[0].x.toFixed(2)}, Y: ${points[0].y.toFixed(2)}, Z:${points[0].z.toFixed(2)}`}</Typography>
      {/* <Typography>{`UpCycle: ${inUpCycle}`}</Typography>
      <Typography>{`DownCycle: ${inDownCycle}`}</Typography> */}
      <Typography>{`Audio: ${shouldPlayAudio}`}</Typography>
      <SayUtterance
      utterance={ utterance }
    />
      <Typography>{`Body Angle: ${angleDegrees.toFixed(2)}°`}</Typography>
      <Typography>{lastUpTime.toString()}</Typography>
    </div>
  );
}

export default PoseProcessing;