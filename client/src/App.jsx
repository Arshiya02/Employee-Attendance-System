import React, { useState } from 'react';
import './App.css';

const API_URL = 'https://employee-attendance-system-production.up.railway.app/api';

function App() {
  const [message, setMessage] = useState('Loading...');

  React.useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setMessage('Backend Connected!'))
      .catch(err => setMessage('Backend Failed: ' + err.message));
  }, []);

  return (
    <div className="App">
      <h1>Employee Attendance System</h1>
      <p>Status: {message}</p>
      <p>API: {API_URL}</p>
    </div>
  );
}

export default App;
