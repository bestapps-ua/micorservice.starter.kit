import Entity from "@bestapps/microservice-entity/dist/entity/Entity";

export default class AppEntity extends Entity {

    private _updated: number;
    private _data: {};

    constructor(props) {
        super(props);

        this._updated = this.props.updated;
        this._data = this.props.data || {};
    }

    get updated(): number {
        return this._updated;
    }

    set updated(value: number) {
        this._updated = value;
    }


    get data(): {} {
        return this._data;
    }

    set data(value: {}) {
        this._data = value;
    }

}
