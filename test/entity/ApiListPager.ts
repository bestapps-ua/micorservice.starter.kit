import ApiEntity from "./ApiEntity";

export default class ApiListPager {
    private _count: number;
    private _page: number;
    private _pages: number;
    private _limit: number;

    constructor(props) {
        this._count = props.count;
        this._page = props.page;
        this._pages = props.pages;
        this._limit = props.limit;
    }

    get limit(): number {
        return this._limit;
    }

    set limit(value: number) {
        this._limit = value;
    }
    get pages(): number {
        return this._pages;
    }

    set pages(value: number) {
        this._pages = value;
    }
    get page(): number {
        return this._page;
    }

    set page(value: number) {
        this._page = value;
    }
    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }

}
