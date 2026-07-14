interface NotificationMessage {
  subject: string;
  body: string;
}

interface INotificationChannel {
  send(recipient: string, message: NotificationMessage): Promise<boolean>;
}

// Concrete implementations
class EmailNotification implements INotificationChannel {
  async send(recipient: string, message: NotificationMessage): Promise<boolean> {
    console.log(`📧 Email to: ${recipient}`);
    console.log(`   Subject: ${message.subject}`);
    console.log(`   Body: ${message.body}\n`);
    return true;
  }
}

class SMSNotification implements INotificationChannel {
  async send(recipient: string, message: NotificationMessage): Promise<boolean> {
    console.log(`📱 SMS to: ${recipient}`);
    console.log(`   ${message.body}\n`);
    return true;
  }
}

class WhatsAppNotification implements INotificationChannel {
  async send(recipient: string, message: NotificationMessage): Promise<boolean> {
    console.log(`💬 WhatsApp to: ${recipient}`);
    console.log(`   ${message.body}\n`);
    return true;
  }
}

class PushNotification implements INotificationChannel {
  async send(recipient: string, message: NotificationMessage): Promise<boolean> {
    console.log(`🔔 Push to: ${recipient}`);
    console.log(`   ${message.subject}`);
    console.log(`   ${message.body}\n`);
    return true;
  }
}

// The Factory
class NotificationFactory {
  static create(channel: 'email' | 'sms' | 'whatsapp' | 'push'): INotificationChannel {
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
};


export {NotificationFactory};