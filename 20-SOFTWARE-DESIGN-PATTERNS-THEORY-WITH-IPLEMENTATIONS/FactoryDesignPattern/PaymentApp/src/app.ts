import { CheckoutService } from "./PaymentService";


async function main() {
    const checkout = new CheckoutService();


    // PAYMENT EXAMPLES WITH DIFFERENT GATEWAY
    await checkout.processOrder("ORD-001", 99.9, "stripe");
    await checkout.processOrder("ORD-002", 299.9, "paypal");
    await checkout.processOrder("ORD-003", 499.9, "razorpay");
    await checkout.processOrder("ORD-004", 5699.9, "bkash");


    // REFUND EXAMPLE
    await checkout.refundOrder("stripe_123456", 99.9, "stripe");
}

main();