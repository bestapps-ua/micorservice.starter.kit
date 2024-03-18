import EmptyError from "./entity/error/empty.error";
import NotFoundError from "./entity/error/not.found.error";
import InternalError from "./entity/error/internal.error";
import EntitySQLModel from "@bestapps/microservice-entity/dist/model/entity/EntitySQLModel";

import exampleModel from "./model/ExampleModel";
import AppEntity from "./entity/AppEntity";
import responseModel from "./model/ResponseModel";
import BestApps from "@bestapps/microservice-entity";
import IEntityItemsWhere from "@bestapps/microservice-entity/src/interface/entity/items/IEntityItemsWhere";
import IEntityItemsParams = BestApps.interfaces.IEntityItemsParams;

let models = {
    exampleModel: exampleModel,
};

async function getParamNormalizedByParam(param: { key: string, value: any }) {
    let key = param.key;
    if (key.includes('.uid')) {
        let k = key.replace('.uid', '');
        let m = `${k}Model`;
        let item = await models[m].getByUidAsync(param.value);
        if (!item) {
            throw new NotFoundError(`${key}::${param.value}`);
        }
        return {...{key: `${k.charAt(0).toUpperCase()}${k.slice(1)}`, value: item}};
    } else {
        return param;
    }
}

async function processWhere(list: IEntityItemsWhere | IEntityItemsWhere[]) {
    let where = [];
    if (!Array.isArray(list)) {
        list = [list];
    }
    for (const item of list) {
        where.push(await getParamNormalizedByParam(item as { key: string, value: any }));
    }
    return where;
}

class MoleculerActions {
    private _model: EntitySQLModel;
    private _entity: string;

    get model(): EntitySQLModel {
        return this._model;
    }

    set model(value: EntitySQLModel) {
        this._model = value;
    }

    get responseMethod(): string {
        return `get${this.entity}Response`;
    }

    get responsePageListMethod(): string {
        return `get${this.entity}PageListResponse`;
    }

    get entity(): string {
        return this._entity;
    }

    set entity(value: string) {
        this._entity = value;
    }

    constructor(model: EntitySQLModel, entity: string) {
        this._model = model;
        this._entity = entity;
    }

    generate(actions: any) {
        let responseMethod = this.responseMethod;
        let responsePageListMethod = this.responsePageListMethod;
        let model = this.model;
        let moleculerActions = this;

        return Object.assign({}, actions, {

            async get(ctx) {
                let uid = ctx.params.uid;
                let query = ctx.params.query || {};
                if (!uid) return new EmptyError('uid');
                try {
                    let item = await model.getByUidAsync(uid);
                    if (!item) return new NotFoundError('uid');
                    return await responseModel[responseMethod](item, query);
                } catch (err) {
                    return new InternalError(err);
                }
            },

            async set(ctx) {
                let uid = ctx.params.uid;
                let params = ctx.params.params;
                let query = ctx.params.query || {};
                if (!uid) return new EmptyError('uid');
                try {
                    let entity = await model.getByUidAsync(uid) as AppEntity;
                    if (!entity) return new NotFoundError('uid');
                    for (const param of params) {
                        try {
                            const res = await getParamNormalizedByParam(param);
                            entity[res.key] = res.value;
                        } catch (err) {
                            return err;
                        }
                    }
                    entity.updated = Math.round(Date.now() / 1000);
                    entity = await model.updateAsync(entity) as AppEntity;
                    return await responseModel[responseMethod](entity, query);
                } catch (err) {
                    return new InternalError(err);
                }
            },

            async delete(ctx) {
                let uid = ctx.params.uid;
                if (!uid) return new EmptyError('uid');
                try {
                    let entity = await model.getByUidAsync(uid) as AppEntity;
                    if (!entity) return new NotFoundError('uid');
                    await model.removeAsync(entity);
                    return await responseModel.getSuccessResponse();
                } catch (err) {
                    return new InternalError(err);
                }
            },

            async list(ctx) {
                let params: IEntityItemsParams = ctx.params.params || {};
                let query = ctx.params.query || {};
                let page = params.page ?? 1;
                let limit = params.limit ?? 30;
                let data: IEntityItemsParams = {
                    page,
                    limit,
                };
                if (params.where) {
                    data.where = await processWhere(params.where);
                }
                if (params.having) {
                    data.having = await processWhere(params.where);
                }
                if (params.group) {
                    data.group = params.group;
                }
                try {
                    let entities = await model.getItemsAsync(data) as AppEntity[];
                    let count = await model.getItemsCountAsync(data) as number;
                    return await responseModel[responsePageListMethod](entities, count, page, limit, query);
                } catch (err) {
                    return new InternalError(err);
                }
            },

        });
    }

}

export default MoleculerActions;
