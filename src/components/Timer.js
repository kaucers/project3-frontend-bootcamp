import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

function StopwatchTimer() {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Function to start the timer
  const startTimer = () => {
    if (!isRunning) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setIsRunning(true);
      setIntervalId(id);
    }
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

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={startTimer}
          startIcon={<PlayArrowIcon />}
          disabled={isRunning}
        >
          Start
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={pauseTimer}
          startIcon={<PauseIcon />}
          disabled={!isRunning}
        >
          Pause
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="default"
          onClick={stopTimer}
          startIcon={<StopIcon />}
        >
          Stop
        </Button>
      </Grid>
      <Grid item>
        <div>
          <strong>Time:</strong> {time} seconds
        </div>
      </Grid>
    </Grid>
  );
}

export default StopwatchTimer;
