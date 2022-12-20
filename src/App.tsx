import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import SpaceScene from './components/SpaceScene/SpaceScene';
import DAOMember from './components/DAOMember';
import Landing from './components/Landing/Landing';
import Dashboard from "./components/Dashboard/Dashboard";
import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/member" element={<DAOMember />} />
          <Route path="/bounty" element={<SpaceScene />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
