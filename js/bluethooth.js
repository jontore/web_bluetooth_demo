 function findDevices() {
  navigator.bluetooth.requestDevice({ filters: [{ services: ['72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6'] }] })
  .then(function(device) {
    return device.gatt.connect();
  })
  .then(function(server) {
    // Getting Battery Service...
    return server.getPrimaryService('72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6');
  })
  .then(function(service) {
    // Getting Battery Level Characteristic...
    return service.getCharacteristic('72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6');
  })
  .then(function(characteristic) {
    // Reading Battery Level...
    setInterval(function () {
      return characteristic.readValue().then(function(value) {
        console.log('Temp is' + value.getUint8(0));
      });
    }, 1000);
  })
  .catch(function(error) { console.log(error); });
}

document.querySelector('#find-devices').addEventListener('click', findDevices);
