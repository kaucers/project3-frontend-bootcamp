import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Snackbar } from '@mui/material';

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Button
        sx={{ my: 2, color: 'white', display: 'block' }}
        onClick={handleLogin}
      >
        Log In
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
    </>
  );
};

export default Login;
