import { ServiceBroker } from "moleculer";
let config = require('config');

// Create broker
const broker = new ServiceBroker();

// Load service
broker.loadServices( "./src/",  "*service.ts");

export default broker;
