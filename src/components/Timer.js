import React, { useState, useEffect } from 'react';
import {Typography, Stack} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ring from "../audio/ring.mp3";
import Backdrop from '@mui/material/Backdrop';

function Timer() {
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [toggleBackdrop, setToggleBackdrop] = useState(false);
  // Play audio
  
  const playAudio = (sound) => {
    new Audio(sound).play();
  };

  // Function to start the timer
  const startTimer = () => {
    if (!isRunning) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 150); // Increment by 400 milliseconds
      
      }, 150);
      setIsRunning(true);
      setIntervalId(id);    
      // console.log(time)
      
    }
  };

  const handleClose = () => {
    setToggleBackdrop(false);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
  };

  // Function to stop and reset the timer
  const stopTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [intervalId]);

  useEffect(() => {
    // console.log(time)
    if ((time + 150) % 60000 === 0) {
      // console.log("Audio played.")
      playAudio(ring); // Replace with the actual audio file path
      setToggleBackdrop(true);
    }  
  }, [time]);
  
  

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
        sx={{ width: '50vw' }} // Set the total width of the container
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
            <Grid item xs={4}>
                <Button
                variant="contained"
                onClick={startTimer}
                startIcon={<PlayArrowIcon />}
                disabled={isRunning}
                >
                Start
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Button
                variant="contained"
                onClick={pauseTimer}
                startIcon={<PauseIcon />}
                disabled={!isRunning}
                >
                Pause
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Button
                variant="contained"
                onClick={stopTimer}
                startIcon={<StopIcon />}
                >
                Stop
                </Button>
            </Grid>



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
    </Grid>
    
  );
}

export default Timer;

