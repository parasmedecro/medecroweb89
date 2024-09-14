const sendMessage = async () => {
    const botToken = '7154746512:AAHg1nAZxF5UyeqvDuJEosV2WO0D44_PK_4'; // Replace with your bot token
    const chatId = '1702328275';   // Replace with the recipient's chat ID
    const message = 'Hello, this is a message from my Telegram bot!';
  
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  
    const data = await response.json();
    if (data.ok) {
      console.log('Message sent successfully!');
    } else {
      console.error('Error sending message:', data);
    }
  };
  
  sendMessage();
  