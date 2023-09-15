import React, {useState} from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import BottomNavi from "./components/BottomNavi";
//routes
import Calculator from "./components/Calculator.js";
import Entry from "./components/Entry.js";
import Graph from "./components/Graph.js";

const App = () => {


  return (
    <BrowserRouter>
        <div className="App">
          <ResponsiveAppBar/>
          <BottomNavi/>
          <div>
            <Routes>
              <Route exact path="/" element={<Calculator />} />
              <Route exact path="/entry" element={<Entry />} />
              <Route exact path="/graph" element={<Graph />} />
            </Routes>
          </div>
          
        </div>
    </BrowserRouter>
  );
};

export default App;
