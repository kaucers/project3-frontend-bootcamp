import * as React from 'react';
import { useState, useEffect } from "react";
import {Typography, Stack, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import BACKEND_URL from './constant';
import Paper from '@mui/material/Paper';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Label, // Import Label from Recharts
  } from 'recharts';



export default function Graph() {
  // Display Points
  const [userEmail,setUserEmail] = useState("dexterchewxh@hotmail.sg"); //to change when deployed
  // Target Sets
  const [targetPu, setTargetPu] = useState(30);
  const [targetSitUp, setsTargetSitUp] = useState(30);
  const [targetRun, setsTargetRun] = useState(750);
  const [testDate, setTestDate] = useState(null);
  const [userTarget, setUserTarget] = useState(null);
  // Graphing States
  const [userHistory, setUserHistory] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState('sit_up'); // Initially selected graph
  // Training Data
  const [userTrainingPu, setUserTrainingPu] = useState(null);
  const [userTrainingSitUp, setUserTrainingSitUp] = useState(null);
  const [userTrainingRun, setUserTrainingRun] = useState(null);

  // Define a function to handle graph button clicks
  const handleGraphClick = (graphName) => {
    setSelectedGraph(graphName);
  };
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    return `${formattedMinutes}min:${Math.round(formattedSeconds)}s`;
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
    
  //convert date to timestamps for numeric arrangement
  function convertDatesToTimestamps(data) {
    if (data!=null){
    return data.map(item => {
      const dateObject = new Date(item.date);
      const timestamp = dateObject.getTime();
      return { ...item, timestamp };
    });
  }
  }

    //convert date to timestamps for numeric arrangement
    function convertDatesToTimestampsSingle(date) {
        const dateObject = new Date(date);
        const timestamp = dateObject.getTime();
        return timestamp;

    }

  function capitalizeWords(str) {
    if (str.includes('_')) {
      return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
        .toUpperCase() 
        ;
    } else {
      return str.toUpperCase() ;
    }
  }


// Create an array of objects with keys: 
function getDailyTargets(userHistory, testTarget, testDate, recoveryDays = 1, excerciseType) {
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
    const daysUntilTest = Math.ceil((new Date(testDate) - currentDate) / (1000 * 60 * 60 * 24));
    console.log(`Days Remaining: ${daysUntilTest}`)

    // Calculate the initial exercise target increment
    const dailyIncrement = Math.ceil((testTarget - secondLatestEntry[excerciseType]) / daysUntilTest);
  
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
      : currentExerciseCount + dailyIncrement*(recoveryDays/3);  

      if (currentExerciseCount >= testTarget && excerciseType!=="run"){ //if target not met, increase
        exerciseTargetForDate = testTarget + dailyIncrement
      }    

      else if ((currentExerciseCount <= testTarget) && (excerciseType ==="run")){
        exerciseTargetForDate = testTarget - dailyIncrement
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
  
  // if (userHistory){
  //   const workoutPlan = getDailyTargets(userHistory, targetSwitch(selectedGraph), testDate,2,"push_up");
  //   console.log(workoutPlan);
  //   console.log(`${targetPu}`)
  // }
   

  // Switching Target 
  function targetSwitch(selectedGraph) {
    // Convert date strings to Date objects
    console.log(`Selected Graph: ${selectedGraph}`)
    if (selectedGraph === 'run'){
      return userTrainingRun
    }
    else if (selectedGraph === 'push_up'){
      return userTrainingPu
    }
    else if (selectedGraph === 'sit_up'){
      return userTrainingSitUp
    }
  }

// Plotting line chart generic for excercises  
function plotLine(data,targetData,xKey,yKey) {
    // Convert date strings to Date objects
    console.log(`User Training: ${JSON.stringify(targetData)}`)
    if (data !== null && targetData !== null){
      console.log(`Plot Data: ${JSON.stringify(data)}`)
        data.forEach((entry) => {
            entry.date = new Date(entry.date).toLocaleDateString();; // Converts 'yyyy-MM-dd' string to Date object
        
        data = convertDatesToTimestamps(data);
        targetData = convertDatesToTimestamps(targetData);
        console.log(targetData);
          });
          // Sort data by timestamps (avoid entry bug)
          data.sort((a, b) => a.timestamp - b.timestamp);

    const customTickFormatter = (value) => {
      // You can add your custom formatting logic here
      // For example, let's prefix each label with "Day "
      return `${new Date(value).toLocaleDateString()}`;
    };
      
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="label">{`Date: ${new Date(label).toLocaleDateString()}`}</p>
            {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${selectedGraph === "run" ? formatTime(entry.value) : entry.value}`}
            </p>
          ))}
          </div>
        );
      }
    
      return null;
    };
   
    
    return (
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={'timestamp'}
            type = "number"
            domain={['auto', 'auto']}
            tickFormatter={customTickFormatter}
            allowDuplicatedCategory={false}
            >       
            {console.log(convertDatesToTimestampsSingle(targetData[targetData.length-1].date))}         
            </XAxis>
          
            <YAxis>
                <Label
                    value= {`${capitalizeWords(yKey)} Performance`} // Your Y-axis label text
                    angle={-90} // Rotate the label text to a vertical position
                    position="insideLeft" // Position the label inside the Y-axis
                    dy={10} // Adjust the label's vertical position as needed
                />
            </YAxis>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine 
          x={convertDatesToTimestampsSingle(targetData[targetData.length-1].date)} 
          stroke="red" 
          strokeDasharray="5 5"
          strokeOpacity={0.5}
          >
                    <Label
              value="Target Deadline"
              position="insideTopRight"
              angle={-90} // Rotate label by -90 degrees
              offset={20} // Add some space between the label and the chart edge
            />
          </ReferenceLine>
          <Line type="monotone" data={data} dataKey={yKey} stroke="#8884d8" name = "Performance" activeDot={{ r: 8 }} />
          <Line type="monotone" data={targetData} dataKey="exerciseTarget" name = "Target" stroke="#82ca9d"/>
          
        </LineChart>
      </ResponsiveContainer>
    );
  }}

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
            setUserHistory(res.data)
          console.log(`Historical: ${JSON.stringify(res.data)}`)
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


  useEffect(() => {
    // Function to fetch exercise data based on user's email
  const fetchTargetData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/target?email=${userEmail}`);

      if (res.status === 200) {
        console.log(`Data: ${JSON.stringify(res.data.tbl_target_pefs[0].end_date)}`)
        console.log(`Data: ${JSON.stringify(res.data.tbl_target_pefs[0].sit_up)}`)
        setUserTarget(res.data.tbl_target_pefs[0])
        setTargetPu(res.data.tbl_target_pefs[0].push_up)
        setsTargetSitUp(res.data.tbl_target_pefs[0].sit_up)
        setsTargetRun(res.data.tbl_target_pefs[0].run)
        setTestDate(new Date(res.data.tbl_target_pefs[0].end_date))
        // Access end_date from the first target performance record
        // setTestDate(res.data[0].tbl_target_pefs[0].end_date);
        console.log("Fetched User Target Data")
       
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

  useEffect(() => {
    // Function to fetch exercise data based on user's email
    if (userHistory !== null && userTarget !== null) {
      // Both data and targetData are loaded
      // You can perform your post-processing here
      setUserTrainingSitUp(getDailyTargets(userHistory, userTarget.sit_up, testDate,3,'sit_up'))
      setUserTrainingPu(getDailyTargets(userHistory, userTarget.push_up, testDate,3,'push_up'))
      setUserTrainingRun(getDailyTargets(userHistory, userTarget.run, testDate,5,'run'))      
    }
    console.log(`Training Data: ${userHistory !== null && userTarget !== null }`)
  }, [userHistory,userTarget,testDate,selectedGraph]);

  return (
<div className="entry">
  <Stack direction="column" alignItems="center">
    <div>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <Button onClick={() => handleGraphClick('sit_up')} variant="outlined" href="#outlined-buttons">
          Sit-Up
        </Button>
        <Button onClick={() => handleGraphClick('push_up')} variant="outlined" href="#outlined-buttons">
          Push-Up
        </Button>
        <Button onClick={() => handleGraphClick('run')} variant="outlined" href="#outlined-buttons">
          Running
        </Button>
      </Stack>
    </div>

    <Paper
          component="div"
          elevation={3}
          sx={{
            width: '90vw',
            maxWidth: { sm: '400px', md: '800px' }, // Adjust widths for different screen sizes
            p: 2, // Padding
            mt: 1, // Margin Top
            mb: 5, // Margin Bottom
          }}
        >
            
        <Typography
        variant="h5"
        sx={{
            mt: 1, // Margin top
            color: 'gray',
        }}
        >
        {`Performance: ${capitalizeWords(selectedGraph)} (${getFormattedDate()})`}
        </Typography>
        {/* Render the selected graph */}
        {plotLine(userHistory, targetSwitch(selectedGraph),"date", selectedGraph)}
        {console.log(userTrainingRun)}
        {console.log(userHistory)}
    </Paper>
  </Stack>
</div>

  );
}