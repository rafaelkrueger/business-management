import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react'
import Auth from './components/auth/index.tsx';
import Dashboard from './pages/Dashboard/dashboard.tsx';


const App: React.FC = () => {

  return (
    <div style={{zoom:'0.9'}}>
      <BrowserRouter>
        <Routes>
          <Route
          path="/"
          element={<Auth/>}
          />
          </Routes>
          <Routes>
          <Route
          path="/dashboard"
          element={<Dashboard/>}
          />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;