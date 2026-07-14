interface NotificationMessage {
    subject: string;
    body: string;
}
interface INotificationChannel {
    send(recipient: string, message: NotificationMessage): Promise<boolean>;
}
declare class NotificationFactory {
    static create(channel: 'email' | 'sms' | 'whatsapp' | 'push'): INotificationChannel;
}
export { NotificationFactory };
//# sourceMappingURL=NotificationFactory.d.ts.map