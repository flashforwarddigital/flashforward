import React from 'react';

interface StatsPageProps {
  onContinue: () => void;
}

const StatsPage: React.FC<StatsPageProps> = ({ onContinue }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white', // Or a color that fits your modern site style
      color: 'black', // Or a color that fits your modern site style
      padding: '20px'
    }}>
      <h2>Stats Page</h2>
      <p>This is a placeholder stats page.</p>
      <div style={{ flexGrow: 1 }}></div> {/* Spacer to push button to the bottom */}
      <button 
        className="win95-button" // Using win95 button style for now, can be changed
        onClick={onContinue}
        style={{ marginTop: '20px' }}
      >
        Continue to Modern Site
      </button>
    </div>
  );
};

export default StatsPage; 