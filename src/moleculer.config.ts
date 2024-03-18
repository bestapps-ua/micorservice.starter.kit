let config = require('config');

let transporterType = config.broker.transporter.type.toLowerCase();
let transporterConfig = config.broker.transporter[transporterType];
let transporter = {
    type: transporterType.charAt(0).toUpperCase() + transporterType.slice(1),
    options: {
        [transporterType]: {
            port: transporterConfig.port,
            host: transporterConfig.host || 'localhost'
        },
        disableOfflineNodeRemoving: config.broker.transporter.disableOfflineNodeRemoving,
        disableHeartbeatChecks: config.broker.transporter.disableHeartbeatChecks,
    },
};

module.exports = {
    nodeID: config.broker.nodeID,
    middlewares: [
        {
            localAction(next, action) {
                return function (ctx) {
                    // Change context properties or something
                    return next(ctx).then((res) => {
                        return res;
                    }).catch(err => {
                        // Handle error or throw further
                        throw err;
                    });
                }
            }
        }
    ],
    transporter: `${transporterType}://${transporterConfig.host || 'localhost'}:${transporterConfig.port}`,
    registry: {
        discoverer: {
	        transporter,
	    }
    }
};
