# Requirements & User Stories

## Business Context
You're building an e-commerce checkout system. Marketing runs multiple promotions simultaneously, and users should get the **best discount they're eligible for** at any moment during checkout.

## User Stories

### Story 1: Basic Discount Flow
```
As a customer
I want to apply a coupon code during checkout
So that I can get a discount on my order

Acceptance Criteria:
- User can enter coupon code anytime before payment
- Discount applies immediately to total
- User can remove coupon and see original price
```

### Story 2: Premium Membership
```
As a premium member
I want to automatically get 20% off
So that I don't need to remember coupon codes

Acceptance Criteria:
- User upgrades to premium mid-checkout
- Premium discount replaces coupon discount
- Total recalculates instantly
```

### Story 3: Flash Sales
```
As a user browsing during flash sale
I want the best available discount applied automatically
So that I don't miss limited-time deals

Acceptance Criteria:
- Flash sale activates while user is in checkout
- System auto-applies flash sale if better than current discount
- User sees notification of flash sale
```

### Story 4: Loyalty Points
```
As a returning customer
I want to redeem loyalty points for discount
So that I can use my earned rewards

Acceptance Criteria:
- User can switch from coupon to loyalty points
- Points convert to dollar discount (1 point = $0.10)
- Max 50% discount from points
```

## Why Strategy Pattern?

### ❌ Bad Approach: if-else
```typescript
calculateTotal() {
  if (this.discountType === 'coupon') {
    // coupon logic
  } else if (this.discountType === 'premium') {
    // premium logic
  } else if (this.discountType === 'flash') {
    // flash logic
  } else if (this.discountType === 'loyalty') {
    // loyalty logic
  }
}
```

**Problems:**
- New discount type = modify calculateTotal()
- Testing = test all branches every time
- Can't switch discount mid-checkout without complex state management
- Violates Open/Closed Principle

### ❌ Bad Approach: Factory Only
```typescript
const discount = DiscountFactory.create('premium');
discount.apply(1000);
// User changes mind? Create new discount, lose context
const discount2 = DiscountFactory.create('coupon');
```

**Problems:**
- Each switch = new object = lose cart/user/history
- No encapsulation of switching logic
- Hard to track what changed and when

### ✅ Strategy Pattern Solves:
```typescript
// Same OrderProcessor instance throughout checkout
order.applyCoupon('SAVE10', 10);    // user action
order.upgradeToPremium();           // user upgrades
order.applyFlashSale();             // system event
order.redeemPoints(500);            // user switches
```

**Benefits:**
1. **Runtime flexibility**: Switch discounts without recreating order
2. **State preservation**: Cart, user, history intact
3. **Open/Closed**: Add new discounts without touching OrderProcessor
4. **Testable**: Each strategy tests independently
5. **Auditable**: orderHistory tracks all changes

## Real Backend Flow
```
User adds items → OrderProcessor created with NoDiscount
   ↓
User enters coupon → applyCoupon() → CouponDiscount injected
   ↓
Marketing triggers flash sale → WebSocket event → applyFlashSale()
   ↓
User sees "Flash sale better!" → FlashSaleDiscount injected
   ↓
User decides loyalty points better → redeemPoints() → LoyaltyDiscount
   ↓
Order processed with final discount → History logged
```

## Teaching Point

**Tell your student:**

"You're building a checkout that must react to:
- User actions (coupon, points)
- Business events (flash sales, upgrades)
- System rules (best discount wins)

Strategy lets the **same order object** adapt its behavior **while preserving** cart, user, and history. That's why we didn't just use Factory."