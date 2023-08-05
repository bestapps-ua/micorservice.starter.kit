import sql from "./model/SQLModel";

let config = require('config');
import globalEventModel from "@bestapps/microservice-entity/dist/model/event/GlobalEventModel";

import {ServiceSchema} from "moleculer";
import RegistryModel from "@bestapps/microservice-entity/dist/model/RegistryModel";
import {EVENT_SQL_CONNECTED} from "@bestapps/microservice-entity/dist/model";

const AppService: ServiceSchema | any = {
    name: config.services.app,
    actions: {
        async ping(ctx) {
            return {
                ok: true
            };
        }
    },

    created() {
        // Fired when the service instance created (with `broker.loadService` or `broker.createService`)
    },

    async started() {
        return new Promise((resolve, reject) => {
            sql.connect(function (err) {
                if(err){
                    console.log('[ERR SQL CONNECTION]', err);
                    return reject();
                }
                globalEventModel.getEmitter().emit(EVENT_SQL_CONNECTED, {});
                console.log('STARTED');
                resolve(undefined);
            });
        });
    },

    async stopped() {

    }
};

export = AppService;
