const admin = require('../config/firebase-admin');
const User = require('../model/User');

const sendNotification = async (userId, notification) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
      console.log('No FCM tokens found for user:', userId);
      return;
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens: user.fcmTokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    
    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(user.fcmTokens[idx]);
        }
      });

      // Remove failed tokens from user
      if (failedTokens.length > 0) {
        await User.findByIdAndUpdate(userId, {
          $pull: { fcmTokens: { $in: failedTokens } }
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Send to multiple users
const sendNotificationToMultipleUsers = async (userIds, notification) => {
  try {
    const results = await Promise.all(
      userIds.map(userId => sendNotification(userId, notification))
    );
    return results;
  } catch (error) {
    console.error('Error sending notifications to multiple users:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendNotificationToMultipleUsers
}; 