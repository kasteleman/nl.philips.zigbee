'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class Motionsensor extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();

		this.batteryThreshold = 29;
		this.motionThreshold = this.getSetting('motionThreshold') || 1;
		this.minReportInterval = this.getSetting('minReportInterval') || 1;
		this.maxReportInterval = this.getSetting('maxReportInterval') || 300;

		console.log(this.motionThreshold);
		console.log(this.minReportInterval);
		console.log(this.maxReportInterval);

		// alarm_motion
		this.registerAttrReportListener('msOccupancySensing', 'occupancy', this.minReportInterval, this.maxReportInterval, this.motionThreshold, data => {
    	this.log('occupancy', data);
		}, 1);

		// Add to queue
		// this._configureReportRequests.push({ reportId, endpointId, clusterId, attrId, minInt, maxInt, repChange });

		// If not already binding start the binding process
		// if (!this.configureReportInProcess) this._configureReport();

		// alarm_battery
		this.registerAttrReportListener('genPowerCfg', 'batteryVoltage', 3600, 43200, 1, data => {
    	this.log('batteryVoltage', data);
		}, 1);

		// measure_temperature
		this.registerAttrReportListener('msTemperatureMeasurement', 'measuredValue', 1800, 3660, 10, data => {
    	this.log('measuredValue', data);
		}, 1);

		// measure_luminance
		this.registerAttrReportListener('msIlluminanceMeasurement', 'measuredValue', 300, 900, 1, data => {
    	this.log('measuredValue', data);
		}, 1);

		// measure_battery
		this.registerAttrReportListener('genPowerCfg', 'batteryPercentageRemaining', 3600, 43200, 1, data => {
    	this.log('measuredValue', data);
		}, 1);

		if (this.node) {
			this.node.on('command', report => {
				console.log('Command received');
				console.log(report);
			});
		}

	}

	onSettings( newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {
	    // run when the user has changed the device's settings in Homey.
	    // changedKeysArr contains an array of keys that have been changed

	    // always fire the callback, or the settings won't change!
	    // if the settings must not be saved for whatever reason:
	    // callback( "Your error message", null );
	    // else
			callback( null, true );
			this.batteryThreshold = this.getSetting('batteryThreshold');
			this.motionThreshold = this.getSetting('motionThreshold');
			this.minReportInterval = this.getSetting('minReportInterval');
			this.maxReportInterval = this.getSetting('maxReportInterval');

			this.reconfigureAttrReport = this.getSetting('reconfigureAttrReport');

			console.log(this.batteryThreshold);
			console.log(this.motionThreshold);
			console.log(this.minReportInterval);
			console.log(this.maxReportInterval);
			console.log(this.reconfigureAttrReport);


			if (this.reconfigureAttrReport) {
				this.registerAttrReportListener('msOccupancySensing', 'occupancy', this.minReportInterval, this.maxReportInterval, this.motionThreshold, data => {
					this.log('occupancy', data);
				}, 1);
				this.setSettings({'reconfigureAttrReport': false,})
    		.then( this.log )
    		.catch( this.error )
			}

	}

}

module.exports = Motionsensor;
