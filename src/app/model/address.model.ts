export class Address {

    constructor(
        private addressId: number,
        private street: string,
        private postalCode: string,
        private city: string
    )
    { }

    static getClassName(): string {
        return 'Address';
    }

    getAddressId(): number {
        return this.addressId;
    }

    setAddressId(addressId: number) {
        this.addressId = addressId;
    }

    getStreet(): string {
        return this.street;
    }

    setStreet(street: string) {
        this.street = street;
    }

    getPostalCode(): string {
        return this.postalCode;
    }

    setPostalCode(postalCode: string) {
        this.postalCode = postalCode;
    }

    getCity(): string {
        return this.city;
    }
    
    setCity(city: string) {
        this.city = city;
    }

}