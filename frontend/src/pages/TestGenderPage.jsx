import React from 'react';

const TestGenderPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F2EC',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      color: '#563C26'
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Gender Selection Test</h1>
      <p style={{ marginBottom: '40px' }}>This is a simplified test page for route debugging</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        width: '100%',
        maxWidth: '500px'
      }}>
        <button style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: 'none'
        }}>
          Male
        </button>
        <button style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: 'none'
        }}>
          Female
        </button>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <button style={{
          padding: '10px 30px',
          backgroundColor: '#563C26',
          color: 'white',
          borderRadius: '8px',
          border: 'none'
        }}>
          Continue →
        </button>
      </div>
    </div>
  );
};

export default TestGenderPage;
