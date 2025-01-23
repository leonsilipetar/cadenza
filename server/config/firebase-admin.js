const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    // For production - decode from environment variable
    const decodedServiceAccount = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 
      'base64'
    ).toString();
    serviceAccount = JSON.parse(decodedServiceAccount);
  } else {
    // For local development - use file
    const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account-key.json');
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = require(serviceAccountPath);
    } else {
      console.warn('Firebase service account file not found. Notifications will not work.');
      module.exports = {
        messaging: () => ({
          sendMulticast: async () => ({ failureCount: 0, responses: [] })
        })
      };
      return;
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  module.exports = admin;
} catch (error) {
  console.warn('Error initializing Firebase admin:', error);
  module.exports = {
    messaging: () => ({
      sendMulticast: async () => ({ failureCount: 0, responses: [] })
    })
  };
} 