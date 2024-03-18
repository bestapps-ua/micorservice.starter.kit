import Moleculer, {ServiceBroker} from "moleculer";

class APIModel {

    private _broker: Moleculer.ServiceBroker;

    constructor() {
        this._broker = new ServiceBroker({ logger: false });
    }

    async call(action: string, params: any = {}) {
        let t = Date.now();
        try {
            let res: any = await this.broker.call(action, params);
            //console.log(action, res);
            if(!res['ok']) {
                throw res;
            }
            if(res && res.data) {

                res.data._system = {
                    ttl: Math.round(Date.now() - t) / 1000,
                };
            }
            return res;
        } catch (err) {
            console.log('err call', {err, action, params});
            throw err;
        }
    }

    start() {
        this.broker.start();
    }

    stop() {
        this.broker.stop();
    }

    get broker(): Moleculer.ServiceBroker {
        return this._broker;
    }

    set broker(value: Moleculer.ServiceBroker) {
        this._broker = value;
    }
}

export default new APIModel();
