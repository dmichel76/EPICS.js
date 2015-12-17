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

Then point your browser to port 8080:

![screenshot](screenshot.png?raw=true "screenshot")

