interface PaymentResult {
    success: boolean;
    transactionId: string;
    message: string;
}


interface IPaymentGateway {
    processPayment(anout: number, currency: string): Promise<PaymentResult>;
    refund(transactionId: string, amount: number): Promise<PaymentResult>;
}


// PAYMENT GATEWAY IS STRIPE
class StripePayment implements IPaymentGateway {
    async processPayment(amount: number, currency: string): Promise<PaymentResult> {
        console.log(`Processing ${amount} in ${currency} via stripe`);

        return {
            success: true,
            transactionId: `stripe_${Date.now()}`,
            message: "Payment prcessed successfully via stripe"
        };
    }

    async refund(transactionId: string, amount: number): Promise<PaymentResult> {
        console.log(`Refunding ${amount} on stripe (${transactionId})`);

        return {
            success: true,
            transactionId: `refund_${Date.now()}`,
            message: "Refund processed via stripe"
        }
    }
}


// PAYMENT GATEWAY IS PAYPAL
class PayPalPayment implements IPaymentGateway {
    async processPayment(amount: number, currency: string): Promise<PaymentResult> {
        console.log(`Processing ${amount} in ${currency} via PayPal`);

        return {
            success: true,
            transactionId: `paypal_${Date.now()}`,
            message: "Payment prcessed successfully via PayPal"
        };
    }

    async refund(transactionId: string, amount: number): Promise<PaymentResult> {
        console.log(`Refunding ${amount} on PayPal (${transactionId})`);

        return {
            success: true,
            transactionId: `refund_${Date.now()}`,
            message: "Refund processed via PayPal"
        }
    }
}


// PAYMENT GATEWAY IS RAZORPAY
class RazorpayPayment implements IPaymentGateway {
    async processPayment(amount: number, currency: string): Promise<PaymentResult> {
        console.log(`Processing ${amount} in ${currency} via Razorpay`);

        return {
            success: true,
            transactionId: `razorpay_${Date.now()}`,
            message: "Payment prcessed successfully via Razorpay"
        };
    }

    async refund(transactionId: string, amount: number): Promise<PaymentResult> {
        console.log(`Refunding ${amount} on Razorpay (${transactionId})`);

        return {
            success: true,
            transactionId: `refund_${Date.now()}`,
            message: "Refund processed via Razorpay"
        }
    }
}


// PAYMENT GATEWAY IS BKASH
class BkashPayment implements IPaymentGateway {
    async processPayment(amount: number, currency: string): Promise<PaymentResult> {
        console.log(`Processing ${amount} in ${currency} via Bkash`);

        return {
            success: true,
            transactionId: `bkash${Date.now()}`,
            message: "Payment prcessed successfully via Bkash"
        };
    }

    async refund(transactionId: string, amount: number): Promise<PaymentResult> {
        console.log(`Refunding ${amount} on Bkash (${transactionId})`);

        return {
            success: true,
            transactionId: `refund_${Date.now()}`,
            message: "Refund processed via Bkash"
        }
    }
}


// THE FACTORY
class PaymentFactory {
    static create(gateway: "stripe" | "paypal" | "razorpay" | "bkash" ): IPaymentGateway {
        switch (gateway) {
            case "stripe":
                return new StripePayment();
            case "paypal":
                return new PayPalPayment();
            case "razorpay":
                return new RazorpayPayment();
            case "bkash":
                return new BkashPayment();
            default:
            throw new Error(`Unknown payment gateway: ${gateway}`)

        }
    }
}

export {PaymentFactory, IPaymentGateway, PaymentResult};