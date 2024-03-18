import globalEventModel from "@bestapps/microservice-entity/dist/model/event/GlobalEventModel";
import {EVENT_ENTITY_CREATED} from "@bestapps/microservice-entity/dist/model/event/Events";
import Entity from "@bestapps/microservice-entity/dist/entity/Entity";
import responseModel from "./ResponseModel";
import appModel from "./AppModel";


class BrokerEmitterModel {

    init() {
        globalEventModel.getEmitter().on(EVENT_ENTITY_CREATED, (data: any) => {
            this.emit('created', data.entity);
        });
    }

    async emit(type: string, entity: Entity) {
        let name = entity.getClassName();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let c = `get${name}`;
        let response = await responseModel[c](entity);
        await appModel.broker.emit(`${name}::${type}`, response);
    }
}


export default new BrokerEmitterModel();
