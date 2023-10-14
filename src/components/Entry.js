import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AirlineSeatLegroomReducedIcon from '@mui/icons-material/AirlineSeatLegroomReduced';
import { Slider, Typography, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import BACKEND_URL from './constant';

// Timer
import Timer from './Timer.js';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '80%',
  color: theme.palette.text.secondary,
}));

const ItemTarget = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFD700', // Yellow background color
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '80%',
  color: theme.palette.text.secondary,
}));

const TitleHead = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '80%',
  color: theme.palette.text.secondary,
  boxShadow: 'none', // Remove the lower edge shadow
}));

export default function Entry() {
  const [sliderValuePU, setSliderValuePU] = useState(30);
  const [sliderSitUp, setsSliderSitUp] = useState(30);
  const [sliderRun, setsSliderRun] = useState(750);
  const [currentAge, setCurrentAge] = useState(20); // Initial age value
  const [error, setError] = useState(false);

  // Target Values
  const [targetPu, setTargetPu] = useState(30);
  const [targetSitUp, setsTargetSitUp] = useState(30);
  const [targetRun, setsTargetRun] = useState(750);
  const [userId, setUserId] = useState(null);

  // Setting Training Schedule
  const [userTarget, setUserTarget] = useState(null);
  const [userHistory, setUserHistory] = useState(null);
  // Display Points
  const [pointsSitUp, setpointsSitUp] = useState(0);
  const [pointsRun, setpointsRun] = useState(0);
  const [pointsPushUp, setpointsPushUp] = useState(0);
  const [award, setAward] = useState('Work Harder');
  const [testDate, setTestDate] = useState(null);
  const [userEmail, setUserEmail] = useState('dexterchewxh@hotmail.sg'); //to change when deployed

  const [userDataFetched, setUserDataFetched] = useState(false); //track user data fetched before updating via slider

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
    const inputValue = event.target.value;

    console.log('inputValue', inputValue);

    // Check if the input value is a valid number between 22 and 60
    if (/^\d+$/.test(inputValue) && inputValue >= 15 && inputValue <= 60) {
      setError(false);
      setCurrentAge(inputValue);
    } else {
      setError(true);
      setCurrentAge(inputValue);
    }
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}min:${Math.round(formattedSeconds)}s`;
  }

  function calculateDaysRemaining(currentDate, testDate) {
    if (testDate) {
      //if there is testDate
      // Calculate the time difference in milliseconds
      const timeDifference = testDate - currentDate;
      // Calculate the number of days remaining (1 day = 24 hours = 86400000 milliseconds)
      const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      return daysRemaining;
    } else {
      return null;
    }
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
      return 'No Award'; // You can customize this message as needed
    }
  }

  function getFormattedDate() {
    // Create a new Date object to get the current date
    const currentDate = new Date();
    // Get the day of the week (e.g., "Monday")
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'short' });
    // Get the month (e.g., "September")
    const month = currentDate.toLocaleString('en-US', { month: 'short' });
    // Get the day of the month (e.g., 12)
    const dayOfMonth = currentDate.getDate();
    // Get the year (e.g., 2023)
    const year = currentDate.getFullYear();
    // Create a formatted string for display
    const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;

    return formattedDate;
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

  // Create an array of objects with keys:
  function getDailyTargets(
    userHistory,
    testTarget,
    testDate,
    recoveryDays = 1,
    excerciseType
  ) {
    // Create an array to store the workout plan
    const workoutPlan = [];

    if (userHistory) {
      // Initialize variables to store the latest and second latest entries
      let latestEntry = null;
      let secondLatestEntry = null;

      // Iterate through the userHistory array
      userHistory.forEach((entry) => {
        const entryDate = new Date(entry.date);

        if (!latestEntry || entryDate > new Date(latestEntry.date)) {
          // If no latest entry or the current entry is more recent than the latest,
          // update the second latest entry to the current latest entry,
          // and update the latest entry to the current entry.
          secondLatestEntry = latestEntry;
          latestEntry = entry;
        }
      });

      // Calculate the remaining days until the testDate
      const currentDate = new Date();
      const daysUntilTest = Math.ceil(
        (new Date(testDate) - currentDate) / (1000 * 60 * 60 * 24)
      );

      // Calculate the initial exercise target increment
      const dailyIncrement = Math.ceil(
        (testTarget - secondLatestEntry[excerciseType]) / daysUntilTest
      );

      // Initialize the current exercise count with the latest entry
      let currentExerciseCount = secondLatestEntry[excerciseType];

      // Loop through each day leading up to the testDate
      for (let i = 0; i < daysUntilTest; i++) {
        const currentDateCopy = new Date(currentDate);
        currentDateCopy.setDate(currentDate.getDate() + i);

        // Check if it's a recovery day (e.g., every 'recoveryDays' days)
        const isRecoveryDay = (i + 1) % recoveryDays === 0;
        // console.log(isRecoveryDay)

        // Calculate the exercise target for the current date
        // Once reached target
        let exerciseTargetForDate = isRecoveryDay
          ? currentExerciseCount // Maintain the same target as the previous day on recovery days
          : currentExerciseCount + dailyIncrement * (recoveryDays / 3);

        if (currentExerciseCount >= testTarget && excerciseType !== 'run') {
          //if target not met, increase
          exerciseTargetForDate = testTarget + dailyIncrement;
        } else if (
          currentExerciseCount <= testTarget &&
          excerciseType === 'run'
        ) {
          exerciseTargetForDate = testTarget - dailyIncrement;
        }

        // Create an object for the workout plan for the current date
        const workoutPlanEntry = {
          date: currentDateCopy.toLocaleDateString(),
          exerciseTarget: exerciseTargetForDate,
        };

        // Add the workout plan entry to the array
        workoutPlan.push(workoutPlanEntry);

        // Update the current exercise count for the next day
        currentExerciseCount = exerciseTargetForDate;
      }

      return workoutPlan;
    }
  }

  // Define the useEffect hook
  useEffect(() => {
    // Function to make the axios request and get user perf history
    const fetchUserHistory = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/history`, {
          params: {
            email: userEmail,
          },
        });
        // console.log(response);
        if (res.status === 200) {
          setUserHistory(res.data);
          // Use reduce to find the object with the latest date
          const latestObject = res.data.reduce((latest, current) => {
            const latestDate = new Date(latest.date);
            const currentDate = new Date(current.date);
            return currentDate > latestDate ? current : latest;
          }, res.data[0]); // Initialize with the first object as the starting point
          setSliderValuePU(latestObject.push_up);
          setsSliderSitUp(latestObject.sit_up);
          setsSliderRun(latestObject.run);

          console.log(`Historical: ${JSON.stringify(res.data)}`);
        } else {
          console.error('Invalid response data format');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function when dependencies change
    fetchUserHistory();
  }, [userEmail]); // Dependencies: trigger when these states change

  // Get user achievemnets:
  useEffect(() => {
    // Function to make the axios request and get user perf history
    const fetchUserAchievements = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/userachievement`, {
          params: {
            email: userEmail,
          },
        });
        // console.log(response);
        if (res.status === 200) {
          setAward(res.data);

          console.log(`Historical: ${JSON.stringify(res.data)}`);
        } else {
          console.error('Invalid response data format');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the function when dependencies change
    fetchUserAchievements();
  }, [userEmail]); // Dependencies: trigger when these states change

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
        // console.log(`3 Elemens: ${JSON.stringify(response)}`)
      } else {
        console.error('Invalid response data format');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to fetch exercise data based on user's email
  const fetchTargetData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/target?email=${userEmail}`);

      if (res.status === 200) {
        // console.log(`Data: ${JSON.stringify(res.data.tbl_target_pefs[0].end_date)}`)
        setUserTarget(res.data.tbl_target_pefs[0]);
        setTestDate(new Date(res.data.tbl_target_pefs[0].end_date));
        setUserId(res.data.id); //sets the UserId
        // Access end_date from the first target performance record
        // setTestDate(res.data[0].tbl_target_pefs[0].end_date);
        setCurrentAge(calculateAge(res.data.birthday));
        // console.log("Fetched User Data")
      } else {
        console.error('Failed to fetch exercise data.');
      }
    } catch (error) {
      console.error('Error fetching exercise data:', error);
    }
  };

  // Define the useEffect hook
  useEffect(() => {
    // Call the function when dependencies change
    fetchDataAndSetPoints();
  }, [sliderValuePU, sliderSitUp, sliderRun, currentAge]); // Dependencies: trigger when these states change

  // Define the useEffect hook
  useEffect(() => {
    // Function to make the axios POST request to entry tbl_current_pefs
    if (userHistory !== null && userTarget !== null) {
      const updateDailyTarget = async () => {
        try {
          const response = await axios.post(`${BACKEND_URL}/daily`, {
            sit_up: sliderSitUp,
            push_up: sliderValuePU,
            run: sliderRun,
            date: new Date(), // Today's date (indepdent on frontend)
            user_id: userId,
          });

          // Check for a successful response (you might need to adjust this condition)
          if (response.status === 200) {
            console.log('Successful Entry!');
          } else {
            console.error('Invalid response data format');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      // Call the function when dependencies change
      updateDailyTarget();
    }
  }, [sliderValuePU, sliderSitUp, sliderRun, currentAge, userId, userHistory]); // Dependencies: trigger when these states change

  useEffect(() => {
    if (!userEmail) return;
    // Fetch exercise data when userEmail state changes
    fetchTargetData();
  }, [userEmail]);

  useEffect(() => {
    // Function to fetch exercise data based on user's email
    if (userHistory !== null && userTarget !== null) {
      // Both data and targetData are loaded
      // You can perform your post-processing here
      setsTargetSitUp(
        getDailyTargets(
          userHistory,
          userTarget.sit_up,
          testDate,
          3,
          'sit_up'
        )[0].exerciseTarget
      );
      setTargetPu(
        getDailyTargets(
          userHistory,
          userTarget.push_up,
          testDate,
          3,
          'push_up'
        )[0].exerciseTarget
      );
      setsTargetRun(
        getDailyTargets(userHistory, userTarget.run, testDate, 5, 'run')[0]
          .exerciseTarget
      );
    }
    console.log(
      `Training Data: ${userHistory !== null && userTarget !== null}`
    );
  }, [userHistory, userTarget, testDate]);

  return (
    <div className='entry'>
      <FormControl>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0} direction='column'>
            <div className='offset'>
              <Alert
                sx={{ width: '50vw', textAlign: 'center' }}
                severity='info'
              >
                Autosave: You may edit your achievements by 23:59. The system
                will deny entry entry at the end of the day.
              </Alert>
            </div>

            <Grid
              className='offset'
              container
              spacing={0}
              direction='row'
              sx={{ width: '50vw' }} // Set the total width of the container
            >
              <Grid item xs={4}>
                <TitleHead>
                  <Typography variant='body1'>Today</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h5'>{getFormattedDate()}</Typography>
                </TitleHead>
              </Grid>
              <Grid item xs={4}>
                <TitleHead>
                  <Typography variant='body1'>Achievements</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h5'>{award}</Typography>
                </TitleHead>
              </Grid>
              <Grid item xs={4}>
                <TitleHead>
                  <Typography variant='body1'>Days Remaining</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h5'>
                    {calculateDaysRemaining(new Date(), testDate)}
                  </Typography>
                </TitleHead>
              </Grid>
            </Grid>

            <div className='offset'>
              <Timer />
            </div>

            <Grid
              className='data-container'
              container
              spacing={0}
              direction='row'
              sx={{ width: '50vw' }} // Set the total width of the container
            >
              <Grid item xs={12}>
                <Item>
                  <Typography variant='body1'>Today's Performance</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{calculateAwardType()}</Typography>
                </Item>
              </Grid>
            </Grid>

            {/* PUSH UP ROW */}
            <Grid
              className='data-container'
              container
              spacing={0}
              direction='row'
              sx={{ width: '50vw' }} // Set the total width of the container
            >
              <Grid item xs={8}>
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
                      defaultValue={targetPu}
                      aria-label='Default'
                      valueLabelDisplay='auto'
                      style={{ width: '50vw' }}
                      onChange={handleSliderPushUpChange}
                      min={1}
                      max={60}
                    />
                    <Typography style={{ width: '20px', margin: '0 3vw' }}>
                      Points:{`\n${pointsPushUp}`}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <Item>
                  <Typography variant='body1'>Push-Up Reps</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{sliderValuePU}</Typography>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <ItemTarget>
                  <Typography variant='body1'>Today's Target</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{targetPu}</Typography>
                </ItemTarget>
              </Grid>
            </Grid>

            {/* SIT UP ROW */}

            <Grid
              className='data-container'
              container
              spacing={0}
              direction='row'
              sx={{ width: '50vw' }} // Set the total width of the container
            >
              <Grid item xs={8}>
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
                      defaultValue={targetSitUp}
                      aria-label='Default'
                      valueLabelDisplay='auto'
                      style={{ width: '50vw' }}
                      onChange={handleSliderSitUpChange}
                      min={1}
                      max={60}
                    />
                    <Typography style={{ width: '20px', margin: '0 3vw' }}>
                      Points:{`\n${pointsSitUp}`}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <Item>
                  <Typography variant='body1'>Sit-Up Reps</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{sliderSitUp}</Typography>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <ItemTarget>
                  <Typography variant='body1'>Today's Target</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h3'>{targetSitUp}</Typography>
                </ItemTarget>
              </Grid>
            </Grid>

            {/* RUNNING ROW */}
            <Grid
              className='data-container'
              container
              spacing={0}
              direction='row'
              sx={{ width: '50vw' }} // Set the total width of the container
            >
              <Grid item xs={8}>
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
                      defaultValue={targetRun}
                      aria-label='Default'
                      valueLabelDisplay='auto'
                      style={{ width: '50vw' }}
                      onChange={handleSliderRunChange}
                      min={500}
                      max={1100}
                    />
                    <Typography style={{ width: '20px', margin: '0 3vw' }}>
                      Points:{`\n${pointsRun}`}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <Item>
                  <Typography variant='body1'>Running Time</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h5'>{formatTime(sliderRun)}</Typography>
                </Item>
              </Grid>

              <Grid item xs={2}>
                <ItemTarget>
                  <Typography variant='body1'>Today's Target</Typography>
                  <Divider variant='middle' />
                  <Typography variant='h5'>{formatTime(targetRun)}</Typography>
                </ItemTarget>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </FormControl>
    </div>
  );
}
