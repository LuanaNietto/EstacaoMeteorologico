#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define DHT11_PIN  21 // ESP32 pin GPIO21 connected to DHT11 sensor
const char *ssid = "POCO F4"; // SSID da rede
const char *password = "01061997"; // SENHA
const char *apiUrl = "http://localhost:3001/api/weather"; // API URL/IP mudar de acordo com js

DHT dht11(DHT11_PIN, DHT11);

void setup() {
  Serial.begin(115200);
  dht11.begin(); // initialize the DHT11 sensor
  
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  int tryDelay = 1000;
  int numberOfTries = 50;
  while (WiFi.status() != WL_CONNECTED) {

    switch (WiFi.status()) {
      case WL_NO_SSID_AVAIL: Serial.println("[WiFi] SSID not found"); break;
      case WL_CONNECT_FAILED:
        Serial.print("[WiFi] Failed - WiFi not connected! Reason: ");
        return;
        break;
      case WL_CONNECTION_LOST: Serial.println("[WiFi] Connection was lost"); break;
      case WL_SCAN_COMPLETED:  Serial.println("[WiFi] Scan is completed"); break;
      case WL_DISCONNECTED:    Serial.println("[WiFi] WiFi is disconnected"); break;
      case WL_CONNECTED:
        Serial.println("[WiFi] WiFi is connected!");
        Serial.print("[WiFi] IP address: ");
        Serial.println(WiFi.localIP());
        return;
        break;
      default:
        Serial.print("[WiFi] WiFi Status: ");
        Serial.println(WiFi.status());
        break;
    }
    delay(tryDelay);

    if (numberOfTries <= 0) {
      Serial.print("[WiFi] Failed to connect to WiFi!");
      // Use disconnect function to force stop trying to connect
      WiFi.disconnect();
      return;
    } else {
      numberOfTries--;
    }
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    //server.begin();
  }
}

void loop() {
  // read humidity
  float humi  = dht11.readHumidity();
  // read temperature in Celsius
  float tempC = dht11.readTemperature();
  // read temperature in Fahrenheit
  float tempF = dht11.readTemperature(true);


  // check whether the reading is successful or not
  if ( isnan(tempC) || isnan(tempF) || isnan(humi)) {
    Serial.println("Failed to read from DHT11 sensor!");
  } else {
    Serial.print("Humidity: ");
    Serial.print(humi);
    Serial.print("%");

    Serial.print("  |  ");

    Serial.print("Temperature: ");
    Serial.print(tempC);
    Serial.print("°C  ~  ");
    Serial.print(tempF);
    Serial.println("°F");
  }
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.setReuse(false);
    http.begin(apiUrl);
    http.addHeader("Content-Type", "application/json");

    String tempCstr = String(tempC);
    String humiStr = String(humi);
    String jsonData = String("{\"temperature\":"+tempCstr+", \"humidity\":"+humiStr+"}");
    int httpResponseCode = http.POST(jsonData);
    //int httpResponseCode = http.GET();

    if(httpResponseCode == 200) {
      Serial.print("Resposta HTTP: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.print("Erro requisição POST: ");
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();

  }

  // wait 5 seconds between readings
  delay(5000);
}
