import {ServiceBroker} from "moleculer";

class AppModel {

    public models: {};
    public broker: ServiceBroker;


    constructor() {
        this.models = {};
    }

    public setBroker(broker: ServiceBroker) {
        this.broker = broker;
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default new AppModel();
