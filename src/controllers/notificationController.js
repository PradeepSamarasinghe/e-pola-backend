const { Expo } = require('expo-server-sdk');

let expo = new Expo();

exports.sendOrderStatusNotification = async (user, order) => {
  if (!user.expoPushToken) {
    return; // User has not registered for push notifications
  }

  if (!Expo.isExpoPushToken(user.expoPushToken)) {
    console.error(`Push token ${user.expoPushToken} is not a valid Expo push token`);
    return;
  }

  let title = 'Order Update';
  let body = `Your order status changed to ${order.fulfillmentStatus}`;

  if (order.fulfillmentStatus === 'out_for_delivery') {
    title = 'Order Out for Delivery! 🚚';
    body = 'Your order is on the way. Tap here to track your driver.';
  } else if (order.fulfillmentStatus === 'delivered') {
    title = 'Order Delivered! 🎉';
    body = 'Your order has been delivered. Enjoy!';
  } else if (order.fulfillmentStatus === 'preparing') {
    title = 'Order Preparing 🧑‍🍳';
    body = 'The vendor is preparing your order.';
  } else if (order.fulfillmentStatus === 'cancelled') {
    title = 'Order Cancelled ❌';
    body = 'Unfortunately, your order has been cancelled.';
  }

  const messages = [{
    to: user.expoPushToken,
    sound: 'default',
    title,
    body,
    data: { orderId: order._id.toString(), status: order.fulfillmentStatus },
  }];

  try {
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log('Successfully sent push notification to', user.phoneNumber);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
