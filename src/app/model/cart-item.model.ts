import { Product } from "./product.model";

export class CartItem {

    constructor(
        private product: Product,
        private quantity: number,
        private totalPrice: number,
    ) { }

    static getClassName(): string {
        return 'CartItem';
    }

    getProduct(): Product {
        return this.product;
    }

    setProduct(product: Product) {
        this.product = product;
    }

    getQuantity(): number {
        return this.quantity;
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    setTotalPrice(totalPrice: number) {
        this.totalPrice = totalPrice;
    }

}