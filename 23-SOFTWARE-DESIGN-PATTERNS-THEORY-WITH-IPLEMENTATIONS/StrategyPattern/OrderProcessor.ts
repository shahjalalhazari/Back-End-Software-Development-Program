// STRATEGY INTERFACE
interface DiscountStrategy {
    apply (amount: number): number;
}


// NO DISCOUNT
class NoDiscount implements DiscountStrategy {
    apply(amount: number): number {
        return amount;
    }
}


// COUPON DISCOUNT
class CouponDiscount implements DiscountStrategy {
    constructor(private code: string, private percent: number) {}

    apply(amount: number): number {
        console.log(`Applied Coupon: ${this.code}`);
        return amount * (1 - this.percent / 100);
    }
}


// PREMIUM DISCOUNT FOR PREMIUM CUSTOMERS
class PremiumDiscount implements DiscountStrategy {
    apply(amount: number): number {
        console.log("Premium member will get 20% off");
        return amount * 0.8;
    }
}


// FLASH SALE DISCOUNT
class FlashSaleDiscount implements DiscountStrategy {
    apply(amount: number): number {
        console.log("Flash sale 30% off");
        return amount * 0.7;
    }
}


// DISCOUNT FOR LOYAL CUSTOMERS
class LoyaltyDiscount implements DiscountStrategy {
    constructor(private points: number) {}

    apply(amount: number): number {
        const discount = Math.min(this.points * 0.1, amount * 0.5);
        console.log(`Loyalty points: $${discount} off`);
        return amount - discount;
    }
}


// CONTEXT WITH STATE
class OrderProcessor {
    private discount: DiscountStrategy;
    private cart: Cart;
    private user: User;
    private orderHistory: string[] = [];

    constructor(cart: Cart, user: User) {
        this.cart = cart;
        this.user = user;
        this.discount = new NoDiscount(); // DEFAULT DISCOUNT VALUE "0"
    }

    // TO GET ORDER AMOUNT AFTER APPLYING DISCOUNT
    calculateTotal(): number {
        const subtotal = this.cart.getTotal();
        const total = this.discount.apply(subtotal);
        return total;
    }

    // RUNTIME STRATEGY CHANGES BASED ON EVERNT
    applyCoupon(code: string, percent: number) {
        this.discount = new CouponDiscount(code, percent);
        this.orderHistory.push(`Coupon ${code} applied.`)
    }

    // FOR PREMIUM USER
    upgradeToPremium() {
        this.discount = new PremiumDiscount();
        this.orderHistory.push("Upgraded to premium.");
    }

    // REDEEM POINTS
    redeemPoints(points: number) {
        this.discount = new LoyaltyDiscount(points);
        this.orderHistory.push(`Redeemed ${points} points.`);
    }

    // FLASH SALE
    applyFlashSale() {
        this.discount = new FlashSaleDiscount();
        this.orderHistory.push("Flash sale activated");
    }

    // REMOVE COUPON
    removeCoupn() {
        this.discount = new NoDiscount();
        this.orderHistory.push("Coupon Removed");
    }
}


// CART CLASS TYPE
class Cart {
    items: Array<{name: string, price: number}> = [];

    addItem(name: string, price: number) {
        this.items.push({name, price});
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}


// USER CLASS
class User {
    constructor(public id: string, public isPremium: boolean) {}
}


const cart = new Cart();
cart.addItem("Laptop", 1000);
cart.addItem("Mouse", 35);

const user = new User("Shahjalal", false);
const order = new OrderProcessor(cart, user);
console.log("Initial order:", order.calculateTotal()); // $1035

order.applyCoupon("SAVE10", 10);  // APPLY 10% DICOUNT WITH COUPON CODE
console.log("Order with coupon:", order.calculateTotal());  // NEW ORDER AMOUNT AFTER 10% DISCOUNT

// USER UPGRADED TO PREMIUM IN MID-CHECKOUT
order.upgradeToPremium();
console.log("Upgrad to premium:", order.calculateTotal()); // NEW AMOUNT FOR PREMIUM CUSTOMERS