"use client"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

// === added for gesture detection ===
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

export default function CameraDialog({
                                       open,
                                       onClose,
                                       onCapture
                                     }: {
  open: boolean
  onClose: () => void
  onCapture: (photo: File, previewUrl: string) => void
}) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captured, setCaptured] = useState(false)

  const [handDetector, setHandDetector] = useState<HandLandmarker | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [gestureStep, setGestureStep] = useState(0)
  const lastStepTime = useRef(0) // Fix: initialize to 0
  const consecutiveFrames = useRef(0) // Track consecutive detections

  // FIXED: Improved finger counting
  function getFingerCount(landmarks: any[]) {
    let count = 0

    // Thumb (special case - check horizontal distance)
    const thumbTip = landmarks[4]
    const thumbIP = landmarks[3]
    const thumbMCP = landmarks[2]
    const wrist = landmarks[0]

    // Check if thumb is extended (away from palm)
    const thumbDist = Math.abs(thumbTip.x - wrist.x)
    const thumbBaseDist = Math.abs(thumbMCP.x - wrist.x)
    if (thumbDist > thumbBaseDist * 1.3) count++

    // Other fingers - check if tip is higher than PIP joint
    const fingers = [
      { tip: 8, pip: 6 },   // Index
      { tip: 12, pip: 10 }, // Middle
      { tip: 16, pip: 14 }, // Ring
      { tip: 20, pip: 18 }  // Pinky
    ]

    for (const finger of fingers) {
      const tip = landmarks[finger.tip]
      const pip = landmarks[finger.pip]
      const mcp = landmarks[finger.pip - 1]

      // Check if finger is extended
      if (tip.y < pip.y && tip.y < mcp.y) {
        count++
      }
    }

    return count
  }

  useEffect(() => {
    let localStream: MediaStream | null = null

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        localStream = stream
        setStream(stream)
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        console.error("Camera access denied:", err)
      }
    }

    if (open) {
      startCamera()
      // Reset state when dialog opens
      setGestureStep(0)
      lastStepTime.current = 0
      consecutiveFrames.current = 0
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        if (videoRef.current) videoRef.current.srcObject = null
        setStream(null)
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [open])

  // === initialize MediaPipe ===
  useEffect(() => {
    if (!open) return

    let active = true
    async function initHandDetector() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      )

      const detector = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },
        numHands: 1,
        runningMode: "VIDEO"
      })
      if (active) setHandDetector(detector)
    }
    initHandDetector()

    return () => {
      active = false
      setHandDetector(null)
    }
  }, [open])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" })
        const url = URL.createObjectURL(blob)
        onCapture(file, url)
        setCaptured(true)
      }
    }, "image/jpeg")
  }

  // FIXED: Improved detection logic
  useEffect(() => {
    if (!handDetector || !videoRef.current) return

    let rafId: number
    let isActive = true
    let lastDetection = 0
    let lastCapture = 0

    const detect = async () => {
      if (!isActive || !videoRef.current) return

      const now = Date.now()
      if (now - lastDetection < 100) {
        rafId = requestAnimationFrame(detect)
        return
      }
      lastDetection = now

      const video = videoRef.current
      if (video.readyState >= 2) {
        const result = await handDetector.detectForVideo(video, performance.now())

        if (result.landmarks?.length) {
          const hand = result.landmarks[0]
          const fingersUp = getFingerCount(hand)

          const expectedFingers = [1, 2, 3][gestureStep]

          if (fingersUp === expectedFingers) {
            consecutiveFrames.current++

            // Need 3 consecutive frames to confirm gesture (about 300ms)
            if (consecutiveFrames.current >= 3) {
              const timeSinceLast = now - lastStepTime.current

              // For first step (0->1), allow immediate transition
              // For other steps, require 500ms gap to prevent accidental triggers
              const minGap = gestureStep === 0 ? 0 : 500

              if (timeSinceLast >= minGap) {
                console.log(`Step ${gestureStep} -> ${gestureStep + 1}: ${fingersUp} fingers detected`)
                setGestureStep(prev => prev + 1)
                lastStepTime.current = now
                consecutiveFrames.current = 0
              }
            }
          } else {
            // Reset consecutive frames if wrong gesture
            consecutiveFrames.current = 0
          }

          // Auto-capture when reaching step 3
          if (gestureStep === 3 && now - lastCapture > 1000) {
            lastCapture = now
            handleCapture()
            // Reset after capture
            setTimeout(() => {
              setGestureStep(0)
              lastStepTime.current = 0
              consecutiveFrames.current = 0
            }, 1000)
          }

          // Reset if user idle too long (8 seconds)
          if (gestureStep > 0 && now - lastStepTime.current > 8000) {
            console.log("Reset due to timeout")
            setGestureStep(0)
            lastStepTime.current = 0
            consecutiveFrames.current = 0
          }
        } else {
          // No hand detected
          consecutiveFrames.current = 0
        }
      }

      rafId = requestAnimationFrame(detect)
    }

    rafId = requestAnimationFrame(detect)
    return () => {
      isActive = false
      cancelAnimationFrame(rafId)
    }
  }, [handDetector, gestureStep])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{
          padding: isMobile ? "6vw" : "1.714vw",
          width: isMobile ? "90vw" : "45.5vw",
          maxWidth: isMobile ? "90vw" : "45.5vw"
        }}
      >
        <DialogTitle
          className="w-fit h-fit"
          style={{
            fontSize: isMobile ? "5vw" : "1.429vw"
          }}
        >
          Take a Picture
        </DialogTitle>
        <div
          className="flex flex-col items-center relative"
          style={{ gap: isMobile ? "3vw" : "0.857vw" }}
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium z-10">
            {gestureStep < 3 ? `Step ${gestureStep + 1}/3` : "📸 Capturing..."}
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-md bg-black"
            style={{
              borderRadius: isMobile ? "2vw" : "0.571vw"
            }}
          />
          <canvas ref={canvasRef} className="hidden w-full" />
          <div className="w-full mt-3">
            <Progress value={gestureStep * 33.33} />
            <p className="text-center mt-2 text-sm font-medium text-slate-600">
              {gestureStep === 0 && "👆 Tunjukkan 1 jari untuk mulai"}
              {gestureStep === 1 && "✌️ Bagus! Sekarang tunjukkan 2 jari"}
              {gestureStep === 2 && "🤚 Mantap! Sekarang 3 jari untuk capture"}
              {gestureStep === 3 && "📸 Mengambil foto..."}
            </p>
          </div>
          <div
            className="flex"
            style={{
              gap: isMobile ? "2vw" : "0.571vw",
              marginTop: isMobile ? "3vw" : "0.857vw"
            }}
          >
            <Button
              onClick={handleCapture}
              className="font-semibold"
              style={{
                padding: isMobile ? "2.5vw 4vw" : "0.286vw 1.143vw",
                fontSize: isMobile ? "3.5vw" : "1vw"
              }}
            >
              Capture
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="font-semibold"
              style={{
                padding: isMobile ? "2.5vw 4vw" : "0.286vw 1.143vw",
                fontSize: isMobile ? "3.5vw" : "1vw"
              }}
            >
              {captured ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}