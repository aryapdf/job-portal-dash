// components/CameraModal.tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export default function CameraDialog({ open, onClose, onCapture }: {
  open: boolean
  onClose: () => void
  onCapture: (photo: File, previewUrl: string) => void
}) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captured, setCaptured] = useState(false)

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
          className="flex flex-col items-center"
          style={{gap: isMobile ? "3vw" : "0.857vw"}}
        >
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