import React, { useState, useEffect, useMemo } from 'react';
import {Typography, Stack} from '@mui/material';
import Grid from '@mui/material/Grid';
import ring from "../audio/ring.mp3";
import Backdrop from '@mui/material/Backdrop';
import { parsePath, useParams } from 'react-router-dom';
import { SayUtterance} from 'react-say';

function Countdown({onStateChange,trigger,timer}) {
  const [time, setTime] = useState(60000); // Time in milliseconds (1min)
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [toggleBackdrop, setToggleBackdrop] = useState(false);
  const [childState, setChildState] = useState(trigger);
  const [stopAudio, setStopAudio] = useState(false);
  // Constants for timing & threshold
  const INTERVAL = 250; //Update every 0.25s
  const utterance = useMemo(() => new SpeechSynthesisUtterance('Stop!'), []);

  // Play audio
  const playAudio = (sound) => {
    new Audio(sound).play();
  };

  // Function to start the timer
  const startTimer = () => {
    if (!isRunning) {
      const id = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(id);
            setIsRunning(false);
            onStateChange(false);
            return 0;
          }
          return prevTime - INTERVAL;
        });
      }, INTERVAL);
      setIsRunning(true);
      setIntervalId(id);
    }
  };

  const handleClose = () => {
    setToggleBackdrop(false);
  };

  // Function to stop and reset the timer
  const stopTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [intervalId]);

  useEffect(() => {
    // console.log(time)
    console.log(`Child State:${childState}`)
    if (childState === true){
        startTimer() // start the countdown
        setStopAudio(false) //at the start audio turned off
    }
    
    else if (childState === false){
        stopTimer()
    }
    
    if (time === 30000) { //at 0s mark
      // console.log("Audio played.")
      playAudio(ring); // Replace with the actual audio file path
      setToggleBackdrop(true);
    }
    else if (time === 0){
        playAudio(ring); // Replace with the actual audio file path
        setTime(0);
        stopTimer();
        setStopAudio(true); //setStopAudio = true
        onStateChange(false) //inform parent completed timer to cut off session.
    }
    
  }, [time,childState]);

  useEffect(() => { // pass down from parent
    // console.log(time)
    if (trigger === true){
        setChildState(true); // start the countdown
        console.log("set child as true");
    }   
    
    else if (trigger === false){
        setChildState(false); // stop the countdown
        console.log("set child as true");
    }   
    
  }, [trigger]);

  useEffect(()=>{

    // reset the timer if it's true, else let it run
    if (timer === true){
        setTime(60000);
        console.log("set child as true");
    }   

  },[timer])
  
  
  //Function to format time
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(1);
    return `${minutes} mins ${seconds} secs`;
  };

  return (
   

    <Grid
        container
        spacing={0}
        direction="column"
        sx={{ width: '50vw'}} // Set the total width of the container
        >
        <Grid  item xs={12}>
          <Typography variant="h4"><strong>Timer:</strong></Typography>
          <Typography variant="h4">{`${formatTime(time)}`}</Typography>
        </Grid>

        <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="center" // Center horizontally
        alignItems="center" // Center vertically
        sx={{ width: '50vw' }} // Set the total width of the container
        >
      </Grid>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={toggleBackdrop}
        onClick={handleClose}
      >
        <Stack alignItems="center">
        <Typography variant="h1"> Time Elapsed: </Typography>
        <Typography  variant="h2"> {formatTime(time)}</Typography>
        </Stack>
      </Backdrop>
      {stopAudio && <SayUtterance utterance={utterance}/>}
    </Grid>
    
  );
}

export default Countdown;

