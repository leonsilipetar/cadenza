socket.on('sendMessage', (message) => {
  // Enhance the message with sender info before broadcasting
  const enhancedMessage = {
    ...message,
    senderName: message.senderName, // Make sure this is included
    timestamp: new Date().toISOString(),
  };
  
  socket.to(message.recipientId).emit('newMessage', enhancedMessage);
}); 