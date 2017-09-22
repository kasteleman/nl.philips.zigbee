'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class Motionsensor extends ZigBeeDevice {
	onMeshInit() {
		this.printNode();

		// alarm_motion
		this.minReportMotion = this.getSetting('minReportMotion') || 1;
		this.maxReportMotion = this.getSetting('maxReportMotion') || 300;

		this.registerAttrReportListener('msOccupancySensing', 'occupancy', this.minReportMotion, this.maxReportMotion, 1, data => {
			this.log('occupancy', data);
			this.setCapabilityValue('alarm_motion', data === 1);
		}, 1);

		// alarm_battery
		this.registerAttrReportListener('genPowerCfg', 'batteryVoltage', 1, 3600, 1, data1 => {
			this.log('batteryVoltage', data1);
			const batteryThreshold = this.getSetting('batteryThreshold') || this.batteryThreshold || 1;
			console.log(batteryThreshold);
			if (data1 <= batteryThreshold) {
				this.setCapabilityValue('alarm_battery', true);
			} else {
				this.setCapabilityValue('alarm_battery', false);
			}
		}, 1);

		// measure_temperature
		this.minReportTemp = this.getSetting('minReportTemp') || 1800;
		this.maxReportTemp= this.getSetting('maxReportTemp') || 3600;

		this.registerAttrReportListener('msTemperatureMeasurement', 'measuredValue', this.minReportTemp, this.maxReportTemp, 10, data2 => {
			this.log('measuredValue', data2);
			const temperature = Math.round((data2 / 100) * 10) / 10;
			this.setCapabilityValue('measure_temperature', temperature);
		}, 1);

		// measure_luminance
		this.minReportLux = this.getSetting('minReportLux') || 300;
		this.maxReportLux= this.getSetting('maxReportLux') || 900;

		this.registerAttrReportListener('msIlluminanceMeasurement', 'measuredValue', this.minReportLux, this.maxReportLux, 10, data3 => {
			this.log('measuredValue', data3);
			const luminance = Math.round(Math.pow(10, (data3 - 1) / 10000));
			this.setCapabilityValue('measure_luminance', luminance);
		}, 1);

		// measure_battery
		this.registerAttrReportListener('genPowerCfg', 'batteryPercentageRemaining', 3600, 43200, 1, data4 => {
			this.log('measuredValue', data4);
			if (data4 <= 200 && data4 !== 255) {
				const percentageRemaining = Math.round(data4 / 2);
				this.setCapabilityValue('measure_battery', percentageRemaining);
			}
		}, 1);

		if (this.node) {
			this.node.on('command', report => {
				console.log('Command received');
				console.log(report);
			});
		}

	}

	onSettings( newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {

			callback( null, true );
			this.log(changedKeysArr);
			this.batteryThreshold = this.getSetting('batteryThreshold');
			this.minReportMotion = this.getSetting('minReportMotion');
			this.maxReportMotion = this.getSetting('maxReportMotion');
			this.minReportLux = this.getSetting('minReportLux');
			this.maxReportLux = this.getSetting('maxReportLux');
			this.minReportTemp = this.getSetting('minReportTemp');
			this.maxReportTemp= this.getSetting('maxReportTemp');

			this.log(`Battery Treshold: '${this.batteryThreshold}'`);
			this.log(`Min report interval motion: '${this.minReportMotion}'`);
			this.log(`Max report interval motion: '${this.maxReportMotion}'`);
			this.log(`Min report interval lux: '${this.minReportLux}'`);
			this.log(`Max report interval lux: '${this.maxReportLux}'`);
			this.log(`Min report interval temperature: '${this.minReportTemp}'`);
			this.log(`Max report interval temperature: '${this.maxReportTemp}'`);

			// alarm_motion report settings changed
			if ((changedKeysArr.includes('minReportMotion')) || (changedKeysArr.includes('maxReportMotion'))) {
					this.registerAttrReportListener('msOccupancySensing', 'occupancy', this.minReportMotion, this.maxReportMotion, 1, data => {
						this.log('occupancy', data);
						this.setCapabilityValue('alarm_motion', data === 1);
					}, 1);
			}
			// measure_temperature report settings changed
			if ((changedKeysArr.includes('minReportTemp')) || (changedKeysArr.includes('maxReportTemp'))) {
				this.registerAttrReportListener('msTemperatureMeasurement', 'measuredValue', this.minReportTemp, this.maxReportTemp, 10, data2 => {
					this.log('measuredValue', data2);
					const temperature = Math.round((data2 / 100) * 10) / 10;
					this.setCapabilityValue('measure_temperature', temperature);
				}, 1);
			}

			// measure_luminance report settings changed
			if ((changedKeysArr.includes('minReportLux')) || (changedKeysArr.includes('manReportLux'))) {
					this.registerAttrReportListener('msIlluminanceMeasurement', 'measuredValue', this.minReportLux, this.maxReportLux, 10, data3 => {
						this.log('measuredValue', data3);
						const luminance = Math.round(Math.pow(10, (data3 - 1) / 10000));
						this.setCapabilityValue('measure_luminance', luminance);
					}, 1);
			}

	}

}

module.exports = Motionsensor;
