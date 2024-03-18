import BestApps from "@bestapps/microservice-entity";
import IEntitySQLModelOptions = BestApps.interfaces.IEntitySQLModelOptions;
import EntitySQLModel from "@bestapps/microservice-entity/dist/model/entity/EntitySQLModel";
import Example from "../entity/Example";

let options: IEntitySQLModelOptions = {
    table: 'example',
    //@ts-ignore
    entity: Example,
    schemas: [
        {
            field: 'parent',
            source: {
                id: 'pid',
                model: 'this',
            },
            isLazy: true,
            optional: true,
        },
        /*
        {
            field: 'user',
            source: {
                id: 'user_id',
                model: userModel,
            },
            isLazy: true,
        },
        */
        {
            field: 'name'
        },
        {
            field: 'status'
        },
        {
            field: 'position'
        },
        {
            field: 'data',
            type: 'json'
        },
        {
            field: 'updated'
        },
    ]
};

class ExampleModel extends EntitySQLModel {
    async getByParentAndPositionAsync(parent: Example | string, position: number) {
        let params = [
            {key: 'position', value: position},
        ];

        if (parent) {
            if (typeof parent === 'string') {
                let parentExample = await this.getByUidAsync(parent);
                params.push({
                    key: 'pid',
                    value: parentExample.id,
                });
            } else {
                params.push({
                    key: 'pid',
                    value: parent.id,
                });
            }
        }
        return await this.getOneByParamsAsync(params);
    }
}

export default new ExampleModel(options);
