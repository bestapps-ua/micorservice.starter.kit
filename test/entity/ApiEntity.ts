class ApiEntity {

    private _uid: string;
    private __type: string;
    private _created: number;
    private _updated: number;
    private _data: Object;
    private _system: Object;

    constructor(props) {
        try {
            this._uid = props.uid;
            this._created = props.created;
            this._updated = props.updated;
            this.__type = props._type;
            this._data = props.data || {};
            this._system = props._system;
        } catch (err) {
            console.log('[err init entity]', {err, name: this.getClassName()});
            throw err;
        }
    }

    getClassName() {
        let name = this.constructor.name;
        name = name.charAt(0).toLowerCase() + name.slice(1);
        return name;
    }


    get data(): Object {
        return this._data;
    }

    set data(value: Object) {
        this._data = value;
    }

    get uid(): string {
        return this._uid;
    }

    set uid(value: string) {
        this._uid = value;
    }

    get created(): number {
        return this._created;
    }

    set created(value: number) {
        this._created = value;
    }

    get internalType(): string {
        return this.__type;
    }

    get system(): Object {
        return this._system;
    }

    set system(value: Object) {
        this._system = value;
    }

    get updated(): number {
        return this._updated;
    }

    set updated(value: number) {
        this._updated = value;
    }
}

export default ApiEntity;
