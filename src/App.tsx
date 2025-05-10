import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react'
import Auth from './components/auth/index.tsx';
import Dashboard from './pages/Dashboard/dashboard.tsx';
import 'react-quill/dist/quill.snow.css';
import MobileAuth from './components/auth/mobile/index.tsx';


const App: React.FC = () => {

  return (
      <BrowserRouter>
        <Routes>
          <Route
          path="/"
          element={window.outerWidth > 600 ? <Auth/> : <MobileAuth/>}
          />
          </Routes>
          <Routes>
          <Route
          path="/dashboard"
          element={<Dashboard/>}
          />
          </Routes>
      </BrowserRouter>
  );
}

export default App;