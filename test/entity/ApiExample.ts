import ApiEntity from "./ApiEntity";

class ApiExample extends ApiEntity {

    private _name: string;
    private _status: string;
    private _type: string;

    constructor(props) {
        super(props);
        this._name = props.name;
        this._status = props.status;
        this._type = props.type;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }
    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

}

export default ApiExample;
