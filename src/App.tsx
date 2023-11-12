import React from 'react';
import './App.css';
import CalendarSummary from './CalendarSummary/CalendarSummary';

function App() {
  return (
    <div className="App" style={{ maxWidth: '1000px', margin: 'auto', padding: "0 1rem" }}>
      <CalendarSummary />
    </div>
  );
}

export default App;
