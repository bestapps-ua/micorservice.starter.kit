import exampleModel from "../model/ExampleModel";
import ApiExample from "../entity/ApiExample";
import BasicHelper from "./BasicHelper";
import IEntityCreate from "../interface/IEntityCreate";

let uuid4 = require('uuid/v4');

class ExampleHelper extends BasicHelper {
    async generateData(params: any = {}) {
        let data: any = {
            uid: params.uid,
            name: params.name ?? `Example ${uuid4()}`,
            data: params.data ?? {test: 1},
            query: params.query ?? {},
        }

        return data;
    }

    async checkAllData(entity: ApiExample, query: any = {}, options: any = {}) {
        await super.checkAllData(entity, query, options);
        expect(entity.internalType).toEqual('example');
    }

    getDefaultQuery() {
        return {
            parent: 1,
            user: 1,
        };
    }
}


export default new ExampleHelper({
    model: exampleModel,
});
