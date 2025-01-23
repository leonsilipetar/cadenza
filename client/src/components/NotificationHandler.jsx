import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { requestNotificationPermission, onMessageListener } from '../services/firebaseMessaging';
import { Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationHandler = () => {
  const [notification, setNotification] = useState(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const requestPermission = async () => {
    try {
      await requestNotificationPermission();
      setPermissionRequested(true);
      // Hide the button after successful permission
      localStorage.setItem('notificationPermissionRequested', 'true');
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      toast.error('Nije moguće omogućiti obavijesti. Pokušajte ponovno kasnije.');
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification-sound.mp3'); // Add this sound file to public folder
    audio.play().catch(error => console.log('Error playing sound:', error));
  };

  useEffect(() => {
    // Check if permission was previously granted
    const wasRequested = localStorage.getItem('notificationPermissionRequested') === 'true';
    if (wasRequested) {
      setPermissionRequested(true);
    }

    // Listen for foreground messages only if permission was granted
    if (Notification.permission === 'granted') {
      const setupMessageListener = async () => {
        try {
          const unsubscribePromise = onMessageListener();
          const payload = await unsubscribePromise;
          
          setNotification(payload);
          playNotificationSound(); // Add sound
          
          toast.info(payload.notification.body, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setupMessageListener(); // Set up next listener
        } catch (err) {
          console.error('Failed to receive foreground message:', err);
        }
      };

      setupMessageListener();
    }
  }, [permissionRequested]);

  // Don't show the button if permission was already requested
  if (permissionRequested || Notification.permission === 'granted') {
    return null;
  }

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<NotificationsIcon />}
      onClick={requestPermission}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      Omogući obavijesti
    </Button>
  );
};

export default NotificationHandler; 