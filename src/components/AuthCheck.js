import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import BACKEND_URL from './constant';

const AuthCheck = () => {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
    user,
  } = useAuth0();
  const [flag, setFlag] = useState(false);
  //Extract "user" details from here

  useEffect(() => {
    (async () => {
      // Retrieve access token
      const accessToken = await getAccessTokenSilently({
        audience: process.env.AUDIENCE,
        scope: 'read:current_user',
      });
      // console.log(JSON.stringify(accessToken));
      localStorage.setItem('token', accessToken);
      if (!isLoading) {
        console.log({ isAuthenticated, isLoading });
        if (isAuthenticated) {
          console.log({ user, isLoading });
          const response = await axios.post(`${BACKEND_URL}/checkUser`, {
            user,
          });
        }
        if (!flag) setFlag(true);
        return <Navigate replace to='/profile' />;
      }
    })();
  }, [isLoading, isAuthenticated, getAccessTokenSilently, flag, user]);

  if (flag) {
    return <Navigate replace to='/' />;
  }
};

export default AuthCheck;
