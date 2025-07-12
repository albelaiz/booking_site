import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
const TestApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Test App - If you see this, React is working!</h1>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<TestApp />);
