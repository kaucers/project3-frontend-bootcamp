import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResponsiveAppBar2 from './components/ResponsiveAppBar2';
import BottomNavi from './components/BottomNavi';
//routes
import Calculator from './components/Calculator.js';
import Entry from './components/Entry.js';
import Graph from './components/Graph.js';
import AuthCheck from './components/AuthCheck';
import PoseProcessing from './components/Vision3';

// import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      {console.log(
        'ArmyFit360 © 2023 Dexter Chew, Karina. All rights reserved.'
      )}
      <div className='App'>
        <ResponsiveAppBar2 />
        <BottomNavi />

        <div>
          <Routes>
            <Route exact path='/' element={<Calculator />} />
            <Route exact path='/entry' element={<Entry />} />
            <Route exact path='/graph' element={<Graph />} />
            <Route exact path='/vision' element={<PoseProcessing />} />
            <Route path='/auth-check' element={<AuthCheck />} />
            <Route path='/vision' element={<PoseProcessing />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
