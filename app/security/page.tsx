"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, DoorOpenIcon as Door, Eye, ArrowLeft, AlertTriangle, Clock, Battery, Wifi } from "lucide-react"
import Link from "next/link"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { ConnectionStatus } from "@/components/connection-status"

export default function SecuritySystem() {
  const { data, toggleSystemArmed } = useRealtimeData()

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "door":
        return Door
      case "window":
        return Door
      case "motion":
        return Eye
      case "glass":
        return Shield
      case "smoke":
        return AlertTriangle
      default:
        return Shield
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "armed":
        return "text-green-600"
      case "disarmed":
        return "text-slate-600"
      case "triggered":
        return "text-red-600"
      case "bypassed":
        return "text-orange-600"
      default:
        return "text-slate-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "armed":
        return "default"
      case "disarmed":
        return "secondary"
      case "triggered":
        return "destructive"
      case "bypassed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getBatteryColor = (battery: number) => {
    if (battery < 30) return "text-red-600"
    if (battery < 60) return "text-orange-600"
    return "text-green-600"
  }

  const getSignalColor = (signal: number) => {
    if (signal < 50) return "text-red-600"
    if (signal < 80) return "text-orange-600"
    return "text-green-600"
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
              <h1 className="text-3xl font-bold text-slate-900">Security System</h1>
              <p className="text-slate-600 mt-1">Real-time security monitoring and control</p>
              <div className="mt-2">
                <ConnectionStatus status={data.connectionStatus} lastUpdate={data.lastUpdate} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={data.systemArmed ? "destructive" : "secondary"} className="px-3 py-1">
              <Shield className="w-4 h-4 mr-1" />
              {data.systemArmed ? "Armed" : "Disarmed"}
              {data.systemArmed && <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-1"></div>}
            </Badge>
            <Button onClick={toggleSystemArmed} variant={data.systemArmed ? "outline" : "destructive"}>
              {data.systemArmed ? "Disarm System" : "Arm System"}
            </Button>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="space-y-2">
          {data.securityDevices
            .filter((d) => d.status === "triggered")
            .map((device) => (
              <Alert key={device.id} className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 flex items-center gap-2">
                  <strong>{device.name}</strong> has been triggered! Check the {device.zone} zone immediately.
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                </AlertDescription>
              </Alert>
            ))}
          {data.securityDevices
            .filter((d) => !d.isOnline)
            .map((device) => (
              <Alert key={device.id} className="border-orange-200 bg-orange-50">
                <Wifi className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>{device.name}</strong> is offline. Last seen: {device.lastSeen.toLocaleString()}
                </AlertDescription>
              </Alert>
            ))}
          {data.securityDevices
            .filter((d) => d.battery < 30)
            .map((device) => (
              <Alert key={device.id} className="border-yellow-200 bg-yellow-50">
                <Battery className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>{device.name}</strong> has low battery ({device.battery}%). Replace soon.
                </AlertDescription>
              </Alert>
            ))}
        </div>

        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">Live Device Status</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.securityDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type)

                return (
                  <Card
                    key={device.id}
                    className={`${
                      device.status === "triggered"
                        ? "border-red-200 bg-red-50"
                        : device.status === "armed"
                          ? "border-green-200"
                          : "border-slate-200"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DeviceIcon className={`w-5 h-5 ${getStatusColor(device.status)}`} />
                          <CardTitle className="text-lg flex items-center gap-2">
                            {device.name}
                            {device.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                          </CardTitle>
                        </div>
                        <Badge variant={getStatusBadge(device.status)}>{device.status}</Badge>
                      </div>
                      <CardDescription className="capitalize">
                        {device.type} sensor • {device.zone} zone
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Battery:</span>
                          <span className={`font-medium ${getBatteryColor(device.battery)}`}>{device.battery}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Signal:</span>
                          <span className={`font-medium ${getSignalColor(device.signal)}`}>{device.signal}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Status:</span>
                        <div className="flex items-center gap-2">
                          <Wifi className={`w-4 h-4 ${device.isOnline ? "text-green-600" : "text-red-600"}`} />
                          <span className={device.isOnline ? "text-green-600" : "text-red-600"}>
                            {device.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">Last seen: {device.lastSeen.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Security Events</CardTitle>
                <CardDescription>Live security system activity and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-slate-600 border-b pb-2">
                    <div>Time</div>
                    <div>Device</div>
                    <div>Event</div>
                    <div>Status</div>
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {data.alerts
                      .filter((alert) => alert.type === "security")
                      .map((event) => (
                        <div key={event.id} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-slate-100">
                          <div className="text-slate-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="font-medium">{event.deviceName}</div>
                          <div className="text-slate-600">{event.description}</div>
                          <div>
                            <Badge variant={event.resolved ? "secondary" : "destructive"} className="text-xs">
                              {event.resolved ? "Resolved" : "Active"}
                            </Badge>
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
