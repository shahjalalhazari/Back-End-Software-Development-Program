import { NotificationFactory } from "./NotificationFactory.js";
// Usage
async function main() {
    const message = {
        subject: 'Order Shipped',
        body: 'Your order #12345 has been shipped!'
    };
    // Email
    const email = NotificationFactory.create('email');
    await email.send('user@example.com', message);
    // SMS
    const sms = NotificationFactory.create('sms');
    await sms.send('+8801712345678', message);
    // WhatsApp
    const whatsapp = NotificationFactory.create('whatsapp');
    await whatsapp.send('+8801798765432', message);
    // Push
    const push = NotificationFactory.create('push');
    await push.send('device_token_xyz', message);
}
main();
//# sourceMappingURL=index.js.map