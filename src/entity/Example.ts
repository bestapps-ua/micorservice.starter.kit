import AppEntity from "./AppEntity";

class Example extends AppEntity {
    private _type: string;
    private _name: string;
    private _position: number;
    private _status: string;
    private _parent: Example;

    constructor(props) {
        super(props);
        this._parent = this.props.parent;
        this._type = this.props.type;
        this._status = this.props.status;
        this._name = this.props.name;
        this._position = this.props.position;
    }

    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
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

    get parent(): Example {
        return this._get('_parent');
    }

    set parent(value: Example) {
        this._parent = value;
    }
}

export default Example;
