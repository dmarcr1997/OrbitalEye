import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpaceScene from './pages/SpaceScene/SpaceScene';
import DAOMember from './pages/DAOMember/DAOMember';
import Landing from './pages/Landing/Landing';
import Dashboard from "./pages/Dashboard/Dashboard";
import Header from "./pages/Header/Header";
import './App.css'
import { useState } from "react";
import { NEODataObject } from "./models/INEODataObject";

function App() {
  const [asteroidsArray, setAsteroidsArray] = useState()
  
  async function modifyAsteroidsArray(asteroids: any){
    setAsteroidsArray(asteroids);
  }

  return (
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/member" element={<DAOMember />} />
            <Route path="/bounty" element={<SpaceScene asteroids={asteroidsArray}/>} />
            <Route path="/dashboard" element={<Dashboard setAstroids={modifyAsteroidsArray}/>} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
