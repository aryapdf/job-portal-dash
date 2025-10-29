"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { FallbackCard } from "@/components/Card/FallbackCard";
import { Card } from "@/components/ui/card";
import Separator from "@/components/Separator/Separator";
import { useRouter } from "next/navigation";
import { getAllJobs } from "@/lib/services/jobService";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";
import { formatJobType, formatRupiah } from "@/lib/helper/formatter";

export default function UserContent() {
  const isMobile =
    useSelector((state: RootState) => state.screen.deviceType) === "mobile";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobList, setJobList] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await getAllJobs();
      setJobList(response || []);

      if (response && response.length > 0) {
        setSelectedJob(response[0]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search query
  const filteredJobs = jobList.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.type?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      formatJobType(job.type)?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.find(j => j.id === selectedJob?.id)) {
      setSelectedJob(filteredJobs[0]);
    } else if (filteredJobs.length === 0) {
      setSelectedJob(null);
    }
  }, [searchQuery]);

  return (
    <div
      className="w-full h-full relative flex justify-between"
      style={{
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "5vw 4vw" : "1.857vw 7.429vw",
        gap: isMobile ? "5vw" : "0",
      }}
    >
      <div
        className="w-full h-full rounded-xl flex flex-col"
        style={{
          gap: isMobile ? "4vw" : "1.143vw"
        }}
      >
        <div
          className="flex w-full items-center rounded-md border"
          style={{
            padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",
            backgroundColor: "white"
          }}
        >
          <img
            src={"/asset/magnifying-glass-icon.svg"}
            style={{
              width: isMobile ? "5vw" : "1.143vw",
              height: isMobile ? "5vw" : "1.143vw",
              marginRight: isMobile ? "3vw" : "0.571vw",
            }}
          />
          <Input
            type="search"
            placeholder="Search jobs by title, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-sm h-fit border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              width: "100%",
              padding: 0,
              fontSize: isMobile ? "4vw" : "0.857vw",
              border: "none",
              boxShadow: "none"
            }}
          />
        </div>

        <div className="flex flex-1 items-center justify-center rounded-md relative overflow-hidden">
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              {!jobList || jobList.length === 0 ? (
                <FallbackCard type={"user"} />
              ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="text-slate-400 mb-2"
                    style={{
                      fontSize: isMobile ? "12vw" : "4vw"
                    }}
                  >
                    🔍
                  </div>
                  <div
                    className="text-slate-600 font-medium"
                    style={{
                      fontSize: isMobile ? "4vw" : "1.143vw"
                    }}
                  >
                    No jobs found
                  </div>
                  <div
                    className="text-slate-500"
                    style={{
                      fontSize: isMobile ? "3.5vw" : "0.857vw"
                    }}
                  >
                    Try adjusting your search
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full flex overflow-hidden"
                  style={{
                    gap: isMobile ? "4vw" : "1.143vw",
                  }}
                >
                  {/* LEFT SIDE - Job Cards List */}
                  <div
                    className="flex flex-col overflow-y-auto"
                    style={{
                      width: isMobile ? "100%" : "24.286vw",
                      gap: isMobile ? "3vw" : "0.857vw",
                      paddingRight: isMobile ? "0" : "0.571vw",
                    }}
                  >
                    {filteredJobs.map((job) => (
                      <Card
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`cursor-pointer transition-all border-2 hover:shadow-md ${
                          selectedJob?.id === job.id
                            ? "border-teal-600 bg-cyan-50/50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        style={{
                          borderRadius: isMobile ? "3vw" : "0.857vw",
                          padding: isMobile ? "3vw 4vw" : "0.857vw 1.143vw",
                        }}
                      >
                        <div
                          className="flex items-start"
                          style={{
                            gap: isMobile ? "3vw" : "0.857vw",
                            marginBottom: isMobile ? "3vw" : "0.857vw",
                          }}
                        >
                          <img
                            src="/asset/code-logo.png"
                            alt=""
                            style={{
                              width: isMobile ? "12vw" : "3.429vw",
                              height: isMobile ? "12vw" : "3.429vw",
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-bold truncate"
                              style={{
                                fontSize: isMobile ? "4vw" : "1.143vw",
                                color: "rgba(64, 64, 64, 1)",
                              }}
                            >
                              {job.title}
                            </div>
                            <div
                              style={{
                                fontSize: isMobile ? "3.5vw" : "1vw",
                                color: "rgba(64, 64, 64, 1)",
                              }}
                            >
                              Rakamin
                            </div>
                          </div>
                        </div>

                        <div
                          className="relative flex flex-col"
                          style={{ gap: isMobile ? "1vw" : "0.286vw" }}
                        >
                          <div
                            className="flex items-center text-slate-600"
                            style={{
                              marginBottom: isMobile ? "2vw" : "0.571vw",
                            }}
                          >
                            <img
                              src="/asset/location-icon.svg"
                              alt=""
                              style={{
                                width: isMobile ? "4vw" : "1.143vw",
                                height: isMobile ? "4vw" : "1.143vw",
                              }}
                            />
                            <span
                              style={{
                                fontSize: isMobile ? "3vw" : "0.857vw",
                              }}
                            >
                              Jakarta
                            </span>
                          </div>

                          <div
                            className="flex items-center text-slate-600"
                            style={{
                              gap: isMobile ? "1vw" : "0.286vw",
                            }}
                          >
                            <img
                              src="/asset/money-icon.svg"
                              alt=""
                              style={{
                                width: isMobile ? "4vw" : "1.143vw",
                                height: isMobile ? "4vw" : "1.143vw",
                              }}
                            />
                            <span
                              style={{
                                fontSize: isMobile ? "3vw" : "0.857vw",
                              }}
                            >
                              {job.salary_range?.display_text ||
                                `${formatRupiah(
                                  job.salary_range?.min
                                )} - ${formatRupiah(job.salary_range?.max)}`}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* RIGHT SIDE - Job Details */}
                  {!isMobile && selectedJob && (
                    <Card
                      className="flex-1 overflow-hidden"
                      style={{
                        borderRadius: "0.857vw",
                        padding: "1.714vw",
                      }}
                    >
                      <div
                        className="flex items-start justify-between"
                        style={{ marginBottom: "1.714vw" }}
                      >
                        <div
                          className="flex items-start"
                          style={{ gap: "1.714vw" }}
                        >
                          <img
                            src="/asset/code-logo.png"
                            alt=""
                            style={{
                              width: "3.429vw",
                              height: "3.429vw",
                            }}
                          />
                          <div>
                            <div
                              className="flex items-center"
                              style={{
                                gap: "0.571vw",
                                marginBottom: "0.286vw",
                              }}
                            >
                              <span
                                className="rounded-sm font-semibold"
                                style={{
                                  padding: "0.143vw 0.571vw",
                                  background: "rgba(67, 147, 108, 1)",
                                  color: "white",
                                  fontSize: "0.857vw",
                                  marginBottom: "0.571vw",
                                }}
                              >
                                {formatJobType(selectedJob?.type)}
                              </span>
                            </div>
                            <div
                              className="font-bold"
                              style={{ fontSize: "1.286vw" }}
                            >
                              {selectedJob?.title}
                            </div>
                            <div
                              className="text-slate-600"
                              style={{ fontSize: "1vw" }}
                            >
                              Rakamin
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            router.push(
                              `/user/job_form/${selectedJob?.id}?job_title=${selectedJob?.title}&company=Rakamin`
                            )
                          }
                          className={`${
                            selectedJob?.status === "active"
                              ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
                              : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                          } font-bold cursor-pointer`}
                          style={{
                            padding: "1.143vw",
                            fontSize: "1vw",
                          }}
                        >
                          {selectedJob?.status === "active"
                            ? "Apply"
                            : "Closed"}
                        </Button>
                      </div>

                      <Separator type={"dashed"} />

                      <div
                        className="overflow-y-auto"
                        style={{
                          fontSize: "1vw",
                          lineHeight: "1.5",
                          whiteSpace: "pre-line",
                          maxHeight: "calc(100vh - 400px)"
                        }}
                      >
                        {selectedJob?.description}
                      </div>
                    </Card>
                  )}

                  {/* MOBILE VERSION */}
                  {isMobile && selectedJob && (
                    <Card
                      className="w-full"
                      style={{
                        borderRadius: "3vw",
                        padding: "4vw",
                      }}
                    >
                      <div
                        className="flex items-start"
                        style={{
                          gap: "4vw",
                          marginBottom: "4vw",
                        }}
                      >
                        <img
                          src="/asset/code-logo.png"
                          alt=""
                          style={{
                            width: "12vw",
                            height: "12vw",
                          }}
                        />
                        <div className="flex-1">
                          <span
                            className="inline-block rounded-sm font-semibold"
                            style={{
                              padding: "1vw 2vw",
                              background: "rgba(67, 147, 108, 1)",
                              color: "white",
                              fontSize: "3vw",
                              marginBottom: "2vw",
                            }}
                          >
                            {formatJobType(selectedJob?.type)}
                          </span>
                          <div
                            className="font-bold"
                            style={{
                              fontSize: "4.5vw",
                              marginTop: "2vw",
                            }}
                          >
                            {selectedJob?.title}
                          </div>
                          <div
                            className="text-slate-600"
                            style={{fontSize: "3.5vw"}}
                          >
                            Rakamin
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() =>
                          router.push(
                            `/user/job_form/${selectedJob?.id}?job_title=${selectedJob?.title}&company=Rakamin`
                          )
                        }
                        className={`w-full ${
                          selectedJob?.status === "active"
                            ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        } font-semibold cursor-pointer`}
                        style={{
                          padding: "3vw 4vw",
                          fontSize: "4vw",
                          marginBottom: "4vw",
                        }}
                      >
                        {selectedJob?.status === "active" ? "Apply" : "Closed"}
                      </Button>

                      <Separator type={"dashed"}/>

                      <div
                        style={{
                          fontSize: "3.5vw",
                          lineHeight: "1.5",
                          marginTop: "4vw",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {selectedJob?.description}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}