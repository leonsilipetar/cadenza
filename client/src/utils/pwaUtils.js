export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone || 
         document.referrer.includes('android-app://');
};

export const setPWAUser = (userData) => {
  localStorage.setItem('pwa_user', JSON.stringify(userData));
  localStorage.setItem('isPWAAuthenticated', 'true');
};

export const clearPWAUser = () => {
  localStorage.removeItem('pwa_user');
  localStorage.removeItem('isPWAAuthenticated');
};

export const getPWAUser = () => {
  return JSON.parse(localStorage.getItem('pwa_user'));
}; 