// components/CameraModal.tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function CameraDialog({ open, onClose, onCapture }: {
  open: boolean
  onClose: () => void
  onCapture: (photo: File, previewUrl: string) => void
}) {
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
        className="max-w-sm"
        style={{
          padding: "24px",
          width: "637px",
        }}
      >
        <DialogTitle className={"w-fit h-fit"}>Take a Picture</DialogTitle>
        <div className="flex flex-col gap-3 items-center">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-md bg-black" />
          <canvas ref={canvasRef} className="hidden w-full"  />
          <div className="flex gap-2 mt-3">
            {<Button onClick={handleCapture} style={{ padding: "4px 16px", fontSize: "14px" }}>Capture</Button>}
            <Button variant="outline" onClick={onClose} style={{ padding: "4px 16px", fontSize: "14px" }} >
              {captured ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
