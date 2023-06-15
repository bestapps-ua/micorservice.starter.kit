import broker from './broker';

let configModel = require('@bestapps/microservice-entity').model.configModel;
let RegistryModel = require('@bestapps/microservice-entity').model.RegistryModel;

let config = require('config');

configModel.setCacheConfig(config.cache);
RegistryModel.set('configModel', configModel);

broker.start();
