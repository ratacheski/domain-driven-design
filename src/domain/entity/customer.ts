import Address from "./address";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor (id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }
    
    changeName(name: string) {
        this._name = name;
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    activate() {
        if (!this._address) {
            throw new Error('Address is required to activate a customer');
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    validate() {
        if (!this._id) {
            throw new Error('ID is required');
        }
        if (!this._name) {
            throw new Error('Name is required');
        }
    }

    isActive() {
        return this._active;
    }

    increaseRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get id(): string {
        return this._id;
    }
}
