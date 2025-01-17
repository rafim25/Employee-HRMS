import React, { useState, useEffect } from 'react'
import { Routes } from './config';
import { AuthProvider } from './context/AuthContext';


function App() {
  const [loading, setLoading] = useState(true)

  const preloader = document.getElementById('preloader')

  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none'
      setLoading(false)
    }, 2000);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])
  return (
    !loading && (
      // <Provider store={store}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    )
  )
}

export default App;
