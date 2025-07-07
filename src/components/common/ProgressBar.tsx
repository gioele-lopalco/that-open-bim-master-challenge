import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  showLabel = true,
  color = 'var(--success)'
}) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${progress}%`,
            backgroundColor: color
          }}
        />
      </div>
      {showLabel && (
        <span className="progress-label">{progress}%</span>
      )}
    </div>
  );
};

export default ProgressBar; 