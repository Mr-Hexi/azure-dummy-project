import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // Determine backend URL, default to localhost for development
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"
    
    fetch(`${backendUrl}/api/status/`)
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage("Error connecting to backend: " + error.message))
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Azure Deployment Test</h1>
      
      <div className="card" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3>Backend Response:</h3>
        <p style={{ color: '#646cff', fontWeight: 'bold', fontSize: '1.2rem' }}>{message}</p>
      </div>
    </>
  )
}

export default App
