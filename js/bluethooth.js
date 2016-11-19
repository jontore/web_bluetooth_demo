 function findDevices() {
  navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
  .then(function(device) {
    console.log('--- dev', device);
    return device.gatt.connect();
  })
  .then(function(server) {
    // Getting Battery Service...
    return server.getPrimaryService('battery_service');
  })
  .then(function(service) {
    // Getting Battery Level Characteristic...
    return service.getCharacteristic('battery_level');
  })
  .then(function(characteristic) {
    // Reading Battery Level...
    setInterval(function () {
      return characteristic.readValue().then(function(value) {
        console.log('Battery percentage is ' + value.getUint8(0));
      });
    }, 1000);
  })
  .catch(function(error) { console.log(error); });
}

document.querySelector('#find-devices').addEventListener('click', findDevices);
