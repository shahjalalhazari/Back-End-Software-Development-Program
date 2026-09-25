import { PaymentFactory } from "./PaymentFactory";

class CheckoutService {
    async processOrder(orderId: string, amount: number, gateway: "stripe" | "paypal" | "razorpay" | "bkash" ) {
        console.log(`\n Processing order: ${orderId}`);
        console.log(`Amount: $${amount}`);
        console.log(`Gateway: ${gateway}`);

        const payment = PaymentFactory.create(gateway);

        const result = await payment.processPayment(amount, "USD");

        if (result.success) {
            console.log(result.message);
            console.log(`Transation ID: ${result.transactionId}`);
        } else {
            console.log(`Payment failed: ${result.message}`);
        }

        return result;
    }


    async refundOrder(transactionId: string, amount: number, gateway: "stripe" | "paypal" | "razorpay" | "bkash" ) {
        console.log("Processing Refund");
        console.log(`Original Transaction ID: ${transactionId}`);
        console.log(`Amount: ${amount}`);

        const payment = PaymentFactory.create(gateway);
        const result = await payment.refund(transactionId, amount);

        if (result.success) {
            console.log(result.message);
        } else {
            console.log(`Something went wrong while refunding via ${gateway}`);
        }

        return result;
    }
}

export {CheckoutService};