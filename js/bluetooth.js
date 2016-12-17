 var BLUETOOTH_UUID = '72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6';

 function findDevices() {
  navigator.bluetooth.requestDevice({ filters: [{ services: [BLUETOOTH_UUID] }] })
  .then(function(device) {
    onDeviceConnect();
    return device.gatt.connect();
  })
  .then(function(server) {
    return server.getPrimaryService(BLUETOOTH_UUID);
  })
  .then(function(service) {
    return service.getCharacteristic(BLUETOOTH_UUID);
  })
  .then(onConnectToCharacteristic)
  .then(updateTemp)
  .catch(function(error) { console.log(error); });
}

function onConnectToCharacteristic(characteristic) {
  characteristic.addEventListener('characteristicvaluechanged', handleTempChanged);
  showTempSection();

  setInterval(function () {
    return characteristic.readValue();
  }, 1000);

  return characteristic.readValue();
}

function onDeviceConnect() {
  showTempSection();
}

function handleTempChanged(event) {
  var temp = event.target.value;

  updateTemp(temp);
}

function showTempSection() {
  document.querySelector('.js-temperature-section').classList.remove('hidden');
  document.querySelector('.js-connect-section').classList.add('hidden');
}

function updateTemp(temp) {
  document.querySelector('#temp-container').innerText = temp.getUint8(0);
}

function showErrorMessage() {
  document.querySelector('.js-connect-section').classList.add('hidden');
  document.querySelector('.js-error-section').classList.remove('hidden');
}

function initEvents() {
  document.querySelector('#find-devices').addEventListener('click', findDevices);
}

if(!navigator.bluetooth) {
  showErrorMessage();
}

initEvents();
