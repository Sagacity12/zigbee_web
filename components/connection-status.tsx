"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

interface ConnectionStatusProps {
  status: "connected" | "connecting" | "disconnected"
  lastUpdate: Date
}

export function ConnectionStatus({ status, lastUpdate }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          text: "Connected",
          variant: "default" as const,
          color: "text-green-600",
        }
      case "connecting":
        return {
          icon: Loader2,
          text: "Connecting",
          variant: "outline" as const,
          color: "text-orange-600",
        }
      case "disconnected":
        return {
          icon: WifiOff,
          text: "Disconnected",
          variant: "destructive" as const,
          color: "text-red-600",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className="px-2 py-1">
        <Icon className={`w-3 h-3 mr-1 ${status === "connecting" ? "animate-spin" : ""}`} />
        {config.text}
      </Badge>
      <span className="text-xs text-slate-500">Last update: {lastUpdate.toLocaleTimeString()}</span>
    </div>
  )
}
