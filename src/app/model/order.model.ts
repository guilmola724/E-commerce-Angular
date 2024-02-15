import {  CartItem } from "./cart-item.model";
import { ShoppingCart } from "./shopping-cart.model";
import { UserData } from "./user-data.model";


export class Order extends ShoppingCart{

    constructor(
        //inherited properties
        cart: CartItem[],
        totalPrice: number,

        //new properties
        private orderId: number,
        private formattedDate: string,
        private formattedTime: string,
        private status: string,
        private orderNumber: string,
        private userData: UserData
    ) {
        super(
            cart,
            totalPrice,
        );
    }

    static getClassName(): string {
        return 'Order';
    }

    getOrderId(): number {
        return this.orderId;
    }

    setOrderId(orderId: number) {
        this.orderId = orderId;
    }

    getFormattedDate(): string {
        return this.formattedDate;
    }

    setFormattedDate(formattedDate: string) {
        this.formattedDate = formattedDate;
    }

    getFormattedTime(): string {
        return this.formattedTime;
    }

    setFormattedTime(formattedTime: string) {
        this.formattedTime = formattedTime;
    }

    getStatus(): string{
        return this.status;
    }

    setStatus(status: string) {
        this.status = status;
    }

    getOrderNumber(): string {
        return this.orderNumber;
    }

    setOrderNumber(orderNumber) {
        this.orderNumber = orderNumber;
    }

    getUserData(): UserData {
        return this.userData;
    }

    setUserData(userData: UserData) {
        this.userData = userData;
    }

}