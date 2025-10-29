"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  getCandidates,
  updateCandidateOrder,
  updateCandidateStatus,
  deleteCandidates
} from "@/lib/services/candidateService"
import { FallbackCard } from "@/components/Card/FallbackCard"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import ModernTable from "@/components/Table/ModernTable"
import { toast } from "sonner"

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  const jobId = params.id as string

  const [jobName, setJobName] = useState<string>("")
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const columns = [
    {
      accessorKey: "photo",
      header: "PHOTO",
      cell: ({ row }: any) => {
        const candidate = row.original
        return (
          <div
            className="flex items-center justify-center"
          >
            {candidate.photo ? (
              <img
                src={candidate.photo}
                alt={candidate.fullName}
                className="rounded-full object-cover"
                style={{ width: "40px", height: "40px" }}
              />
            ) : (
              <div
                className="rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold"
                style={{ width: "40px", height: "40px" }}
              >
                {candidate.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )
      },
      size: 80,
    },
    {
      accessorKey: "fullName",
      header: "FULL NAME",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue() || "-"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "EMAIL",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue() || "-"}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "PHONE",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue() || "-"}
        </div>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "DATE OF BIRTH",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue() ? new Date(getValue()).toLocaleDateString() : "-"}
        </div>
      ),
    },
    {
      accessorKey: "domicile",
      header: "DOMICILE",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue() || "-"}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "GENDER",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue()
            ? getValue().charAt(0).toUpperCase() + getValue().slice(1)
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "linkedin",
      header: "LINKEDIN",
      cell: ({ getValue }: any) => (
        <div
          style={{
            padding: isMobile ? "2.08vw" : "1.14vw",
            minWidth: isMobile ? "10vw" : "6vw",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: isMobile ? "4vw" : "1.4em",
          }}
        >
          {getValue() ? (
            <a
              href={getValue()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Profile
            </a>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ getValue }: any) => {
        const val = getValue()
        const color =
          val === "pending"
            ? "text-orange-500"
            : val === "approved"
              ? "text-green-600"
              : "text-red-600"
        return (
          <div
            style={{
              padding: isMobile ? "2.08vw" : "1.14vw",
              minWidth: isMobile ? "10vw" : "6vw",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: isMobile ? "4vw" : "1.4em",
            }}
            className={`font-semibold ${color}`}
          >
            {val.toUpperCase()}
          </div>
        )
      },
    },
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await getCandidates(jobId)
      if (result) {
        setJobName(result.jobName || "")
        setCandidates(result.candidates || [])
      }
    } catch (err) {
      console.error("Failed to fetch candidates:", err)
      toast.error("Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [jobId])

  const handleSaveOrder = async (newOrder: any[]) => {
    try {
      await updateCandidateOrder(jobId, newOrder)
      toast.success("Order updated successfully!")
      await fetchData() // Refresh data
    } catch (error) {
      toast.error("Failed to update order")
      console.error(error)
    }
  }

  const handleUpdateStatus = async (ids: string[], status: 'approved' | 'declined') => {
    try {
      await updateCandidateStatus(jobId, ids, status)
      toast.success(`Status updated to ${status}!`)
      await fetchData() // Refresh data
    } catch (error) {
      toast.error("Failed to update status")
      console.error(error)
    }
  }

  const handleDelete = async (ids: string[]) => {
    try {
      await deleteCandidates(jobId, ids)
      toast.success("Candidates deleted successfully!")
      await fetchData() // Refresh data
    } catch (error) {
      toast.error("Failed to delete candidates")
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: "100vw",
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="flex flex-col w-full h-full relative"
        style={{
          padding: isMobile ? "3.13vw" : "1.71vw",
          gap: isMobile ? "3.13vw" : "1.71vw",
        }}
      >
        {/* HEADER */}
        <div
          className="font-bold flex items-center"
          style={{
            color: "rgba(29, 31, 32, 1)",
            fontSize: isMobile ? "2.34vw" : "1.29vw",
            gap: isMobile ? "2.34vw" : "1.29vw",
          }}
        >
          <Button
            onClick={() => router.push("/admin")}
            className="flex items-center justify-center border-1 cursor-pointer"
            style={{
              background: "transparent",
              padding: isMobile ? "0.52vw" : "0.29vw",
              border: "none",
              boxShadow: "none",
            }}
          >
            <img
              src="/asset/arrow-left.svg"
              alt=""
              className="w-full h-full object-contain"
              style={{
                width: isMobile ? "2.60vw" : "1.43vw",
                height: isMobile ? "2.60vw" : "1.43vw",
              }}
            />
          </Button>
          {jobName || "Job Detail"}
        </div>

        {/* CONTENT */}
        <div
          className="rounded-md flex-1 flex flex-col"
          style={{
            padding: isMobile ? "3.13vw" : "1.71vw",
            border: `1px solid rgba(224, 224, 224, 1)`,
          }}
        >
          {candidates.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <FallbackCard type={"candidates"} />
            </div>
          ) : (
            <ModernTable
              columns={columns}
              data={candidates}
              onSaveOrder={handleSaveOrder}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}