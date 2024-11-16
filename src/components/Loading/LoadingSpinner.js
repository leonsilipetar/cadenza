import './LoadingSpinner.css';

export const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const spinnerClass = `spinner ${size} ${fullScreen ? 'fullscreen' : ''}`;
  
  return (
    <div className={spinnerClass} role="status">
      <div className="spinner-inner"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}; 