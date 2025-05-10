import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SnackbarProvider } from "notistack";
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.ts';
import 'react-quill/dist/quill.snow.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const ResponsiveSnackbarProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: isMobile ? 'top' : 'bottom',
        horizontal: isMobile ? 'center' : 'left',
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

root.render(
  <React.StrictMode>
    <ResponsiveSnackbarProvider>
      <App />
    </ResponsiveSnackbarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
