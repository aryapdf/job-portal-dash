"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import JobFormDialog from "@/components/Dialog/JobFormDialog";
import {useEffect, useState} from "react";
import {EmptyJobCard} from "@/components/Card/EmptyJobCard";
import {Card} from "@/components/ui/card";
import Separator from "@/components/Separator/Separator";
import {useRouter} from "next/navigation";
import {getAllJobs, JobData} from "@/lib/services/jobService";
import {LoadingOverlay} from "@/components/Loading/LoadingOverlay";
import {formatJobType, formatRupiah} from "@/lib/helper/formatter";

export default function UserContent() {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [jobList, setJobList] = useState<JobData[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null)

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await getAllJobs();
      console.log('fetchedJobs :', fetchedJobs)
      setJobList(fetchedJobs);

      if (fetchedJobs.length > 0) {
        setSelectedJob(fetchedJobs[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Tidak perlu alert, biarkan tetap loading state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);


  // TODO : make responsive
  return (
    <>
      <div
        className="w-full h-full relative flex justify-between"
        style={{
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "5vw 4vw" : "40px 104px",
          gap: isMobile ? "5vw" : "0"
        }}
      >
        {/* Main Content Area */}
        <div
          className="w-full h-full overflow-hidden overflow-y-scroll rounded-sm flex flex-col"

        >

          <div className="flex flex-1 items-center justify-center rounded-md relative">
            {loading ? (
              <LoadingOverlay isLoading={loading} />
            ) : (
              <>
                {!jobList
                  ? <EmptyJobCard type={"user"} /> :
                  <div className="w-full h-full flex gap-4">
                    {/* Left Side - Job Cards List */}
                    <div
                      className="flex flex-col gap-3 overflow-y-auto pr-2"
                      style={{
                        width: isMobile ? "100%" : "340px",
                        maxHeight: "calc(100vh - 200px)"
                      }}
                    >
                      {jobList.map((job) => (
                        <Card
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`p-4 cursor-pointer transition-all border-2 hover:shadow-md ${
                            selectedJob?.id === job.id
                              ? "border-teal-600 bg-cyan-50/50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          style={{
                            borderRadius: "12px",
                            padding: "12px 16px",
                            gap: "16px"
                          }}
                        >
                          {/* Company Logo */}
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src="/asset/code-logo.png" alt=""
                              style={{
                                width: "48px",
                                height: "48px"
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold  truncate" style={{fontSize: "16px", color: "rgba(64, 64, 64, 1)"}}>
                                {job.jobName}
                              </div>
                              <div style={{fontSize: "14px", color: "rgba(64, 64, 64, 1)"}}>Rakamin</div>
                            </div>
                          </div>

                          <div className={"relative flex flex-col"} style={{gap: "4px"}}>
                            <div className="flex items-center text-slate-600 mb-2">
                              <img
                                src="/asset/location-icon.svg" alt=""
                                style={{
                                  width: "16px",
                                  height: "16px"
                                }}
                              />
                              <span className="text-sm">Jakarta</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-600">
                              <img
                                src="/asset/money-icon.svg" alt=""
                                style={{
                                  width: "16px",
                                  height: "16px"
                                }}
                              />
                              <span className="text-sm">{formatRupiah(job.minSalary)} - {formatRupiah(job.maxSalary)}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Right Side - Job Details */}
                    <Card className="flex-1 p-6" style={{ borderRadius: "12px", padding: "24px" }}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start" style={{gap: "24px"}}>
                          <img
                            src="/asset/code-logo.png" alt=""
                            style={{
                              width: "48px",
                              height: "48px"
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`rounded-sm text-xs font-semibold`}
                            style={{
                              padding: "2px 8px",
                              background: "rgba(67, 147, 108, 1)",
                              color: "white",
                              fontSize: "12px",
                              marginBottom: "8px"
                            }}
                          >
                            {formatJobType(selectedJob?.jobType)}
                          </span>
                            </div>
                            <div className="font-bold" style={{fontSize: "18px"}}>
                              {selectedJob?.jobName}
                            </div>
                            <div className="text-slate-600">Rakamin</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push(`/user/job_form/${selectedJob?.id}?job_title=${selectedJob?.jobName}&company=Rakamin`)}
                          className={`${
                            selectedJob?.status === "active"
                              ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
                              : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                          } font-semibold cursor-pointer`}
                          style={{ padding: "4px 16px", fontSize: "14px" }}
                        >
                          {selectedJob?.status === "active" ? "Apply" : "Closed"}
                        </Button>
                      </div>

                      <Separator type={"dashed"} />

                      {/* Job Description */}
                      <div>
                        {selectedJob?.jobDescription}
                      </div>
                    </Card>
                  </div>
                }
              </>
            )}

          </div>
        </div>
      </div>
    </>

  );
}