import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import BottomNavi from "./components/BottomNavi";
//routes
import Calculator from "./components/Calculator.js";

const App = () => {
  return (
    <BrowserRouter>
        <div className="App">
          <ResponsiveAppBar/>
          <BottomNavi/>
          <div>
            <Routes>
              <Route exact path="/" element={<Calculator />} />
            </Routes>
          </div>
          
        </div>
    </BrowserRouter>
  );
};

export default App;
