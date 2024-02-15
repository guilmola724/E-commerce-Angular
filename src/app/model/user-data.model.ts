import { Address } from "./address.model";

export class UserData {

    constructor(
        private email: string,
        private confirmEmail: string,
        private password: string, 
        private fullName: string,
        private address: Address,
    )
    { }

    static getClassName(): string {
        return 'UserData';
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string) {
        this.email = email;
    }

    getConfirmEmail(): string {
        return this.confirmEmail;
    }

    setConfirmEmail(confirmEmail: string) {
        this.confirmEmail = confirmEmail;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string) {
        this.password = password;
    }

    getFullName(): string {
        return this.fullName;
    }

    setFullName(fullName: string) {
        this.fullName = fullName;
    }

    getAddress(): Address {
        return this.address;
    }

    setAddress(address: Address) {
        this.address = address
    }

    static buildEmptyUser(): UserData {
        const address = new Address(0, '', '', '');
        const user = new UserData('', '', '', '', address);
        return user;
    }

}