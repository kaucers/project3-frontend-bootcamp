import * as React from 'react';
import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BACKEND_URL from './constant';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './Login';

const pages = ['About', 'Contact Us'];

function ResponsiveAppBar2() {
  const [anchorElNav, setAnchorElNav] = useState();
  const [anchorElUser, setAnchorElUser] = useState();
  const { isAuthenticated, logout, user } = useAuth0();
  const [userEmail, setUserEmail] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [currentFormattedTime, setCurrentFormattedTime] = useState('');
  // console.log('isAuthenticated :>> ', isAuthenticated);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    // Function to fetch exercise data based on user's email
    const fetchTargetData = async () => {
      try {
        if (user?.email) {
          const res = await axios.get(
            `${BACKEND_URL}/target?email=${user?.email}`
          );

          if (res.status === 200) {
            // console.log(`Data: ${JSON.stringify(res.data.tbl_target_pefs[0].end_date)}`)
            setUserFirstName(res.data.first_name); //sets the user first name
            setUserLastName(res.data.last_name); //sets the user last name
            // console.log("Fetched User Data")
          } else {
            console.error('Failed to fetch exercise data.');
          }
        }
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    if (user?.email) {
      // Fetch exercise data when userEmail state changes
      fetchTargetData();
    }
  }, [user?.email]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      setCurrentFormattedTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update the current time initially and every second
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  // console.log('userFirstName :>> ', userFirstName);

  return (
    <AppBar position='static'>
      {/* {console.log(user)} */}
      {/* {console.log(JSON.stringify(currentUser))}
      {console.log(currentUser?.photoURL)} */}
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <FitnessCenterIcon
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ArmyFit360
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <FitnessCenterIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ArmyFit360
          </Typography>
          {!isAuthenticated && (
            <Button
              component={Login}
              to='/login'
              sx={{
                my: 2,
                color: 'white',
                display: 'block',
              }}
            >
              Login
            </Button>
          )}

          {isAuthenticated && (
            <Button
              onClick={() => {
                logout({ returnTo: window.location.origin });
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Sign Out
            </Button>
          )}

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user?.email && (
              <>
                <Typography variant='h6' textAlign='right'>
                  {`Time: ${currentFormattedTime}`}
                </Typography>
                <Typography variant='body1' textAlign='right'>
                  {/* {`welcome back, ${userFirstName} ${userLastName}`} */}
                  {`Welcome Back, ${user.first_name} ${user.last_name}`}
                </Typography>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar2;
