import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react'
import Auth from './components/auth/index.tsx';
import Dashboard from './pages/Dashboard/dashboard.tsx';
import 'react-quill/dist/quill.snow.css';


const App: React.FC = () => {

  return (
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
  );
}

export default App;