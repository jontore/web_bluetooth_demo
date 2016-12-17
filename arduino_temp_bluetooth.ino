
#include <Wire.h>
#include <CurieBLE.h>
#include "rgb_lcd.h"

BLEPeripheral blePeripheral;       // BLE Peripheral Device (the board you're programming)
BLEService tempService("72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6");

// BLE Battery Level Characteristic"
BLEUnsignedCharCharacteristic tempCharacteristic("72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6",  // standard 16-bit characteristic UUID
    BLERead | BLENotify);

float oldTemperature = 0;
long previousMillis = 0;

const int B=4275;                 // B value of the thermistor
const int R0 = 100000;            // R0 = 100k

rgb_lcd lcd;

const int colorR = 255;
const int colorG = 255;
const int colorB = 255;

void setup() {
  Serial.begin(9600);
  pinMode(4, OUTPUT);

  Serial.println("Init.");
  //Setup bluetooth
  blePeripheral.setLocalName("TempMonitorSketch");
  blePeripheral.setAdvertisedServiceUuid(tempService.uuid());
  blePeripheral.addAttribute(tempService);
  blePeripheral.addAttribute(tempCharacteristic);
  tempCharacteristic.setValue(oldTemperature);

  //Setup display
  lcd.begin(16, 2);
  lcd.setRGB(colorR, colorG, colorB);

  blePeripheral.begin();
  lcd.print("Bluetooth device active, waiting for connections...");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLECentral central = blePeripheral.central();

  //Print temp while waiting
  float newTemperature = readTemperature();
  printTemperature(newTemperature);

  // if a central is connected to peripheral:
  if (central) {
    lcd.print("Connected to central: ");
    // print the central's MAC address:
    lcd.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(4, HIGH);

    // check the temp every 200ms
    // as long as the central is still connected:
    while (central.connected()) {
      long currentMillis = millis();
      // if 200ms have passed, check the battery level:
      if (currentMillis - previousMillis >= 200) {
        previousMillis = currentMillis;
        float newTemperature = readTemperature();
        printTemperature(newTemperature);
        updateTempLevel(newTemperature);
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(4, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }

   delay(200);
}

float readTemperature() {
  int val = analogRead(A0);

  float R = 1023.0/((float)val*0.66)-1.0;
  R = 100000.0*R;

  return (1.0/(log(R/100000.0)/B+1/298.15)-273.15);
}

void updateTempLevel(float temperature) {
  if (temperature != oldTemperature) {
    Serial.print("Temp is % is now: ");
    Serial.println(temperature);
    tempCharacteristic.setValue(temperature);
    oldTemperature = temperature;
  }
}

void printTemperature(float temperature) {
  lcd.setCursor(0, 0);
  lcd.clear();
  lcd.print(temperature);
}
