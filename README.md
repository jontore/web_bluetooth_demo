# Arduino 101 web bluetooth project

A project using a arduino 101, with a grove 1.2 temperature sensor and grove lcd display to read temperature.
The web application is using the new web-bluetooth api to connect and display the temperature over ble.
It is also works offline using sw.

## Web app

[Application available here](https://jontore.github.io/web_bluetooth_demo/)

The web-bluetooth is currently supported in chrome under experimental flags
Check here if your browser is supported. http://caniuse.com/#search=bluetooth

> A subset of the Web Bluetooth API is aiming to ship on Chrome OS, Chrome for Android M, and Mac in Chrome 56. In Chrome 55 or earlier, it > can be enabled experimentally on your origin in Origin Trials, or locally on your machine using an experimental flag. The implementation > is partially complete and currently available on Chrome OS, Chrome for Android M, Linux, and Mac.

> In Chrome 56 or later, go to chrome://flags/#enable-experimental-web-platform-features otherwise go to > chrome://flags/#enable-web-bluetooth, enable the highlighted flag, restart Chrome and you should be able to scan for and connect to nearby > Bluetooth devices, read/write Bluetooth characteristics, receive GATT Notifications and know when a Bluetooth device gets disconnected.


## React native app
Setup your environment [Here](https://facebook.github.io/react-native/docs/getting-started.html)
then run

```
  npm install
```

Open android studio, run virtual phone or connect your phone

```
react-native run-android
```

## Web app resources

* [ServiceWorker moz](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
* [ServiceWorker Jake archiebald](https://jakearchibald.com/2014/using-serviceworker-today/)
* [web-bluetooth chrome](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html)
* [web-bluetooth google](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web#connect_to_a_bluetooth_device)

## Arduino app resources
* [Grove temperature sensor 1.2](http://wiki.seeed.cc/Grove-Temperature_Sensor/)
* [Curie BLE lib for arduino 101](https://www.arduino.cc/en/Reference/CurieBLE)
* [Grove starter kit from seeedstudio](https://www.seeedstudio.com/Grove-Starter-Kit-for-Arduino-p-1855.html)
