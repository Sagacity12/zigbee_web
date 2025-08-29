"use client"

import { useState, useEffect, useCallback } from "react"

export interface SensorData {
  id: string
  name: string
  location: string
  temperature: number
  humidity: number
  battery: number
  lastSeen: Date
  isOnline: boolean
  signal: number
}

export interface SecurityDevice {
  id: string
  name: string
  type: "door" | "window" | "motion" | "glass" | "smoke"
  zone: string
  status: "armed" | "disarmed" | "triggered" | "bypassed"
  battery: number
  signal: number
  lastSeen: Date
  isOnline: boolean
  tampered: boolean
}

export interface AlertItem {
  id: string
  type: "temperature" | "humidity" | "security" | "battery" | "offline" | "system"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  deviceId: string
  deviceName: string
  timestamp: Date
  acknowledged: boolean
  resolved: boolean
  value?: number
  threshold?: number
}

export interface RealtimeData {
  sensors: SensorData[]
  securityDevices: SecurityDevice[]
  alerts: AlertItem[]
  systemArmed: boolean
  connectionStatus: "connected" | "connecting" | "disconnected"
  lastUpdate: Date
  selectedLocations: string[]
  availableLocations: string[]
}

export interface TemperatureThresholds {
  highWarning: number
  highCritical: number
  lowWarning: number
  lowCritical: number
  enableHighAlerts: boolean
  enableLowAlerts: boolean
  enableCriticalAlerts: boolean
}

export function useRealtimeData() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [availableLocations] = useState<string[]>([
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Basement",
    "Attic",
    "Barn",
    "Greenhouse",
    "Chicken Coop",
    "Feed Storage",
    "Car",
    "Truck",
    "RV",
    "Garden Shed",
    "Pool House",
    "Garage",
    "Workshop",
    "Warehouse",
    "Office",
  ])

  const [data, setData] = useState<RealtimeData>({
    sensors: [
      {
        id: "temp_001",
        name: "Living Room",
        location: "Living Room",
        temperature: 22.5,
        humidity: 45,
        battery: 85,
        lastSeen: new Date(),
        isOnline: true,
        signal: 92,
      },
      {
        id: "temp_002",
        name: "Bedroom",
        location: "Bedroom",
        temperature: 21.8,
        humidity: 42,
        battery: 78,
        lastSeen: new Date(),
        isOnline: true,
        signal: 88,
      },
      {
        id: "temp_003",
        name: "Kitchen",
        location: "Kitchen",
        temperature: 24.2,
        humidity: 38,
        battery: 92,
        lastSeen: new Date(),
        isOnline: true,
        signal: 85,
      },
      {
        id: "temp_004",
        name: "Basement",
        location: "Basement",
        temperature: 18.5,
        humidity: 65,
        battery: 73,
        lastSeen: new Date(),
        isOnline: true,
        signal: 75,
      },
      {
        id: "temp_005",
        name: "Attic",
        location: "Attic",
        temperature: 28.3,
        humidity: 35,
        battery: 81,
        lastSeen: new Date(),
        isOnline: true,
        signal: 68,
      },
      {
        id: "temp_006",
        name: "Barn",
        location: "Barn",
        temperature: 16.2,
        humidity: 72,
        battery: 89,
        lastSeen: new Date(),
        isOnline: true,
        signal: 82,
      },
      {
        id: "temp_007",
        name: "Greenhouse",
        location: "Greenhouse",
        temperature: 26.8,
        humidity: 78,
        battery: 94,
        lastSeen: new Date(),
        isOnline: true,
        signal: 91,
      },
      {
        id: "temp_008",
        name: "Chicken Coop",
        location: "Chicken Coop",
        temperature: 19.4,
        humidity: 58,
        battery: 67,
        lastSeen: new Date(),
        isOnline: true,
        signal: 79,
      },
      {
        id: "temp_009",
        name: "Feed Storage",
        location: "Feed Storage",
        temperature: 15.7,
        humidity: 48,
        battery: 86,
        lastSeen: new Date(),
        isOnline: true,
        signal: 84,
      },
      {
        id: "temp_010",
        name: "Car Interior",
        location: "Car",
        temperature: 32.1,
        humidity: 25,
        battery: 91,
        lastSeen: new Date(),
        isOnline: true,
        signal: 88,
      },
      {
        id: "temp_011",
        name: "Truck Cabin",
        location: "Truck",
        temperature: 29.5,
        humidity: 30,
        battery: 76,
        lastSeen: new Date(),
        isOnline: true,
        signal: 85,
      },
      {
        id: "temp_012",
        name: "RV Interior",
        location: "RV",
        temperature: 23.8,
        humidity: 41,
        battery: 88,
        lastSeen: new Date(),
        isOnline: true,
        signal: 72,
      },
      {
        id: "temp_013",
        name: "Garden Shed",
        location: "Garden Shed",
        temperature: 20.3,
        humidity: 62,
        battery: 79,
        lastSeen: new Date(),
        isOnline: true,
        signal: 77,
      },
      {
        id: "temp_014",
        name: "Pool House",
        location: "Pool House",
        temperature: 25.6,
        humidity: 68,
        battery: 83,
        lastSeen: new Date(),
        isOnline: true,
        signal: 89,
      },
      {
        id: "temp_015",
        name: "Garage",
        location: "Garage",
        temperature: 17.9,
        humidity: 52,
        battery: 71,
        lastSeen: new Date(),
        isOnline: true,
        signal: 86,
      },
      {
        id: "temp_016",
        name: "Workshop",
        location: "Workshop",
        temperature: 21.4,
        humidity: 44,
        battery: 90,
        lastSeen: new Date(),
        isOnline: true,
        signal: 93,
      },
      {
        id: "temp_017",
        name: "Warehouse",
        location: "Warehouse",
        temperature: 19.8,
        humidity: 39,
        battery: 85,
        lastSeen: new Date(),
        isOnline: true,
        signal: 81,
      },
      {
        id: "temp_018",
        name: "Office",
        location: "Office",
        temperature: 22.1,
        humidity: 43,
        battery: 87,
        lastSeen: new Date(),
        isOnline: true,
        signal: 94,
      },
    ],
    securityDevices: [
      {
        id: "door_001",
        name: "Front Door",
        type: "door",
        zone: "Entry",
        status: "armed",
        battery: 92,
        signal: 95,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "window_001",
        name: "Living Room Window",
        type: "window",
        zone: "Living Room",
        status: "armed",
        battery: 88,
        signal: 90,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "motion_001",
        name: "Hallway Motion",
        type: "motion",
        zone: "Hallway",
        status: "armed",
        battery: 76,
        signal: 82,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "door_002",
        name: "Barn Door",
        type: "door",
        zone: "Barn",
        status: "armed",
        battery: 84,
        signal: 78,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "motion_002",
        name: "Greenhouse Motion",
        type: "motion",
        zone: "Greenhouse",
        status: "armed",
        battery: 91,
        signal: 87,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "door_003",
        name: "Feed Storage Door",
        type: "door",
        zone: "Feed Storage",
        status: "armed",
        battery: 79,
        signal: 83,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "motion_003",
        name: "Car Motion Sensor",
        type: "motion",
        zone: "Car",
        status: "armed",
        battery: 88,
        signal: 85,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "glass_001",
        name: "Truck Window Sensor",
        type: "glass",
        zone: "Truck",
        status: "armed",
        battery: 73,
        signal: 79,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "door_004",
        name: "Garage Door",
        type: "door",
        zone: "Garage",
        status: "armed",
        battery: 86,
        signal: 91,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "motion_004",
        name: "Workshop Motion",
        type: "motion",
        zone: "Workshop",
        status: "armed",
        battery: 82,
        signal: 88,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
      {
        id: "smoke_001",
        name: "Warehouse Smoke Detector",
        type: "smoke",
        zone: "Warehouse",
        status: "armed",
        battery: 95,
        signal: 92,
        lastSeen: new Date(),
        isOnline: true,
        tampered: false,
      },
    ],
    alerts: [],
    systemArmed: false,
    connectionStatus: "connected",
    lastUpdate: new Date(),
    selectedLocations: [],
    availableLocations: [
      "Living Room",
      "Bedroom",
      "Kitchen",
      "Basement",
      "Attic",
      "Barn",
      "Greenhouse",
      "Chicken Coop",
      "Feed Storage",
      "Car",
      "Truck",
      "RV",
      "Garden Shed",
      "Pool House",
      "Garage",
      "Workshop",
      "Warehouse",
      "Office",
    ],
  })

  const [temperatureThresholds, setTemperatureThresholds] = useState<TemperatureThresholds>({
    highWarning: 25,
    highCritical: 27,
    lowWarning: 18,
    lowCritical: 15,
    enableHighAlerts: true,
    enableLowAlerts: true,
    enableCriticalAlerts: true,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const updatedSensors = prevData.sensors.map((sensor) => {
          // Simulate realistic temperature and humidity variations
          const tempVariation = (Math.random() - 0.5) * 2 // ±1°C variation
          const humidityVariation = (Math.random() - 0.5) * 6 // ±3% variation
          const batteryDrain = Math.random() < 0.01 ? 1 : 0 // Occasional battery drain

          const newTemp = Math.max(10, Math.min(35, sensor.temperature + tempVariation))
          const newHumidity = Math.max(20, Math.min(80, sensor.humidity + humidityVariation))
          const newBattery = Math.max(0, sensor.battery - batteryDrain)

          return {
            ...sensor,
            temperature: Math.round(newTemp * 10) / 10,
            humidity: Math.round(newHumidity),
            battery: newBattery,
            lastSeen: new Date(),
            signal: Math.max(70, Math.min(100, sensor.signal + (Math.random() - 0.5) * 10)),
          }
        })

        // Generate temperature alerts based on thresholds
        const newAlerts: AlertItem[] = []
        updatedSensors.forEach((sensor) => {
          const existingHighAlert = prevData.alerts.find(
            (alert) => alert.deviceId === sensor.id && alert.type === "temperature" && !alert.resolved,
          )

          // High temperature alerts
          if (
            temperatureThresholds.enableHighAlerts &&
            sensor.temperature >= temperatureThresholds.highWarning &&
            !existingHighAlert
          ) {
            const severity = sensor.temperature >= temperatureThresholds.highCritical ? "critical" : "high"
            newAlerts.push({
              id: `temp_high_${sensor.id}_${Date.now()}`,
              type: "temperature",
              severity,
              title: severity === "critical" ? "Critical Temperature" : "High Temperature",
              description: `${sensor.name} temperature is ${sensor.temperature}°C (threshold: ${temperatureThresholds.highWarning}°C)`,
              deviceId: sensor.id,
              deviceName: sensor.name,
              timestamp: new Date(),
              acknowledged: false,
              resolved: false,
              value: sensor.temperature,
              threshold: temperatureThresholds.highWarning,
            })
          }

          // Low temperature alerts
          if (
            temperatureThresholds.enableLowAlerts &&
            sensor.temperature <= temperatureThresholds.lowWarning &&
            !existingHighAlert
          ) {
            const severity = sensor.temperature <= temperatureThresholds.lowCritical ? "critical" : "medium"
            newAlerts.push({
              id: `temp_low_${sensor.id}_${Date.now()}`,
              type: "temperature",
              severity,
              title: severity === "critical" ? "Critical Low Temperature" : "Low Temperature",
              description: `${sensor.name} temperature is ${sensor.temperature}°C (threshold: ${temperatureThresholds.lowWarning}°C)`,
              deviceId: sensor.id,
              deviceName: sensor.name,
              timestamp: new Date(),
              acknowledged: false,
              resolved: false,
              value: sensor.temperature,
              threshold: temperatureThresholds.lowWarning,
            })
          }

          // Battery alerts
          if (sensor.battery <= 20) {
            const existingBatteryAlert = prevData.alerts.find(
              (alert) => alert.deviceId === sensor.id && alert.type === "battery" && !alert.resolved,
            )
            if (!existingBatteryAlert) {
              newAlerts.push({
                id: `battery_${sensor.id}_${Date.now()}`,
                type: "battery",
                severity: sensor.battery <= 10 ? "high" : "medium",
                title: "Low Battery",
                description: `${sensor.name} battery is at ${sensor.battery}%`,
                deviceId: sensor.id,
                deviceName: sensor.name,
                timestamp: new Date(),
                acknowledged: false,
                resolved: false,
                value: sensor.battery,
              })
            }
          }
        })

        return {
          ...prevData,
          sensors: updatedSensors,
          alerts: [...prevData.alerts, ...newAlerts],
          lastUpdate: new Date(),
        }
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [temperatureThresholds])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setData((prevData) => ({
      ...prevData,
      alerts: prevData.alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)),
    }))
  }, [])

  const resolveAlert = useCallback((alertId: string) => {
    setData((prevData) => ({
      ...prevData,
      alerts: prevData.alerts.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)),
    }))
  }, [])

  const toggleSystemArmed = useCallback(() => {
    setData((prevData) => ({
      ...prevData,
      systemArmed: !prevData.systemArmed,
    }))
  }, [])

  const updateTemperatureThresholds = useCallback((newThresholds: TemperatureThresholds) => {
    setTemperatureThresholds(newThresholds)
  }, [])

  const toggleLocationSelection = useCallback((location: string) => {
    setSelectedLocations((prev) => {
      const newSelection = prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]

      setData((prevData) => ({
        ...prevData,
        selectedLocations: newSelection,
      }))

      return newSelection
    })
  }, [])

  const selectAllLocations = useCallback(() => {
    setSelectedLocations(availableLocations)
    setData((prevData) => ({
      ...prevData,
      selectedLocations: availableLocations,
    }))
  }, [availableLocations])

  const clearLocationSelection = useCallback(() => {
    setSelectedLocations([])
    setData((prevData) => ({
      ...prevData,
      selectedLocations: [],
    }))
  }, [])

  const toggleDeviceConnection = useCallback((deviceId: string, deviceType: "sensor" | "security") => {
    setData((prevData) => {
      if (deviceType === "sensor") {
        return {
          ...prevData,
          sensors: prevData.sensors.map((sensor) =>
            sensor.id === deviceId ? { ...sensor, isOnline: !sensor.isOnline, lastSeen: new Date() } : sensor,
          ),
        }
      } else {
        return {
          ...prevData,
          securityDevices: prevData.securityDevices.map((device) =>
            device.id === deviceId ? { ...device, isOnline: !device.isOnline, lastSeen: new Date() } : device,
          ),
        }
      }
    })
  }, [])

  const toggleSystemConnection = useCallback(() => {
    setData((prevData) => ({
      ...prevData,
      connectionStatus: prevData.connectionStatus === "connected" ? "disconnected" : "connected",
    }))
  }, [])

  return {
    data,
    acknowledgeAlert,
    resolveAlert,
    toggleSystemArmed,
    updateTemperatureThresholds,
    temperatureThresholds,
    toggleLocationSelection,
    selectAllLocations,
    clearLocationSelection,
    toggleDeviceConnection,
    toggleSystemConnection,
    selectedLocations,
    availableLocations,
  }
}
