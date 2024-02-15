import { CartItem } from "./cart-item.model";

export class ShoppingCart {

    constructor(
        private cart: CartItem[],
        private totalPrice: number
    ) { }

    static getClassName(): string {
        return 'ShoppingCart';
    }

    getCart(): CartItem[] {
        return this.cart;
    }

    setCart(cart: CartItem[]) {
        this.cart = cart;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    setTotalPrice(totalPrice: number) {
        this.totalPrice = totalPrice;
    }

}