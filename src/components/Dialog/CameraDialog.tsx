"use client"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
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
  const [handDetector, setHandDetector] = useState<HandLandmarker | null>(null)
  const [gestureStep, setGestureStep] = useState(0)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const lastStepTime = useRef(0)
  const consecutiveFrames = useRef(0)

  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const countdownStarted = useRef(false)

  function getFingerCount(landmarks: any[]) {
    let count = 0
    const thumbTip = landmarks[4]
    const thumbMCP = landmarks[2]
    const wrist = landmarks[0]
    if (Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbMCP.x - wrist.x) * 1.3) count++

    const fingers = [
      { tip: 8, pip: 6 },
      { tip: 12, pip: 10 },
      { tip: 16, pip: 14 },
      { tip: 20, pip: 18 }
    ]

    for (const finger of fingers) {
      const tip = landmarks[finger.tip]
      const pip = landmarks[finger.pip]
      const mcp = landmarks[finger.pip - 1]
      if (tip.y < pip.y && tip.y < mcp.y) count++
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
      setGestureStep(0)
      lastStepTime.current = 0
      consecutiveFrames.current = 0
      setCountdown(null)
      setIsCountingDown(false)
      countdownStarted.current = false
      setCapturedImage(null)
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        if (videoRef.current) videoRef.current.srcObject = null
        setStream(null)
      }
    }

    return () => {
      if (localStream) localStream.getTracks().forEach(track => track.stop())
    }
  }, [open])

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
        setCapturedImage(url)
        setCapturedFile(file)
      }
    }, "image/jpeg")
  }

  const handleSubmit = () => {
    if (capturedFile && capturedImage) {
      onCapture(capturedFile, capturedImage)
      onClose()
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setCapturedFile(null)
    setGestureStep(0)
    lastStepTime.current = 0
    consecutiveFrames.current = 0
  }

  useEffect(() => {
    if (gestureStep === 3 && !countdownStarted.current && !capturedImage) {
      countdownStarted.current = true
      setIsCountingDown(true)
      setCountdown(3)

      setTimeout(() => setCountdown(2), 1000)
      setTimeout(() => setCountdown(1), 2000)

      setTimeout(() => {
        setCountdown(null)
        handleCapture()
        setIsCountingDown(false)
        countdownStarted.current = false
      }, 3000)
    }
  }, [gestureStep, capturedImage])

  useEffect(() => {
    if (!handDetector || !videoRef.current || capturedImage) return
    let rafId: number
    let isActive = true
    let lastDetection = 0

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

          if (!isCountingDown) {
            if (fingersUp === expectedFingers) {
              consecutiveFrames.current++
              if (consecutiveFrames.current >= 3) {
                const minGap = gestureStep === 0 ? 0 : 500
                if (now - lastStepTime.current >= minGap) {
                  setGestureStep(prev => prev + 1)
                  lastStepTime.current = now
                  consecutiveFrames.current = 0
                }
              }
            } else consecutiveFrames.current = 0
            if (gestureStep > 0 && gestureStep < 3 && now - lastStepTime.current > 8000) {
              setGestureStep(0)
              lastStepTime.current = 0
              consecutiveFrames.current = 0
            }
          }
        } else if (!isCountingDown) consecutiveFrames.current = 0
      }
      rafId = requestAnimationFrame(detect)
    }

    rafId = requestAnimationFrame(detect)
    return () => {
      isActive = false
      cancelAnimationFrame(rafId)
    }
  }, [handDetector, gestureStep, isCountingDown, capturedImage])

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
          Raise Your Hand to Capture
        </DialogTitle>

        {capturedImage ? (
          <div className="flex flex-col items-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="rounded-md w-full object-contain"
              style={{ borderRadius: isMobile ? "2vw" : "0.571vw" }}
            />
            <div className="flex justify-center gap-4" style={{ marginTop: isMobile ? "3.2vw" : "1.604vw"}} >
              <Button variant="outline" className={"font-bold"} onClick={handleRetake} style={{padding: isMobile ? "2vw 4vw" : "0.86vw 1.143vw"}}>
                Retake Photo
              </Button>
              <Button className={"font-bold"} onClick={handleSubmit} style={{padding: isMobile ? "2vw 4vw" : "0.86vw 1.143vw", background: "rgba(1, 149, 159, 1)"}}>Submit</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center relative" style={{ gap: isMobile ? "3vw" : "0.857vw" }}>
            <div className="relative w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-md bg-black"
                style={{ borderRadius: isMobile ? "2vw" : "0.571vw" }}
              />
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                  <div
                    className="text-white font-bold"
                    style={{
                      fontSize: isMobile ? "30vw" : "15vw",
                      textShadow: "0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(255,255,255,0.5)"
                    }}
                  >
                    {countdown}
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden w-full" />

            {/* ===== Gesture Step Indicator ===== */}
            <div className="w-full mt-3">
              <div className="text-left mt-2 font-medium text-slate-600">
                We&#39;ll take the photo once your hand pose is detected.
              </div>
              <div
                className="mt-2 flex items-center justify-center w-full font-bold text-slate-600"
                style={{
                  gap: isMobile ? "2vw" : "0.571vw",
                  marginTop: isMobile ? "3.2vw" : "1.604vw"
                }}
              >
                <div
                  style={{
                    padding: isMobile ? "0.833vw" : "0.857vw",
                    background: "rgba(64, 64, 64, 1)"
                  }}
                >
                  <img
                    src={gestureStep === 0 ? "/asset/hand-gesture-one.png" : "/asset/hand-gesture-one-active.png"}
                    style={{
                      height: isMobile ? "6.39vw" : "5.604vw",
                      objectFit: "contain"
                    }}
                    alt="1 finger"
                  />
                </div>

                <img
                  src="/asset/chevron-right.svg"
                  alt=""
                  style={{
                    width: isMobile ? "6vw" : "1.714vw",
                    height: isMobile ? "6vw" : "1.714vw"
                  }}
                />

                <div
                  style={{
                    padding: isMobile ? "0.833vw" : "0.857vw",
                    background: "rgba(64, 64, 64, 1)"
                  }}
                >
                  <img
                    src={gestureStep > 1 ? "/asset/hand-gesture-two-active.png" : "/asset/hand-gesture-two.png"}
                    style={{
                      height: isMobile ? "6.39vw" : "5.604vw",
                      objectFit: "contain"
                    }}
                    alt="2 fingers"
                  />
                </div>

                <img
                  src="/asset/chevron-right.svg"
                  alt=""
                  style={{
                    width: isMobile ? "6vw" : "1.714vw",
                    height: isMobile ? "6vw" : "1.714vw"
                  }}
                />

                <div
                  style={{
                    padding: isMobile ? "0.833vw" : "0.857vw",
                    background: "rgba(64, 64, 64, 1)"
                  }}
                >
                  <img
                    src={gestureStep > 2 ? "/asset/hand-gesture-three-active.png" : "/asset/hand-gesture-three.png"}
                    style={{
                      height: isMobile ? "6.39vw" : "5.604vw",
                      objectFit: "contain"
                    }}
                    alt="3 fingers"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
