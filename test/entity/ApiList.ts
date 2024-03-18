import ApiEntity from "./ApiEntity";
import ApiListPager from "./ApiListPager";

export default class ApiList extends ApiEntity {

    private _items: ApiEntity[];
    private _pager: ApiListPager;

    constructor(props) {
        super(props);
        this._items = props.items;
        this._pager = props.pager;
    }

    get items(): ApiEntity[] {
        return this._items;
    }

    set items(value: ApiEntity[]) {
        this._items = value;
    }

    get pager(): ApiListPager {
        return this._pager;
    }

    set pager(value: ApiListPager) {
        this._pager = value;
    }

}
