import React from 'react';
import './App.css';

const App = () => {
  const [message, setMessage] = React.useState('Loading...');
  const API_URL = 'https://employee-attendance-system-production.up.railway.app/api';
  
  React.useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setMessage('Backend Connected!'))
      .catch((err) => setMessage('Backend Failed: ' + err.message));
  }, []);
  
  return React.createElement('div', { className: 'App' },
    React.createElement('h1', null, 'Employee Attendance System'),
    React.createElement('p', null, 'Status: ', message),
    React.createElement('p', null, 'API: ', API_URL)
  );
};

export default App;
