import React, { useState } from 'react';
import './App.css';
// import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import ResponsiveAppBar from './components/ResponsiveAppBar';
import ResponsiveAppBar2 from './components/ResponsiveAppBar2';
import BottomNavi from './components/BottomNavi';
//routes
import Calculator from './components/Calculator.js';
import Entry from './components/Entry.js';
import Graph from './components/Graph.js';
import AuthCheck from './components/AuthCheck';
// import Vision from './components/Vision';
// import WebcamImageProcessing from './components/Vision2';
import PoseProcessing from './components/Vision3';

import { useAuth0, getAccessTokenSilently } from '@auth0/auth0-react';

// import Footer from "./components/Footer";

const App = () => {
  // const { isAuthenticated, logout, user } = useAuth0();
  // console.log(user);

  // // pass as props to all other components (Entry, Graph) that will make API calls which requires user auth
  // const accessToken = await {
  //   audience: process.env.REACT_APP_API_AUDIENCE,
  //   scope: user.sub, // UUID
  // };

  return (
    <BrowserRouter>
      {console.log(
        'ArmyFit360 © 2023 Dexter Chew, Karina. All rights reserved.'
      )}
      <div className='App'>
        {/* <ResponsiveAppBar /> */}
        <ResponsiveAppBar2 />
        <BottomNavi />

        <div>
          <Routes>
            <Route exact path='/' element={<Calculator />} />
            <Route exact path='/entry' element={<Entry />} />
            <Route exact path='/graph' element={<Graph />} />
            <Route path='/auth-check' element={<AuthCheck />} />
            <Route path='/vision' element={<PoseProcessing />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );

  // return (
  //   <Auth0Provider
  //     domain={process.env.REACT_APP_API_DOMAIN}
  //     clientId={process.env.REACT_APP_API_CLIENT_ID}
  //     authorizationParams={{
  //       redirect_uri: window.location.origin,
  //       audience: process.env.REACT_APP_API_AUDIENCE,
  //     }}
  //   >
  //     <BrowserRouter>
  //       {console.log(
  //         'ArmyFit360 © 2023 Dexter Chew, Karina. All rights reserved.'
  //       )}
  //       <div className='App'>
  //         <ResponsiveAppBar />
  //         <BottomNavi />

  //         <button
  //           onClick={() => {
  //             console.log('clicked');
  //             loginWithRedirect();
  //           }}
  //         >
  //           Log In
  //         </button>

  //         <div>
  //           <Routes>
  //             <Route exact path='/' element={<Calculator />} />
  //             <Route exact path='/entry' element={<Entry />} />
  //             <Route exact path='/graph' element={<Graph />} />
  //             <Route path='/auth-check' element={<AuthCheck />} />
  //             <Route path='/vision' element={<PoseProcessing />} />
  //           </Routes>
  //         </div>
  //       </div>
  //     </BrowserRouter>
  //   </Auth0Provider>
  // );
};

export default App;
