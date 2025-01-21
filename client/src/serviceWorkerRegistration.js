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
                // New content is available, but won't be used until all tabs are closed
                console.log('New content is available; please refresh.');
              }
            });
          });
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });

      // Handle updates across tabs/windows
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (window.refreshing) return;
        window.location.reload();
        window.refreshing = true;
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