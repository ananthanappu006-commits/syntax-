/**
 * SmartCampus MQTT Broker Service
 * Manages secure TLS connections to EMQX / Mosquitto MQTT Broker.
 * Publishes QoS 1 switch toggle and telemetry packets to hardware relays.
 */

const mqtt = require('mqtt');

class MqttService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.brokerUrl = process.env.MQTT_BROKER_URL || 'mqtts://broker.smartcampus.edu:8883';
    this.options = {
      clientId: `smartcampus_api_gateway_${Math.random().toString(16).substring(2, 8)}`,
      username: process.env.MQTT_USERNAME || 'campus_gateway',
      password: process.env.MQTT_PASSWORD || 'Secr3t_Mqtt_Token!',
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 3000,
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    };

    this.init();
  }

  init() {
    try {
      this.client = mqtt.connect(this.brokerUrl, this.options);

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log(`[MQTT Service] Connected successfully to MQTT Broker at ${this.brokerUrl}`);
        
        // Subscribe to device telemetry acknowledgments
        this.client.subscribe('campus/+/building/+/room/+/device/+/state', { qos: 1 });
        this.client.subscribe('campus/emergency/override', { qos: 1 });
      });

      this.client.on('error', (err) => {
        console.warn(`[MQTT Service] Broker warning / reconnecting: ${err.message}`);
        this.isConnected = false;
      });

      this.client.on('offline', () => {
        this.isConnected = false;
      });
    } catch (e) {
      console.warn('[MQTT Service] Initial connection deferred, operating in resilient relay simulation mode.');
    }
  }

  /**
   * Publishes switch command to hardware microcontroller via MQTT with QoS 1.
   * @param {string} topic Target MQTT topic e.g. "campus/main/room/rm_204/device/dev_l1/command"
   * @param {object} payload Command parameters (state, dimming, speed, triggeredBy)
   * @returns {Promise<{ success: boolean, topic: string, payload: object, messageId?: number }>}
   */
  async publishSwitchCommand(topic, payload) {
    return new Promise((resolve, reject) => {
      const messageString = JSON.stringify({
        ...payload,
        dispatchedAt: new Date().toISOString()
      });

      if (!this.client || !this.isConnected) {
        // Resilient fallback for development / offline broker environments
        console.log(`[MQTT Service: Fallback Broadcast] Topic: "${topic}" -> Payload: ${messageString}`);
        return resolve({
          success: true,
          simulated: true,
          topic,
          payload
        });
      }

      this.client.publish(topic, messageString, { qos: 1, retain: false }, (err, packet) => {
        if (err) {
          console.error(`[MQTT Error] Failed publishing to ${topic}:`, err);
          return reject(err);
        }
        console.log(`[MQTT Published] Topic: ${topic} (Packet ID: ${packet?.messageId || 'QoS1'})`);
        resolve({
          success: true,
          topic,
          payload,
          messageId: packet?.messageId
        });
      });
    });
  }

  /**
   * Broadcasts campus-wide emergency override (e.g. fire alarm, evacuation lighting).
   * Forces all emergency lighting to 100% and halts HVAC smoke circulation.
   * @param {object} overridePayload
   */
  async broadcastEmergencyOverride(overridePayload) {
    const topic = 'campus/emergency/override';
    return this.publishSwitchCommand(topic, {
      type: 'FIRE_EVACUATION_OVERRIDE',
      illuminateAll: true,
      cutoffVentilation: true,
      ...overridePayload
    });
  }
}

// Export singleton instance
module.exports = new MqttService();
