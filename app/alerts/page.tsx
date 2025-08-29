"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Battery,
  Wifi,
  Settings,
  Bell,
  BellOff,
  Check,
  X,
  Thermometer,
  Save,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { ConnectionStatus } from "@/components/connection-status"
import { useAudioAlerts } from "@/hooks/use-audio-alerts"
import { useEffect, useState } from "react"

export default function AlertManagement() {
  const { data, acknowledgeAlert, resolveAlert, updateTemperatureThresholds } = useRealtimeData()
  const {
    isEnabled: audioEnabled,
    setIsEnabled: setAudioEnabled,
    volume,
    setVolume,
    processAlerts,
    cleanupPlayedAlerts,
    testHighTempSound,
    testLowTempSound,
    testCriticalSound,
    testSecuritySound,
  } = useAudioAlerts()

  const [tempSettings, setTempSettings] = useState({
    highWarning: 25,
    highCritical: 27,
    lowWarning: 18,
    lowCritical: 15,
    enableHighAlerts: true,
    enableLowAlerts: true,
    enableCriticalAlerts: true,
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    processAlerts(data.alerts)
    cleanupPlayedAlerts(data.alerts)
  }, [data.alerts, processAlerts, cleanupPlayedAlerts])

  const handleTempSettingChange = (key: string, value: number | boolean) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  const saveTemperatureSettings = () => {
    updateTemperatureThresholds(tempSettings)
    setHasUnsavedChanges(false)
  }

  const resetToDefaults = () => {
    setTempSettings({
      highWarning: 25,
      highCritical: 27,
      lowWarning: 18,
      lowCritical: 15,
      enableHighAlerts: true,
      enableLowAlerts: true,
      enableCriticalAlerts: true,
    })
    setHasUnsavedChanges(true)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 border-red-200 bg-red-50"
      case "high":
        return "text-orange-600 border-orange-200 bg-orange-50"
      case "medium":
        return "text-yellow-600 border-yellow-200 bg-yellow-50"
      case "low":
        return "text-blue-600 border-blue-200 bg-blue-50"
      default:
        return "text-slate-600 border-slate-200 bg-slate-50"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return Thermometer
      case "humidity":
        return Thermometer
      case "security":
        return Shield
      case "battery":
        return Battery
      case "offline":
        return Wifi
      case "system":
        return Settings
      default:
        return AlertTriangle
    }
  }

  const activeAlerts = data.alerts.filter((a) => !a.resolved && !a.acknowledged)
  const acknowledgedAlerts = data.alerts.filter((a) => a.acknowledged && !a.resolved)
  const resolvedAlerts = data.alerts.filter((a) => a.resolved)

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
              <h1 className="text-3xl font-bold text-slate-900">Alert Management</h1>
              <p className="text-slate-600 mt-1">Real-time alert monitoring and management</p>
              <div className="mt-2">
                <ConnectionStatus status={data.connectionStatus} lastUpdate={data.lastUpdate} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="px-3 py-1">
              <Bell className="w-4 h-4 mr-1" />
              {activeAlerts.length} Active
              {activeAlerts.length > 0 && <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-1"></div>}
            </Badge>
            <Button
              variant={audioEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
              Audio {audioEnabled ? "On" : "Off"}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Audio Settings Panel */}
        {audioEnabled && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Audio Alert Settings
              </CardTitle>
              <CardDescription>Configure audio notifications for different alert types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium min-w-[80px]">Volume:</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-600 min-w-[40px]">{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={testHighTempSound}>
                    Test High Temp Sound
                  </Button>
                  <Button variant="outline" size="sm" onClick={testLowTempSound}>
                    Test Low Temp Sound
                  </Button>
                  <Button variant="outline" size="sm" onClick={testCriticalSound}>
                    Test Critical Alert
                  </Button>
                  <Button variant="outline" size="sm" onClick={testSecuritySound}>
                    Test Security Alert
                  </Button>
                </div>
                <div className="text-xs text-slate-600">
                  <strong>Sound Guide:</strong> High temperature = urgent beeping, Low temperature = lower warning
                  tones, Critical = continuous alarm, Security = siren-like sound
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
              <p className="text-xs text-slate-600">Require attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{acknowledgedAlerts.length}</div>
              <p className="text-xs text-slate-600">Being addressed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
              <p className="text-xs text-slate-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${data.connectionStatus === "connected" ? "text-green-600" : "text-red-600"}`}
              >
                {data.connectionStatus === "connected" ? "Online" : "Offline"}
              </div>
              <p className="text-xs text-slate-600">Connection status</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Live Alerts</TabsTrigger>
            <TabsTrigger value="settings">Temperature Settings</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Temperature Alert Configuration
                </CardTitle>
                <CardDescription>
                  Set custom temperature thresholds for high and low temperature alerts across all sensors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* High Temperature Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">High Temperature Alerts</h3>
                    <Switch
                      checked={tempSettings.enableHighAlerts}
                      onCheckedChange={(checked) => handleTempSettingChange("enableHighAlerts", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="highWarning" className="text-sm font-medium">
                        Warning Threshold (°C)
                      </Label>
                      <Input
                        id="highWarning"
                        type="number"
                        value={tempSettings.highWarning}
                        onChange={(e) => handleTempSettingChange("highWarning", Number(e.target.value))}
                        disabled={!tempSettings.enableHighAlerts}
                        className="bg-white"
                      />
                      <p className="text-xs text-slate-600">
                        Triggers warning alerts when temperature exceeds this value
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="highCritical" className="text-sm font-medium">
                        Critical Threshold (°C)
                      </Label>
                      <Input
                        id="highCritical"
                        type="number"
                        value={tempSettings.highCritical}
                        onChange={(e) => handleTempSettingChange("highCritical", Number(e.target.value))}
                        disabled={!tempSettings.enableHighAlerts}
                        className="bg-white"
                      />
                      <p className="text-xs text-slate-600">Triggers critical alerts with continuous audio alarm</p>
                    </div>
                  </div>
                </div>

                {/* Low Temperature Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Low Temperature Alerts</h3>
                    <Switch
                      checked={tempSettings.enableLowAlerts}
                      onCheckedChange={(checked) => handleTempSettingChange("enableLowAlerts", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="lowWarning" className="text-sm font-medium">
                        Warning Threshold (°C)
                      </Label>
                      <Input
                        id="lowWarning"
                        type="number"
                        value={tempSettings.lowWarning}
                        onChange={(e) => handleTempSettingChange("lowWarning", Number(e.target.value))}
                        disabled={!tempSettings.enableLowAlerts}
                        className="bg-white"
                      />
                      <p className="text-xs text-slate-600">
                        Triggers warning alerts when temperature drops below this value
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowCritical" className="text-sm font-medium">
                        Critical Threshold (°C)
                      </Label>
                      <Input
                        id="lowCritical"
                        type="number"
                        value={tempSettings.lowCritical}
                        onChange={(e) => handleTempSettingChange("lowCritical", Number(e.target.value))}
                        disabled={!tempSettings.enableLowAlerts}
                        className="bg-white"
                      />
                      <p className="text-xs text-slate-600">Triggers critical alerts with continuous audio alarm</p>
                    </div>
                  </div>
                </div>

                {/* Critical Alert Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Critical Alert Behavior</h3>
                    <Switch
                      checked={tempSettings.enableCriticalAlerts}
                      onCheckedChange={(checked) => handleTempSettingChange("enableCriticalAlerts", checked)}
                    />
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>Critical alerts will:</strong>
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1 ml-4">
                      <li>• Play continuous audio alarm until acknowledged</li>
                      <li>• Show prominent visual indicators on dashboard</li>
                      <li>• Require manual acknowledgment to stop audio</li>
                      <li>• Log detailed event information for review</li>
                    </ul>
                  </div>
                </div>

                {/* Current Sensor Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Current Sensor Readings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.sensors.map((sensor) => (
                      <Card key={sensor.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{sensor.name}</h4>
                          <Badge
                            variant={
                              sensor.temperature > tempSettings.highCritical ||
                              sensor.temperature < tempSettings.lowCritical
                                ? "destructive"
                                : sensor.temperature > tempSettings.highWarning ||
                                    sensor.temperature < tempSettings.lowWarning
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {sensor.temperature > tempSettings.highCritical ||
                            sensor.temperature < tempSettings.lowCritical
                              ? "Critical"
                              : sensor.temperature > tempSettings.highWarning ||
                                  sensor.temperature < tempSettings.lowWarning
                                ? "Warning"
                                : "Normal"}
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{sensor.temperature}°C</div>
                        <div className="text-sm text-slate-600">Humidity: {sensor.humidity}%</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={resetToDefaults}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>

                  <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                      <Badge variant="outline" className="text-orange-600">
                        Unsaved Changes
                      </Badge>
                    )}
                    <Button
                      onClick={saveTemperatureSettings}
                      disabled={!hasUnsavedChanges}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {/* Active Alerts List */}
            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <BellOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900">No active alerts</h3>
                      <p className="text-slate-600">All systems are operating normally</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                activeAlerts.map((alert) => {
                  const TypeIcon = getTypeIcon(alert.type)
                  return (
                    <Card
                      key={alert.id}
                      className={`${getSeverityColor(alert.severity)} ${alert.resolved ? "opacity-60" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <TypeIcon className="w-5 h-5 mt-0.5" />
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {alert.title}
                                {Date.now() - alert.timestamp.getTime() < 10000 && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                )}
                              </CardTitle>
                              <CardDescription className="mt-1">{alert.description}</CardDescription>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {alert.timestamp.toLocaleString()}
                                </span>
                                <span>Device: {alert.deviceName}</span>
                                {alert.value && alert.threshold && (
                                  <span>
                                    Value: {alert.value}
                                    {alert.type === "temperature"
                                      ? "°C"
                                      : alert.type === "humidity"
                                        ? "%"
                                        : alert.type === "battery"
                                          ? "%"
                                          : ""}
                                    (Threshold: {alert.threshold}
                                    {alert.type === "temperature"
                                      ? "°C"
                                      : alert.type === "humidity"
                                        ? "%"
                                        : alert.type === "battery"
                                          ? "%"
                                          : ""}
                                    )
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityBadge(alert.severity)}>{alert.severity}</Badge>
                            {alert.acknowledged && <Badge variant="outline">Acknowledged</Badge>}
                            {alert.resolved && <Badge variant="secondary">Resolved</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {!alert.acknowledged && !alert.resolved && (
                            <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                              <Check className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                          {!alert.resolved && (
                            <Button variant="default" size="sm" onClick={() => resolveAlert(alert.id)}>
                              <X className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Alert History</CardTitle>
                <CardDescription>Complete history of all system alerts with live updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-6 gap-4 text-sm font-medium text-slate-600 border-b pb-2">
                    <div>Time</div>
                    <div>Type</div>
                    <div>Severity</div>
                    <div>Device</div>
                    <div>Description</div>
                    <div>Status</div>
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {data.alerts.map((alert) => (
                      <div key={alert.id} className="grid grid-cols-6 gap-4 text-sm py-2 border-b border-slate-100">
                        <div className="text-slate-600">{alert.timestamp.toLocaleString()}</div>
                        <div className="capitalize">{alert.type}</div>
                        <div>
                          <Badge variant={getSeverityBadge(alert.severity)} className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <div>{alert.deviceName}</div>
                        <div className="text-slate-600">{alert.description}</div>
                        <div>
                          {alert.resolved ? (
                            <Badge variant="secondary" className="text-xs">
                              Resolved
                            </Badge>
                          ) : alert.acknowledged ? (
                            <Badge variant="outline" className="text-xs">
                              Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
