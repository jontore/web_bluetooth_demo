
#include <CurieBLE.h>

BLEPeripheral blePeripheral;       // BLE Peripheral Device (the board you're programming)
BLEService tempService("72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6");

// BLE Battery Level Characteristic"
BLEUnsignedCharCharacteristic tempCharacteristic("72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6",  // standard 16-bit characteristic UUID
    BLERead | BLENotify);

float oldTemperature = 0;
long previousMillis = 0;

const int B=4275;                 // B value of the thermistor
const int R0 = 100000;            // R0 = 100k


void setup() {
  Serial.begin(9600);
  pinMode(4, OUTPUT);

  Serial.println("INit.");
  blePeripheral.setLocalName("TempMonitorSketch");
  blePeripheral.setAdvertisedServiceUuid(tempService.uuid());
  blePeripheral.addAttribute(tempService);
  blePeripheral.addAttribute(tempCharacteristic);
  tempCharacteristic.setValue(oldTemperature);

  /* Now activate the BLE device.  It will start continuously transmitting BLE
     advertising packets and will be visible to remote BLE central devices
     until it receives a new connection */
  blePeripheral.begin();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLECentral central = blePeripheral.central();

  Serial.println("Wait");
  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(4, HIGH);

    // check the temp every 200ms
    // as long as the central is still connected:
    while (central.connected()) {
      long currentMillis = millis();
      // if 200ms have passed, check the battery level:
      if (currentMillis - previousMillis >= 200) {
        previousMillis = currentMillis;
        updateTempLevel();
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(4, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}

void updateTempLevel() {
  int val = analogRead(A0);

  float R = 1023.0/((float)val)-1.0;
  R = 100000.0*R;

  float temperature = 1.0/(log(R/100000.0)/B+1/298.15)-273.15;//convert to temperature via datasheet ;


  if (temperature != oldTemperature) {
    Serial.print("Temp is % is now: ");
    Serial.println(temperature);
    tempCharacteristic.setValue(temperature);
    oldTemperature = temperature;
  }
}
