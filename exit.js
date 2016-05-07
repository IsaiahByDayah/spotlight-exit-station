var noble = require('noble');
var _ = require('underscore');
var Wearable = require('wearable-ble');

var CONSTANTS = require('./constants.js');

var config = require('./config.js');

var socket = require('socket.io-client')(CONSTANTS.SERVER_ENDPOINT);

//console.log(wearable);

// console.log(Feather);
// console.log(Feather().isFeather);

var activeWearables = {
	LEFT: null,
	RIGHT: null
};

socket.on('connect', function(){
	console.log("exit connected to socket.");

	// if (CONSTANTS.SEND_EXAMPLE_USER_EXIT) {
	// 	console.log("Sending sample user exit...");
	// 	socket.emit("UserExit", {
	// 		exit: config.side,
	// 		userID: "Jon"
	// 	});
	// }

	if (noble.state == "poweredOn") {
		console.log("exit starting to scan...");
		//noble.startScanning([], true);
		noble.startScanning();
	}
	noble.on('stateChange', function(state) {
		console.log("Noble state changed...");
		if (state === 'poweredOn') {
			console.log("exit starting to scan...");
			//noble.startScanning([], true);
			noble.startScanning();
		} else {
			noble.stopScanning();
			console.log("exit stopped scanning.");
		}
	});
});

socket.on('disconnect', function(){
	// MARK: Not sure what to do in this case
});

noble.on('discover', function(peripheral) {

	if (CONSTANTS.LOG_ALL_FOUND_DEVICES){
		logPeripheral(peripheral);
	}

	// Only connect if within range
	if (peripheral.rssi < CONSTANTS.MINIMUM_RSSI_TO_CONNECT) {
		return;
	}

  	// Check to see if peripheral is a wearable
  	if (new Wearable().isWearable(peripheral)) {
	// if (Feather.isFeather(peripheral)) {

		if (CONSTANTS.LOG_WEARABLE_DEVICES && !CONSTANTS.LOG_ALL_FOUND_DEVICES){
			logPeripheral(peripheral);
		}

		console.log("Wearable Found...");

		console.log("\tCreating new Wearable object...");

		var wearable = new Wearable(peripheral);

		console.log("\t\tAdding event listeners...");
		wearable.on("ready", function(err){

			if (err) {
				console.log("\t\tError on ready: " + err.message);
				wearable.disconnect();
				return;
			}

			console.log("\t\tWearable ready!");
		});

		wearable.on("rssi", function(err, rssi, callback){

			if (err) {
				console.log("\t\tError on rssi update: " + err.message);
				return;
			}

			console.log("\t\tRSSI updated!");
			console.log("\t\t\tCurrent rssi: " + rssi);

			// Disconnect from feather if RSSI is too low
			if (rssi < CONSTANTS.MINIMUM_RSSI_TO_STAY_CONNECTED) {
				wearable.disconnect();
				return;
			}

			if (rssi > CONSTANTS.MINIMUM_RSSI_TO_TRIGGER_EXIT) {

				if (activeWearables.LEFT == null) {
					// Set wearable to be active
					activeWearables.LEFT = wearable;

					// Trigger user to go through exit experience
					socket.emit("UserExit", {
						exit: "LEFT",
						userID: wearable._userID
					});

					// Set LED to green
					wearable.sendMessage("UpdateLED", 0);
					wearable.setColor(0, 255, 0);
				}

				else if (activeWearables.RIGHT == null) {
					// Set wearable to be active
					activeWearables.RIGHT = wearable;

					// Trigger user to go through exit experience
					socket.emit("UserExit", {
						exit: "RIGHT",
						userID: wearable._userID
					});

					// Set LED to green
					wearable.sendMessage("UpdateLED", 0);
					wearable.setColor(0, 255, 0);
				}
			}

			if (activeWearables.LEFT && wearable._userID == activeWearables.LEFT._userID) {
				if (rssi < CONSTANTS.MINIMUM_RSSI_TO_CONTINUE_EXIT) {
					wearable.sendMessage("ShutDown", {});
					wearable.disconnect();
				}
			}

			if (activeWearables.RIGHT && wearable._userID == activeWearables.RIGHT._userID) {
				if (rssi < CONSTANTS.MINIMUM_RSSI_TO_CONTINUE_EXIT) {
					wearable.sendMessage("ShutDown", {});
					wearable.disconnect();
				}
			}
		});

		wearable.on("disconnect", function(err){

			if (err) {
				console.log("\t\tError on disconnect: " + err.message);
				return;
			}

			console.log("\t\tWearable disconnected!");

			if (activeWearables.LEFT && wearable._userID == activeWearables.LEFT._userID) {
				// Active user disconnected
				console.log("Current user finished with exit experience.");
				activeWearables.LEFT = null;
			}

			if (activeWearables.RIGHT && wearable._userID == activeWearables.RIGHT._userID) {
				// Active user disconnected
				console.log("Current user finished with exit experience.");
				activeWearables.RIGHT = null;
			}
		});

		console.log("\t\tSetting up wearable...");
		wearable.setup();
	}
});

function logPeripheral(peripheral){
	console.log('peripheral discovered - ' + peripheral.id +
			  ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
			  ' connectable ' + peripheral.connectable + ',' +
			  ' RSSI ' + peripheral.rssi + ':');
	console.log('\thello my local name is:');
	console.log('\t\t' + peripheral.advertisement.localName);
	console.log('\tcan I interest you in any of the following advertised services:');
	console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

	var serviceData = peripheral.advertisement.serviceData;
	if (serviceData && serviceData.length) {
		console.log('\there is my service data:');
		for (var i in serviceData) {
			console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
		}
	}
	if (peripheral.advertisement.manufacturerData) {
		console.log('\there is my manufacturer data:');
		console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
	}
	if (peripheral.advertisement.txPowerLevel !== undefined) {
		console.log('\tmy TX power level is:');
		console.log('\t\t' + peripheral.advertisement.txPowerLevel);
	}
}


