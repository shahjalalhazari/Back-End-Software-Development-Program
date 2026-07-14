// Concrete implementations
class EmailNotification {
    async send(recipient, message) {
        console.log(`📧 Email to: ${recipient}`);
        console.log(`   Subject: ${message.subject}`);
        console.log(`   Body: ${message.body}\n`);
        return true;
    }
}
class SMSNotification {
    async send(recipient, message) {
        console.log(`📱 SMS to: ${recipient}`);
        console.log(`   ${message.body}\n`);
        return true;
    }
}
class WhatsAppNotification {
    async send(recipient, message) {
        console.log(`💬 WhatsApp to: ${recipient}`);
        console.log(`   ${message.body}\n`);
        return true;
    }
}
class PushNotification {
    async send(recipient, message) {
        console.log(`🔔 Push to: ${recipient}`);
        console.log(`   ${message.subject}`);
        console.log(`   ${message.body}\n`);
        return true;
    }
}
// The Factory
class NotificationFactory {
    static create(channel) {
        switch (channel) {
            case 'email':
                return new EmailNotification();
            case 'sms':
                return new SMSNotification();
            case 'whatsapp':
                return new WhatsAppNotification();
            case 'push':
                return new PushNotification();
            default:
                throw new Error(`Unknown channel: ${channel}`);
        }
    }
}
;
export { NotificationFactory };
//# sourceMappingURL=NotificationFactory.js.map