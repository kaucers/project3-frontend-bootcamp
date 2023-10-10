import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import ResponsiveAppBar2 from "./components/ResponsiveAppBar2";
import BottomNavi from "./components/BottomNavi";
//routes
import Calculator from "./components/Calculator.js";
import Entry from "./components/Entry.js";
import Graph from "./components/Graph.js";
import AuthCheck from "./components/AuthCheck";
import Vision from "./components/Vision";
// import WebcamImageProcessing from "./components/Vision2"

// import Footer from "./components/Footer";
import { Auth0Provider } from "@auth0/auth0-react";

const App = () => {


  return (
    <Auth0Provider //Wrapping through the same client
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    audience={process.env.AUDIENCE}
    scope="read:current_user update:current_user_metadata"
  >
    <BrowserRouter>
    {console.log("ArmyFit360 © 2023 Dexter Chew, Karina. All rights reserved.")}
        <div className="App">
          <ResponsiveAppBar/>
          <BottomNavi/>
          <div>
            <Routes>
              <Route exact path="/" element={<Calculator />} />
              <Route exact path="/entry" element={<Entry />} />
              <Route exact path="/graph" element={<Graph />} />
              <Route path='/auth-check' element={<AuthCheck />} />
              <Route path='/vision' element={<Vision />} />
            </Routes>
          </div>
          
        </div>
    </BrowserRouter>
    </Auth0Provider>
  );
};

export default App;
