import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      {/* Toast notifications container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            fontSize: '0.875rem',
            fontFamily: 'sans-serif',
          },
        }}
      />
      
      {/* Application Routing */}
      <AppRoutes />
    </>
  );
}

export default App;
