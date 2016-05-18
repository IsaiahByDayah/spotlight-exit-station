# spotlight-exit-station

##### Raspberry Pi systems that communicate with [Spotlight Wearables](https://github.com/jordankid93/spotlight-wearable) for ending a user's experiences through a museum

### Description:
The spotlight exit station is a Node.js application you can run on any compatible device such as a laptop, desktop or microcomputer that will allow users to end their experience through the museum and trigger the biggining of their exit experience where they can dive deeper into their time with the exhibits, see what attracted their attention the most, and find out more about info about artists, bands, and music they love. 

### Pre-requisites:
- OS
  - [Ubuntu Mate 15.10.3+ for Raspberry Pi](https://ubuntu-mate.org/raspberry-pi/)[Tested]
- Hardware
  - Bluetooth Low-Energy Adapter
  - Internet Connection
- Software
  - Node.js


### Libraries used:
- Noble ([Source](https://github.com/sandeepmistry/noble))
- wearable-ble ([Source](https://github.com/jordankid93/wearable-ble))
- Underscore ([Source](http://underscorejs.org))

### Usage:
To get up and running with a Spotlight exit station, clone this repo on the device you want to use and install the required node modules:
```shell
git clone https://github.com/jordankid93/spotlight-exit-station.git
cd spotlight-exit-station
npm install
```

Once modules have been installed, edit the config.js file so that the exit station is making the appropriate calls with the backend.

Once done, simply run the application via npm or node directly
```shell
npm start // Via npm
node exit.js // Node directly
```
