export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/serviceWorker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show notification for new content
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Update Available', {
                    body: 'New content is available. Please refresh to update.',
                    icon: '/Logo192.png'
                  });
                }
              }
            });
          });
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });

      // Handle updates across tabs/windows
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
} 