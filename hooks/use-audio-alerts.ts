"use client"

import { useEffect, useRef, useState } from "react"
import type { AlertItem } from "./use-realtime-data"

export function useAudioAlerts() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [volume, setVolume] = useState(0.7)
  const audioContextRef = useRef<AudioContext | null>(null)
  const playedAlertsRef = useRef<Set<string>>(new Set())

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Generate different tones for different alert types
  const generateTone = (frequency: number, duration: number, type: "sine" | "square" | "triangle" = "sine") => {
    if (!audioContextRef.current || !isEnabled) return

    const context = audioContextRef.current
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0, context.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + duration)
  }

  // Play high temperature alert sound (urgent beeping)
  const playHighTempAlert = () => {
    if (!isEnabled) return

    // Play 3 urgent high-pitched beeps
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        generateTone(1000, 0.3, "square") // High frequency, sharp sound
      }, i * 400)
    }
  }

  // Play low temperature alert sound (lower pitched warning)
  const playLowTempAlert = () => {
    if (!isEnabled) return

    // Play 2 lower-pitched warning tones
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        generateTone(400, 0.5, "triangle") // Lower frequency, softer sound
      }, i * 600)
    }
  }

  // Play critical alert sound (continuous alarm)
  const playCriticalAlert = () => {
    if (!isEnabled) return

    // Play alternating high-low alarm
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const frequency = i % 2 === 0 ? 800 : 1200
        generateTone(frequency, 0.2, "square")
      }, i * 250)
    }
  }

  // Play security alert sound (siren-like)
  const playSecurityAlert = () => {
    if (!isEnabled) return

    // Play siren-like sound
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        generateTone(600 + i * 100, 0.4, "sine")
      }, i * 300)
    }
  }

  // Main function to play alert based on type and severity
  const playAlert = (alert: AlertItem) => {
    if (!isEnabled || playedAlertsRef.current.has(alert.id)) return

    // Mark this alert as played
    playedAlertsRef.current.add(alert.id)

    // Resume audio context if suspended (required for user interaction)
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume()
    }

    switch (alert.type) {
      case "temperature":
        if (alert.severity === "critical") {
          playCriticalAlert()
        } else if (alert.value && alert.threshold) {
          if (alert.value > alert.threshold) {
            playHighTempAlert()
          } else {
            playLowTempAlert()
          }
        } else {
          playHighTempAlert() // Default to high temp sound
        }
        break
      case "security":
        playSecurityAlert()
        break
      case "battery":
      case "offline":
        // Play a gentle notification sound
        generateTone(500, 0.8, "sine")
        break
      default:
        generateTone(600, 0.5, "triangle")
    }
  }

  // Process new alerts
  const processAlerts = (alerts: AlertItem[]) => {
    const activeAlerts = alerts.filter((alert) => !alert.resolved && !alert.acknowledged)

    activeAlerts.forEach((alert) => {
      // Only play sound for new alerts (within last 5 seconds)
      const isNewAlert = Date.now() - alert.timestamp.getTime() < 5000
      if (isNewAlert) {
        playAlert(alert)
      }
    })
  }

  // Clean up played alerts when they're resolved
  const cleanupPlayedAlerts = (alerts: AlertItem[]) => {
    const activeAlertIds = new Set(alerts.filter((a) => !a.resolved).map((a) => a.id))
    const playedAlerts = Array.from(playedAlertsRef.current)

    playedAlerts.forEach((alertId) => {
      if (!activeAlertIds.has(alertId)) {
        playedAlertsRef.current.delete(alertId)
      }
    })
  }

  // Test functions for different alert sounds
  const testHighTempSound = () => playHighTempAlert()
  const testLowTempSound = () => playLowTempAlert()
  const testCriticalSound = () => playCriticalAlert()
  const testSecuritySound = () => playSecurityAlert()

  return {
    isEnabled,
    setIsEnabled,
    volume,
    setVolume,
    processAlerts,
    cleanupPlayedAlerts,
    testHighTempSound,
    testLowTempSound,
    testCriticalSound,
    testSecuritySound,
  }
}
