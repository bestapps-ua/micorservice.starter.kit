import ApiEntity from "../entity/ApiEntity";
import IEntityCreate from "../interface/IEntityCreate";
import EntityModel from "../model/EntityModel";

class BasicHelper {

    private _model: EntityModel;

    constructor(props) {
        this._model = props.model;
    }

    get model(): EntityModel {
        return this._model;
    }

    set model(value: EntityModel) {
        this._model = value;
    }

    async start() {

    }

    async checkAllData(entity: ApiEntity, query: any = {}, options: any = {}) {
        options = Object.assign({
            checkValues: true,
        }, options);
        expect(entity.uid).toBeDefined();
        this.checkUid(entity.uid);
        expect(entity.created).toBeDefined();
        expect(entity.data).toBeDefined();
        expect(entity.internalType).toBeDefined();
    }

    checkUid(uid: string) {
        let m = uid.match(/[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}/i);
        expect(m.length === 1).toBe(true);
    }

    async checkDefaultData(entity: ApiEntity, query: any = {}, options: any = {}) {
        await this.checkAllData(entity, query, options);
    }

    //@ts-ignore
    async create(params: any = {}) {
        let data = await this.generateData(params);
        return this.createByData(data, params);
    }

    //@ts-ignore
    async generateData(params: any = {}): Promise<any> {

    }

    //@ts-ignore
    async get(params: any = {}): Promise<IEntityGet> {
        return {
            entity: await this.model.action('get', params),
            entityParams: params,
        };
    }

    //@ts-ignore
    async delete(params: any = {}): Promise<> {
        await this.model.action('delete', params);
        return true;
    }

    async createByData(data: any, params: any) {
        return {
            entityData: data,
            entity: await this.model.action('create', data),
            entityParams: params,
        };
    }

    async generate(params: any = {}): Promise<IEntityCreate> {
        return this.create(params);
    }

    //@ts-ignore
    async set(params: any = {}): Promise<IEntityGet> {
        return {
            entity: await this.model.action('set', params),
            entityParams: params,
        };
    }

    //@ts-ignore
    async list(params: any = {}): Promise<any> {
        return {
            entitiesData: await this.model.action('list', params),
            entityParams: params,
        };
    }
}

export default BasicHelper;
