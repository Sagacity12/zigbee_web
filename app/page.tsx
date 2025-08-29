"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Shield, Wifi, Battery, Bell } from "lucide-react"
import Link from "next/link"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { ConnectionStatus } from "@/components/connection-status"

export default function ZigbeeDashboard() {
  const {
    data,
    toggleSystemArmed,
    toggleLocationSelection,
    selectAllLocations,
    clearLocationSelection,
    toggleDeviceConnection,
    toggleSystemConnection,
    selectedLocations,
    availableLocations,
  } = useRealtimeData()

  const getTemperatureColor = (temp: number) => {
    if (temp < 18) return "text-blue-600"
    if (temp > 25) return "text-red-600"
    return "text-green-600"
  }

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30 || humidity > 60) return "text-orange-600"
    return "text-blue-600"
  }

  const getBatteryColor = (battery: number) => {
    if (battery < 30) return "text-red-600"
    if (battery < 60) return "text-orange-600"
    return "text-green-600"
  }

  const activeAlerts = data.alerts.filter((alert) => !alert.resolved && !alert.acknowledged)

  const filteredSensors =
    selectedLocations.length > 0
      ? data.sensors.filter((sensor) => selectedLocations.includes(sensor.location))
      : data.sensors

  const filteredSecurityDevices =
    selectedLocations.length > 0
      ? data.securityDevices.filter((device) => selectedLocations.includes(device.zone))
      : data.securityDevices

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Smart Hub Central</h1>
            <p className="text-slate-600 mt-1">Monitor your smart home devices and sensors</p>
            <div className="mt-2">
              <ConnectionStatus status={data.connectionStatus} lastUpdate={data.lastUpdate} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={data.systemArmed ? "destructive" : "secondary"} className="px-3 py-1">
              <Shield className="w-4 h-4 mr-1" />
              {data.systemArmed ? "Armed" : "Disarmed"}
            </Badge>
            <Link href="/alerts">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Alerts ({activeAlerts.length})
              </Button>
            </Link>
            <Button
              onClick={toggleSystemConnection}
              variant={data.connectionStatus === "connected" ? "destructive" : "default"}
              size="sm"
            >
              <Wifi className="w-4 h-4 mr-2" />
              {data.connectionStatus === "connected" ? "Disconnect" : "Connect"}
            </Button>
            <Button onClick={toggleSystemArmed} variant={data.systemArmed ? "outline" : "default"}>
              {data.systemArmed ? "Disarm System" : "Arm System"}
            </Button>
          </div>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Location Filter</CardTitle>
            <CardDescription>Select locations to monitor (leave empty to show all)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableLocations.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocations.includes(location) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleLocationSelection(location)}
                  className="text-xs"
                >
                  {location}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={selectAllLocations} variant="outline" size="sm">
                Select All
              </Button>
              <Button onClick={clearLocationSelection} variant="outline" size="sm">
                Clear All
              </Button>
              <div className="ml-auto text-sm text-slate-600">
                {selectedLocations.length > 0
                  ? `${selectedLocations.length} locations selected`
                  : "All locations shown"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature & Humidity Sensors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Temperature & Humidity Sensors
              {selectedLocations.length > 0 && (
                <span className="text-sm font-normal text-slate-600 ml-2">
                  ({filteredSensors.length} of {data.sensors.length})
                </span>
              )}
            </h2>
            <Link href="/temperature">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSensors.map((sensor) => (
              <Card key={sensor.id} className={`${sensor.isOnline ? "border-green-200" : "border-red-200"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sensor.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleDeviceConnection(sensor.id, "sensor")}>
                        <Wifi
                          className={`w-4 h-4 ${sensor.isOnline ? "text-green-600" : "text-red-600"} hover:opacity-70`}
                        />
                      </button>
                      <Battery className={`w-4 h-4 ${getBatteryColor(sensor.battery)}`} />
                    </div>
                  </div>
                  <CardDescription>Last seen: {sensor.lastSeen.toLocaleTimeString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className={`w-5 h-5 ${getTemperatureColor(sensor.temperature)}`} />
                      <span className="text-sm text-slate-600">Temperature</span>
                    </div>
                    <span className={`text-xl font-bold ${getTemperatureColor(sensor.temperature)}`}>
                      {sensor.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className={`w-5 h-5 ${getHumidityColor(sensor.humidity)}`} />
                      <span className="text-sm text-slate-600">Humidity</span>
                    </div>
                    <span className={`text-xl font-bold ${getHumidityColor(sensor.humidity)}`}>{sensor.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Battery</span>
                    <span className={`font-medium ${getBatteryColor(sensor.battery)}`}>{sensor.battery}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Devices */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Security Devices
              {selectedLocations.length > 0 && (
                <span className="text-sm font-normal text-slate-600 ml-2">
                  ({filteredSecurityDevices.length} of {data.securityDevices.length})
                </span>
              )}
            </h2>
            <Link href="/security">
              <Button variant="outline" size="sm">
                Manage Security
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSecurityDevices.map((device) => (
              <Card key={device.id} className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleDeviceConnection(device.id, "security")}>
                        <Wifi
                          className={`w-4 h-4 ${device.isOnline ? "text-green-600" : "text-red-600"} hover:opacity-70`}
                        />
                      </button>
                      <Badge
                        variant={
                          device.status === "armed"
                            ? "default"
                            : device.status === "triggered"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="capitalize">
                    {device.type} sensor • Battery: {device.battery}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600">Last seen: {device.lastSeen.toLocaleTimeString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Overview of your Zigbee network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredSensors.filter((s) => s.isOnline).length}
                </div>
                <div className="text-sm text-slate-600">Sensors Online</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredSecurityDevices.filter((d) => d.status === "armed").length}
                </div>
                <div className="text-sm text-slate-600">Armed Devices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{activeAlerts.length}</div>
                <div className="text-sm text-slate-600">Active Alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600">
                  {filteredSensors.length + filteredSecurityDevices.length > 0
                    ? Math.round(
                        (filteredSensors.reduce((acc, s) => acc + s.battery, 0) +
                          filteredSecurityDevices.reduce((acc, d) => acc + d.battery, 0)) /
                          (filteredSensors.length + filteredSecurityDevices.length),
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-slate-600">Avg Battery</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
