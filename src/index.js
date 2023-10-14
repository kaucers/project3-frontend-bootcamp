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

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_API_DOMAIN}
    clientId={process.env.REACT_APP_API_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
