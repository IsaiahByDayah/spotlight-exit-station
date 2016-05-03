module.exports = {
	/*
		EXHIBIT
	*/

	// Peripheral ID of Feathers
	// NOTE: Not sure if this is unique or not per device
	// MARK: NOT USED IN CURRENT IMPLEMENTATION
	WEARABLE_PERIPHERAL_ID: "f5ca9cca32ee48fdb72ff891e8682203",

	// Readable name for Feathers
	// NOTE: Not sure if this is unique or not per device
	WEARABLE_LOCAL_NAME: "Adafruit Bluefruit LE",

	// Flag for if all discovered peripherals should be logged out
	LOG_ALL_FOUND_DEVICES:  false,

	// Flag for if discovered Feather peripherals should be logged out
	LOG_WEARABLE_DEVICES: false,

	// Flag for if exhibit should send a sample exhibitCheck message on socket connect
	SEND_EXAMPLE_EXHIBIT_CHECK: false,

	// What the minimum rssi to accept before disconnecting
	MINIMUM_RSSI_TO_CONNECT: -500,

	// What the minimum rssi to accept in order to stay connected
	MINIMUM_RSSI_TO_STAY_CONNECTED: -1000,

	// What the minimum rssi is to trigger that this user should go through exit experience
	MINIMUM_RSSI_TO_TRIGGER_EXIT: -50,

	// What the minimum rssi is for user to be at exit experience
	MINIMUM_RSSI_TO_CONTINUE_EXIT: -60,

	// What is the minimum rssi to be considered in mid-range
	SIGNAL_STRENGTH_MID_BREAKPOINT: -75,

	// What is the minimum rssi to be considered in close-range
	SIGNAL_STRENGTH_CLOSE_BREAKPOINT: -65,

	// Heroku endpoint to connect via Socket.io
	SERVER_ENDPOINT: "https://jason-loves-boston.herokuapp.com/"
};