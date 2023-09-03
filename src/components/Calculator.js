import * as React from 'react';
import { useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AirlineSeatLegroomReducedIcon from '@mui/icons-material/AirlineSeatLegroomReduced';
import TextField from '@mui/material/TextField';
import { Slider, Typography, makeStyles, Stack } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  height: "80%",
  color: theme.palette.text.secondary,
}));

export default function Calculator() {
  const [sliderValuePU, setSliderValuePU] = useState(50);
  const [sliderSitUp, setsSliderSitUp] = useState(50);
  const [sliderRun, setsSliderRun] = useState(650);
  const [currentAge, setCurrentAge] = useState(20); // Initial age value
  const [error, setError] = useState(false);



  const handleSliderPushUpChange = (event, newValue) => {
    setSliderValuePU(newValue);
  };

  const handleSliderSitUpChange = (event, newValue) => {
    setsSliderSitUp(newValue);
  };

  const handleSliderRunChange = (event, newValue) => {
    setsSliderRun(newValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    // Check if the input is numeric and has at most two digits
    if (/^\d{0,2}$/.test(value) && value.length <= 2) {
      setCurrentAge(value);
      setError(false);
    } else {
      setError(true);
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    return `${formattedMinutes}min:${formattedSeconds}s`;
  }


  return (
    <div className="main">
    <FormControl>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        
        <Grid item xs={4}>
          <Item>Push-Up Points</Item>
        </Grid>
        
        <Grid item xs={4}>
          <Item>Sit-Up Points</Item>
        </Grid>
        
        <Grid item xs={4}>
          <Item>Running Points</Item>
        </Grid>
        
        <Grid item xs={4}>
          <Item>
          <Stack spacing={2} alignItems="center">
            <FormLabel id="demo-radio-buttons-group-label">Vocation</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="nsf"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="special"
                control={<Radio />}
                label="Commando/Diver/Guards"
              />
              <FormControlLabel
                value="nsf"
                control={<Radio />}
                label="NSF/NSMen"
              />
            </RadioGroup>
          </Stack>
          </Item>
        </Grid>


        <Grid item xs={4}>
          <Item>
        <Typography gutterBottom>Enter Age:</Typography>
        <TextField
          label="Age"
          variant="outlined"
          value={currentAge}
          onChange={handleInputChange}
          error={error}
          helperText={error ? 'Please enter a 2 digit number' : ''}
          inputProps={{ maxLength: 2 }}
        />
        </Item>          
        </Grid>
        <Grid item xs={4} >
        <Item >
          <Stack justifyContent="center" spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="male"
        name="radio-buttons-group">
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
      </Stack>
      </Item>
        </Grid>

        <Grid item xs={12}>
          <Item>Push-Ups Slider 
          <Stack justifyContent="center" spacing={2} direction="row" sx={{ mb: 1 }} alignItems="left">
          <AccessibilityNewIcon style={{ margin: '0 3vw' }}/>
        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto"  style={{  width: "50vw"}}  onChange={handleSliderPushUpChange} min={0} max={100}/>
        <Typography style={{ width: '20px', margin: '0 3vw' }}>Reps:{`\n${sliderValuePU}`}</Typography>
          </Stack>
          </Item>        
        </Grid>

        
        <Grid item xs={12}>
          <Item>Sit-Ups Slider 
          <Stack justifyContent="center" spacing={2} direction="row" sx={{ mb: 1 }} alignItems="left">
          <AirlineSeatLegroomReducedIcon style={{ margin: '0 3vw' }}/>
        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto"  style={{  width: "50vw"}}  onChange={handleSliderSitUpChange} min={0} max={100}/>
        <Typography style={{ width: '20px', margin: '0 3vw' }}>Reps:{`\n${sliderSitUp}`}</Typography>
          </Stack>
          </Item>        
        </Grid>

        <Grid item xs={12}>
          <Item>2.4km Slider
          <Stack justifyContent="center" spacing={2} direction="row" sx={{ mb: 1 }} alignItems="left">
          <AccessAlarmIcon style={{ width: '20px', margin: '0 3vw' }}/>
        <Slider defaultValue={600} aria-label="Default" valueLabelDisplay="auto"  style={{  width: "50vw"}}  onChange={handleSliderRunChange} min={500}
  max={1090}/>
        <Typography style={{ width: '20px', margin: '0 3vw' }}>Time:{`\n${formatTime(sliderRun)}`}</Typography>
          </Stack>
          </Item>        
        </Grid>


      </Grid>
    </Box>
    </FormControl>
    </div>
  );
}