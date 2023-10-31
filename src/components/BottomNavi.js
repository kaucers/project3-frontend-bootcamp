import * as React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DescriptionIcon from '@mui/icons-material/Description';

export default function BottomNavi() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    // console.log(newValue)
    // Handle the change in the selected tab
    setValue(newValue);

    // // You can perform other actions based on the selected tab here
    // switch (newValue) {
    //   case 0:
    //     // Do something when the first tab is selected
    //     console.log("Goal Setting")
    //     break;
    //   case 1:
    //     // Do something when the second tab is selected
    //     console.log("Daily Entry")
    //     break;
    //   case 2:
    //     // Do something when the third tab is selected
    //     console.log("Performance")
    //     break;
    //   default:
    //     // Handle other cases
    // }
  };

  return (
    <footer className="footer-container">
    <Box sx={{ width: 300 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}       
        
      >

        <BottomNavigationAction 
        component={Link}
        to="/" 
        label="Goal" 
        icon={<SportsScoreIcon />} 
        />

        <BottomNavigationAction 
        component={Link}
        to="/entry" 
        label="Daily Entry" 
        icon={<DescriptionIcon />} 
        />

        <BottomNavigationAction 
        component={Link}
        to="/graph" 
        label="Performance" 
        icon={<AutoGraphIcon />} 
        />

<BottomNavigationAction 
        component={Link}
        to="/vision" 
        label="Vision" 
        icon={<AutoGraphIcon />} 
        />
      </BottomNavigation>
    </Box>
    </footer>
  );
}