import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpaceScene from './pages/SpaceScene/SpaceScene';
import DAOMember from './pages/DAOMember/DAOMember';
import Landing from './pages/Landing/Landing';
import Dashboard from "./pages/Dashboard/Dashboard";
import Header from "./pages/Header/Header";
import './App.css'

function App() {
  return (
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/member" element={<DAOMember />} />
            <Route path="/bounty" element={<SpaceScene />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
