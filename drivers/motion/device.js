'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class Motionsensor extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();

		this.batteryThreshold = 29;

		/* this.node.endpoints[1].clusters['msOccupancySensing'].do({ pirOToUDelay: 30 })
		.then(result => {
			console.log('setting pirOToUDelay succeded');
		})
    .catch(err => {
			console.log('error setting pirOToUDelay');
		});*/

		/* this.node.endpoints[1].clusters['msOccupancySensing'].read('pirOToUDelay')
    .then(result => {
			console.log(result);
    })
    .catch(err => {
			console.log('could not read modelId');
    });*/

		// alarm_motion
		this.registerReportListener('msOccupancySensing', 'occupancy', report => {
			console.log(report);
		}, 1);

		this.registerCapability('alarm_motion', 'msOccupancySensing', {
			getOpts: {
				pollInterval: 5000,
			},
		});

		// alarm_battery
		this.registerReportListener('genPowerCfg', 'batteryVoltage', report => {
			console.log(report);
		}, 1);

		this.registerCapability('alarm_battery', 'genPowerCfg', {
			getOpts: {
				pollInterval: 43200000,
			},
		});

		// measure_temperature
		this.registerReportListener('msTemperatureMeasurement', 'measuredValue', report => {
			console.log(report);
		}, 1);

		this.registerCapability('measure_temperature', 'msTemperatureMeasurement', {
			getOpts: {
				pollInterval: 3600000,
			},
		});

		// measure_luminance
		this.registerReportListener('msIlluminanceMeasurement', 'measuredValue', report => {
			console.log(report);
		}, 1);

		this.registerCapability('measure_luminance', 'msIlluminanceMeasurement', {
			getOpts: {
				pollInterval: 300000,
			},
		});

		// measure_battery
		this.registerReportListener('genPowerCfg', 'batteryPercentageRemaining', report => {
			console.log(report);
		}, 1);

		this.registerCapability('measure_battery', 'genPowerCfg', {
			getOpts: {
				pollInterval: 43200000,
			},
		});

		if (this.node) {
			this.node.on('command', report => {
				console.log('Command received');
				console.log(report);
			});
		}

	}
}

module.exports = Motionsensor;
