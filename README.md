# epics.js
A platform for developing web UIs for EPICS IOCs using Node.js, AngularJS and SVG

##To install:
```shell
cd server
npm install
cd ../client
bower install

```

##Usage
start the server:
```shell
node server/server.js --pvs=file_containing_pvs
```

where the ```file``` contains a list of the PVs that the node.js server listens to and broacasts to the browser. By default, the server will look for the file ```default.pvs``` in the server directory if no file is specified.

##Screenshot

<img src="screenshot.png" align="center" width="600">

