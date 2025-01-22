import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isPWA, getPWAUser } from '../utils/pwaUtils';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  
  // Check both regular auth and PWA auth
  const isPWAAuthenticated = isPWA() && localStorage.getItem('isPWAAuthenticated') === 'true' && getPWAUser();
  
  if (!isLoggedIn && !isPWAAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 