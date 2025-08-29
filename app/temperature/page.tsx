"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Thermometer, Droplets, TrendingUp, TrendingDown, ArrowLeft, AlertTriangle, Download } from "lucide-react"
import Link from "next/link"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { ConnectionStatus } from "@/components/connection-status"

export default function TemperatureMonitor() {
  const { data } = useRealtimeData()
  const [selectedSensor, setSelectedSensor] = useState<string>(data.sensors[0]?.id || "")

  const selectedSensorData = data.sensors.find((s) => s.id === selectedSensor)

  const getTemperatureStatus = (temp: number, min = 18, max = 25) => {
    if (temp < min) return { status: "low", color: "text-blue-600", icon: TrendingDown }
    if (temp > max) return { status: "high", color: "text-red-600", icon: TrendingUp }
    return { status: "normal", color: "text-green-600", icon: Thermometer }
  }

  const getHumidityStatus = (humidity: number, min = 30, max = 60) => {
    if (humidity < min || humidity > max) {
      return { status: "warning", color: "text-orange-600", icon: AlertTriangle }
    }
    return { status: "normal", color: "text-blue-600", icon: Droplets }
  }

  const exportData = () => {
    if (!selectedSensorData) return

    const csvContent = [
      "Timestamp,Temperature (°C),Humidity (%)",
      `${new Date().toISOString()},${selectedSensorData.temperature},${selectedSensorData.humidity}`,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedSensorData.name}_data.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Temperature & Humidity Monitor</h1>
              <p className="text-slate-600 mt-1">Real-time environmental monitoring and analysis</p>
              <div className="mt-2">
                <ConnectionStatus status={data.connectionStatus} lastUpdate={data.lastUpdate} />
              </div>
            </div>
          </div>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Sensor Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Sensor</CardTitle>
            <CardDescription>Choose a sensor to view detailed real-time information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.sensors.map((sensor) => {
                const tempStatus = getTemperatureStatus(sensor.temperature)
                const humidityStatus = getHumidityStatus(sensor.humidity)

                return (
                  <Card
                    key={sensor.id}
                    className={`cursor-pointer transition-all ${
                      selectedSensor === sensor.id ? "ring-2 ring-blue-500 border-blue-200" : "hover:border-slate-300"
                    } ${!sensor.isOnline ? "opacity-60" : ""}`}
                    onClick={() => setSelectedSensor(sensor.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{sensor.name}</CardTitle>
                        <Badge variant={sensor.isOnline ? "default" : "secondary"}>
                          {sensor.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{sensor.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <tempStatus.icon className={`w-4 h-4 ${tempStatus.color}`} />
                        <span className={`font-bold ${tempStatus.color}`}>{sensor.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <humidityStatus.icon className={`w-4 h-4 ${humidityStatus.color}`} />
                        <span className={`font-bold ${humidityStatus.color}`}>{sensor.humidity}%</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {selectedSensorData && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Real-time Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Current Readings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5" />
                      Temperature
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-slate-900 mb-2">{selectedSensorData.temperature}°C</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Signal Strength:</span>
                        <span className="font-medium">{selectedSensorData.signal}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Battery Level:</span>
                        <span className="font-medium">{selectedSensorData.battery}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((selectedSensorData.temperature - 10) / 25) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5" />
                      Humidity
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-slate-900 mb-2">{selectedSensorData.humidity}%</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last Update:</span>
                        <span className="font-medium">{selectedSensorData.lastSeen.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span
                          className={`font-medium ${selectedSensorData.isOnline ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedSensorData.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${selectedSensorData.humidity}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Alerts */}
              <div className="space-y-2">
                {selectedSensorData.temperature > 25 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Temperature is above maximum threshold (25°C)
                    </AlertDescription>
                  </Alert>
                )}
                {selectedSensorData.temperature < 18 && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Temperature is below minimum threshold (18°C)
                    </AlertDescription>
                  </Alert>
                )}
                {(selectedSensorData.humidity < 30 || selectedSensorData.humidity > 60) && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Humidity is outside optimal range (30% - 60%)
                    </AlertDescription>
                  </Alert>
                )}
                {!selectedSensorData.isOnline && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Sensor is offline. Last seen: {selectedSensorData.lastSeen.toLocaleString()}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Monitoring Settings</CardTitle>
                  <CardDescription>Configure real-time alerts and thresholds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Update Frequency</h3>
                      <p className="text-sm text-slate-600">Data updates every 2 seconds automatically</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Alert Thresholds</h3>
                      <p className="text-sm text-slate-600">Temperature: 18°C - 25°C | Humidity: 30% - 60%</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Connection Status</h3>
                      <p className="text-sm text-slate-600">
                        Real-time connection monitoring with automatic reconnection
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
