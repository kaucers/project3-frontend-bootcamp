import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//routes
import Calculator from "./components/Calculator.js";

const App = () => {
  return (
    <BrowserRouter>
        <div className="App">
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
