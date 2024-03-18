import sql from "../../src/model/SQLModel";
import globalEventModel from "@bestapps/microservice-entity/dist/model/event/GlobalEventModel";
import {EVENT_SQL_MODELS_LOADED} from "@bestapps/microservice-entity/dist/model";
import APIModel from "../model/APIModel";
import BasicHelper from "./BasicHelper";

//TODO: import here your schema
//const ExampleServiceSchema = require("../../src/example.v1.service");


const consoleLog = console.log;
console.log = function () {

};

export class TestHelper {
    isLoaded: boolean = false;

    constructor() {
        this.beforeEach();
        this.beforeAll();
        this.afterAll();
    }

    async prepare() {
        if (this.isLoaded) {
            return true;
        }

        await new Promise((resolve) => {
            globalEventModel.getEmitter().on(EVENT_SQL_MODELS_LOADED, async (data) => {
                //broker need time to load on some reason :/
                setTimeout(() => {
                    console.log = consoleLog;
                    this.isLoaded = true;
                    resolve(undefined);
                }, 1);
            });
        });
    }

    beforeAll(callback = undefined) {
        beforeAll(done => {
            APIModel.broker.start();
            //TODO: start services here
            //APIModel.broker.createService(ExampleServiceSchema);

            if (callback) {
                callback(done)
            } else {
                done();
            }
        });
    }

    afterAll(callback = undefined) {
        afterAll(done => {
            APIModel.broker.stop();
            sql.connectionEnd(() => {
                if (callback) {
                    callback(done)
                } else {
                    done();
                }
            });
        });
    }

    beforeEach(callback = undefined) {
        beforeEach(done => {
            if (callback) {
                callback(done)
            } else {
                done();
            }
        });
    }

    async errorCheck(message: string, callback: Function) {
        const log = console.log;
        try {
            console.log = () => {
            };
            await callback(message);
            throw new Error(message);
        } catch (err) {
            console.log = log;
            if (err.message === message) {
                console.log(err.message);
            }
        }
        console.log = log;
    }

    async prepareList(entityHelper: BasicHelper, params:any = {}, options: any = {}) {
        await this.prepare();
        const limit = options.limit ?? 5;
        let list = [];
        for (let i = 0; i < limit; i++) {
            let res = await entityHelper.generate(params);
            list.push(res.entity);
        }
        return list;
    }
}

let testHelper = new TestHelper();
export {testHelper};
