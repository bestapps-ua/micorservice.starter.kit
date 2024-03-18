import sql from "./model/SQLModel";

let config = require('config');
import globalEventModel from "@bestapps/microservice-entity/dist/model/event/GlobalEventModel";
import exampleModel from "./model/ExampleModel";
import brokerEmitterModel from "./model/BrokerEmitterModel";
import appModel from "./model/AppModel";

exampleModel.init();
brokerEmitterModel.init();

import {ServiceSchema} from "moleculer";
import {
    EVENT_SQL_CONNECTED,
    EVENT_SQL_MODELS_LOADED
} from "@bestapps/microservice-entity/dist/model";
import NotFoundError from "./entity/error/not.found.error";
import EmptyError from "./entity/error/empty.error";
import InternalError from "./entity/error/internal.error";
import responseModel from "./model/ResponseModel";

import ExistError from "./entity/error/exist.error";
import Example from "./entity/Example";

import MoleculerActions from "./actions";


let moleculerActions = new MoleculerActions(exampleModel, 'Example');

let onAppLoaded = new Promise((resolve, reject) => {
    globalEventModel.getEmitter().on(EVENT_SQL_MODELS_LOADED, () => {
        resolve(undefined);
    });
});

let actions = moleculerActions.generate({

    async create(ctx) {
        let query = ctx.params.query || {};
        let uid = ctx.params.uid;
        let parentUid = ctx.params.parentUid;
        let data = ctx.params.data || {};

        if (uid && uid === parentUid) return new ExistError('uid');

        let exampleData = {
            uid,
            parent: undefined,
            user: undefined,
            data,
        };

        let p = [];

        /*
        try {
            let user = await userModel.getOrCreateByUidAsync(userUid);
            if (user) {
                documentData.user = user;
            } else {
                return new InternalError('userUid');
            }
        } catch (err) {
            return new InternalError('userUid');
        }

         */

        if (uid) {
            p.push(new Promise(async (resolve, reject) => {
                let document = await exampleModel.getByUidAsync(uid);
                if (!document) return resolve(undefined);
                reject(new ExistError('uid'));
            }));
        }

        if (parentUid) {
            p.push(new Promise(async (resolve, reject) => {
                let document = await exampleModel.getByUidAsync(parentUid);
                if (document) {
                    exampleData.parent = document;
                    return resolve(undefined);
                }
                reject(new NotFoundError('parentUid'));
            }));
        }

        return new Promise((resolve, reject) => {

            Promise.all(p).then(async () => {
                try {
                    let example = await exampleModel.createAsync(new Example(exampleData)) as Example;
                    let res = await responseModel.getExampleResponse(example, query);
                    return resolve(res);
                } catch (err) {
                    reject(new InternalError(err));
                }
            }).catch(err => {
                console.log('[err create example]', {err, params: ctx.params});
                reject(err);
            });
        });
    },
});

let AppService: ServiceSchema | any = {
    name: config.services.document,
    version: 1,
    actions,
    created() {
        // Fired when the service instance created (with `broker.loadService` or `broker.createService`)
    },

    async started() {
        return new Promise((resolve, reject) => {
            appModel.setBroker(this.broker);
            sql.connect(function (err) {
                if (err) {
                    console.log('[ERR SQL CONNECTION]', err);
                    return reject();
                }
                globalEventModel.getEmitter().emit(EVENT_SQL_CONNECTED, {});
                console.log('STARTED');
                onAppLoaded.then(() => {
                    console.log('MODELS LOADED');
                    resolve(undefined);
                });
            });
        });
    },

    async stopped() {

    }
};

export = AppService;
