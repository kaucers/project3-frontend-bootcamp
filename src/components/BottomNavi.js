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

  return (
    <footer className="footer-container">
    <Box sx={{ width: 300 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
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
      </BottomNavigation>
    </Box>
    </footer>
  );
}