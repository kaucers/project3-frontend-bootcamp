// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { Auth0Provider } from '@auth0/auth0-react';

// const root = createRoot(document.getElementById('root'));

// root.render(
//   <Auth0Provider
//     domain={process.env.REACT_APP_API_DOMAIN}
//     clientId={process.env.REACT_APP_API_CLIENT_ID}
//     authorizationParams={{
//       redirect_uri: window.location.origin,
//       // audience: process.env.REACT_APP_API_AUDIENCE,
//     }}
//   >
//     <App />
//   </Auth0Provider>
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import axios from 'axios';

const root = createRoot(document.getElementById('root'));

axios.interceptors.request.use((config)=>{
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
},(errors)=>{});

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_API_DOMAIN}
    clientId={process.env.REACT_APP_API_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin+"/auth-check",
      audience:process.env.REACT_APP_API_AUDIENCE
    }}
    scope="openid profile email"
  >
    <App />
  </Auth0Provider>
);
