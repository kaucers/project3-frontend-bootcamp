import * as React from 'react';
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
        <BottomNavigationAction label="Goal" icon={<SportsScoreIcon />} />
        <BottomNavigationAction label="Daily Entry" icon={<DescriptionIcon />} />
        <BottomNavigationAction label="Performance" icon={<AutoGraphIcon />} />
      </BottomNavigation>
    </Box>
    </footer>
  );
}