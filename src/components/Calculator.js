import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Slider, Typography, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import BACKEND_URL from './constant';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth0 } from '@auth0/auth0-react';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '80%',
  color: theme.palette.text.secondary,
}));

export default function Calculator() {
  const { user } = useAuth0();
  const { email: userEmail } = user || {};

  const [sliderValuePU, setSliderValuePU] = useState(50);
  const [sliderSitUp, setsSliderSitUp] = useState(50);
  const [sliderRun, setsSliderRun] = useState(650);
  const [currentAge, setCurrentAge] = useState(20); // Initial age value
  const [error, setError] = useState(false);
  // Display Points
  const [pointsSitUp, setpointsSitUp] = useState(0);
  const [pointsRun, setpointsRun] = useState(0);
  const [pointsPushUp, setpointsPushUp] = useState(0);
  const [testDate, setTestDate] = useState(null);
  // Display Todays' Date
  const [todayDate, setTodayDate] = useState('');
  // Get User data
  const [userId, setUserId] = useState(null);
  // const [userEmail, setUserEmail] = useState('dexterchewxh@hotmail.sg');
  // Detect if form is changed
  const [formChanged, setFormChanged] = useState(false);

  const handleSliderPushUpChange = (event, newValue) => {
    setSliderValuePU(newValue);
    setFormChanged(true);
  };

  const handleSliderSitUpChange = (event, newValue) => {
    setsSliderSitUp(newValue);
    setFormChanged(true);
  };

  const handleSliderRunChange = (event, newValue) => {
    setsSliderRun(newValue);
    setFormChanged(true);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setFormChanged(true);
    // Check if the input value is a valid number between 22 and 60
    if (/^\d+$/.test(inputValue) && inputValue >= 15 && inputValue <= 60) {
      setError(false);
      setCurrentAge(inputValue);
    } else {
      setError(true);
      setCurrentAge(inputValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BACKEND_URL}/updatetarget`, {
        push_up: sliderValuePU,
        sit_up: sliderSitUp,
        run: sliderRun,
        end_date: testDate,
        user_id: userId,
      });
      // console.log('Form submitted successfully:', res.data);
      setFormChanged(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}min:${formattedSeconds}s`;
  }

  function categorizeAge(age) {
    if (age < 22) {
      return 1;
    } else if (age >= 22 && age <= 24) {
      return 2;
    } else if (age >= 25 && age <= 27) {
      return 3;
    } else if (age >= 28 && age <= 30) {
      return 4;
    } else if (age >= 31 && age <= 33) {
      return 5;
    } else if (age >= 34 && age <= 36) {
      return 6;
    } else if (age >= 37 && age <= 39) {
      return 7;
    } else if (age >= 40 && age <= 42) {
      return 8;
    } else if (age >= 43 && age <= 45) {
      return 9;
    } else if (age >= 46 && age <= 48) {
      return 10;
    } else if (age >= 49 && age <= 51) {
      return 11;
    } else if (age >= 52 && age <= 54) {
      return 12;
    } else if (age >= 55 && age <= 57) {
      return 13;
    } else if (age >= 58 && age <= 60) {
      return 14;
    } else {
      // For ages 60 and above
      return 14;
    }
  }

  function calculateAwardType() {
    let totalPoints = pointsPushUp + pointsRun + pointsSitUp;
    if (totalPoints >= 90) {
      return 'Gold (Commando / Diver / Guards)';
    } else if (totalPoints >= 85) {
      return 'Gold';
    } else if (totalPoints >= 75) {
      return 'Silver';
    } else if (totalPoints >= 61) {
      return 'Pass with Incentive (NSmen)';
    } else if (totalPoints >= 51) {
      return 'Pass (NSmen)';
    } else {
      return 'No Award';
    }
  }

  function calculateDaysRemaining(currentDate, testDate) {
    if (testDate) {
      //if there is testDate
      // Calculate the time difference in milliseconds
      const timeDifference = testDate - currentDate;
      // Calculate the number of days remaining (1 day = 24 hours = 86400000 milliseconds)
      const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      return daysRemaining || 0;
    } else {
      return null;
    }
  }

  function calculateAge(birthdate) {
    // Get the current date
    const currentDate = new Date();
    // Calculate the difference in milliseconds between the current date and birthdate
    const ageDifference = currentDate - new Date(birthdate);
    // Convert the age difference to a Date object to extract years
    const ageDate = new Date(ageDifference);
    // Get the year (subtract 1970 because ageDate is relative to 1970)
    const age = ageDate.getUTCFullYear() - 1970;
    return age;
  }

  useEffect(() => {
    //Get today's date
    // Create a new Date object for today's date
    const currentDate = new Date();
    // Set the formatted date in the state
    setTodayDate(currentDate);
  }, []);

  // Define the useEffect hook
  useEffect(() => {
    // Function to make the axios request and update the points

    const fetchDataAndSetPoints = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/`, {
          params: {
            age: categorizeAge(currentAge),
            pushup: sliderValuePU,
            situp: sliderSitUp,
            running: sliderRun,
          },
        });
        // console.log(response);

        // Check if the response data is an array with at least 3 elements
        if (Array.isArray(response.data) && response.data.length >= 3) {
          // Update the points locally
          setpointsSitUp(response.data[0]);
          setpointsPushUp(response.data[1]);
          setpointsRun(response.data[2]);
        } else {
          console.error('Invalid response data format');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function when dependencies change
    fetchDataAndSetPoints();
  }, [sliderValuePU, sliderSitUp, sliderRun, currentAge]); // Dependencies: trigger when these states change

  //  Function to make the axios request and update the target

  useEffect(() => {
    // Function to fetch exercise data based on user's email
    const fetchTargetData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/target?email=${userEmail}`);

        if (res.status === 200) {
          const tbl_target_pefs = res.data.tbl_target_pefs[0];
          // console.log(`Data: ${JSON.stringify(res.data.tbl_target_pefs[0].end_date)}`)
          setSliderValuePU(res.data.tbl_target_pefs[0]?.push_up);
          setsSliderSitUp(res.data.tbl_target_pefs[0]?.sit_up);
          setsSliderRun(res.data.tbl_target_pefs[0]?.run);
          setTestDate(new Date(res.data.tbl_target_pefs[0]?.end_date));
          setUserId(res.data.id); //sets the UserId
          // Access end_date from the first target performance record
          // setTestDate(res.data[0].tbl_target_pefs[0].end_date);
          setCurrentAge(calculateAge(res.data.birthday));
          console.log('Fetched User Data');
        } else {
          console.error('Failed to fetch exercise data.');
        }
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    if (userEmail) {
      // Fetch exercise data when userEmail state changes
      fetchTargetData();
    }
  }, [userEmail]);

  return (
    <div className='main'>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={!formChanged}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Item>
                  <Typography variant='body1'>Test-Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date'
                      value={dayjs(testDate)}
                      onChange={(newValue) => {
                        setTestDate(newValue);
                        setFormChanged(true);
                      }}
                    />
                  </LocalizationProvider>
                </Item>
              </Grid>

              <Grid item xs={8}>
                <Item>
                  <Typography variant='body1'>Award</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h2'>{calculateAwardType()}</Typography>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <Item>
                  <Typography variant='body1'>Days Remaining</Typography>
                  <Typography variant='h2'>
                    {calculateDaysRemaining(todayDate, testDate)}
                  </Typography>
                </Item>
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography variant='body1'>Push-Up Points</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{pointsPushUp}</Typography>
                </Item>
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography variant='body1'>Sit-Up Points</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{pointsSitUp}</Typography>
                </Item>
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography variant='body1'>Running Points</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{pointsRun}</Typography>
                </Item>
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Stack spacing={2} alignItems='center'>
                    <FormLabel id='demo-radio-buttons-group-label'>
                      Vocation
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby='demo-radio-buttons-group-label'
                      defaultValue='nsf'
                      name='radio-buttons-group'
                    >
                      <FormControlLabel
                        value='special'
                        control={<Radio />}
                        label='Commando/Diver/Guards'
                        disabled={true}
                      />
                      <FormControlLabel
                        value='nsf'
                        control={<Radio />}
                        label='NSF/NSMen'
                      />
                    </RadioGroup>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={4}>
                <Item>
                  <Typography gutterBottom>Age:</Typography>
                  <TextField
                    label='Age'
                    variant='outlined'
                    value={currentAge}
                    disabled={true}
                    onChange={handleInputChange}
                    error={error}
                    helperText={
                      error ? 'Please enter a 2 digit number <60' : ''
                    }
                    inputProps={{ maxLength: 2 }}
                  />
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item>
                  <Stack
                    justifyContent='center'
                    spacing={2}
                    direction='column'
                    sx={{ mb: 1 }}
                    alignItems='center'
                  >
                    <FormLabel id='demo-radio-buttons-group-label'>
                      Gender
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby='demo-radio-buttons-group-label'
                      defaultValue='male'
                      name='radio-buttons-group'
                    >
                      <FormControlLabel
                        value='female'
                        control={<Radio />}
                        label='Female'
                        disabled={true}
                      />
                      <FormControlLabel
                        value='male'
                        control={<Radio />}
                        label='Male'
                      />
                    </RadioGroup>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12}>
                <Item>
                  Push-Ups Slider
                  <Stack
                    justifyContent='center'
                    spacing={2}
                    direction='row'
                    sx={{ mb: 1 }}
                    alignItems='left'
                  >
                    <AccessibilityNewIcon style={{ margin: '0 3vw' }} />
                    <Slider
                      defaultValue={50}
                      aria-label='Default'
                      valueLabelDisplay='auto'
                      style={{ width: '50vw' }}
                      onChange={handleSliderPushUpChange}
                      min={1}
                      max={60}
                      value={sliderValuePU || 0}
                    />
                    <Typography style={{ width: '20px', margin: '0 3vw' }}>
                      Reps:{`\n${sliderValuePU || ''}`}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12}>
                <Item>
                  Sit-Ups Slider
                  <Stack
                    justifyContent='center'
                    spacing={2}
                    direction='row'
                    sx={{ mb: 1 }}
                    alignItems='left'
                  >
                    <AirlineSeatLegroomReducedIcon
                      style={{ margin: '0 3vw' }}
                    />
                    <Slider
                      defaultValue={50}
                      aria-label='Default'
                      valueLabelDisplay='auto'
                      style={{ width: '50vw' }}
                      onChange={handleSliderSitUpChange}
                      min={1}
                      max={60}
                      value={sliderSitUp || 0}
                    />
                    <Typography style={{ width: '20px', margin: '0 3vw' }}>
                      Reps:{`\n${sliderSitUp || ''}`}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12}>
                <Item>
                  2.4km Slider
                  <Stack
                    justifyContent='center'
                    spacing={2}
                    direction='row'
                    sx={{ mb: 1 }}
                    alignItems='left'
                  >
                    <AccessAlarmIcon
                      style={{ width: '20px', margin: '0 3vw' }}
                    />
                    <Slider
                      defaultValue={600}
                      aria-label='Default'
                      valueLabelDisplay='auto'
                      style={{ width: '50vw' }}
                      onChange={handleSliderRunChange}
                      min={500}
                      max={1100}
                      value={sliderRun || 0}
                    />
                    <Typography style={{ width: '20px', margin: '0 3vw' }}>
                      Time:{`\n${sliderRun ? formatTime(sliderRun) : ''}`}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </FormControl>
      </form>
    </div>
  );
}
