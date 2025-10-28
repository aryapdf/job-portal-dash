"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import JobFormDialog from "@/components/Dialog/JobFormDialog";
import DeleteJobDialog from "@/components/Dialog/DeleteJobDialog";
import { useState, useEffect } from "react";
import { FallbackCard } from "@/components/Card/FallbackCard";
import { getAllJobs } from "@/lib/services/jobService";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";
import { useRouter } from "next/navigation";

type JobData = {
  id: string;
  slug: string;
  title: string;
  status: "active" | "inactive" | "draft" | string;
  salary_range: {
    min: number;
    max: number;
    currency: string;
    display_text: string;
  };
  list_card: {
    badge: string;
    started_on_text: string;
    cta: string;
  };
};

export default function AdminContent() {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile";;
  const router = useRouter();

  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await getAllJobs(); // assume it returns { data: [...] }
      setJobs(response || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleJobCreated = async () => {
    await fetchJobs();
  };

  return (
    <>
      <div
        className="w-full h-full relative flex justify-between"
        style={{
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "5vw 4vw" : "2.571vw 1.714vw",
          gap: isMobile ? "5vw" : "0",
        }}
      >
        {/* Main Content Area */}
        <div
          className="h-full overflow-hidden overflow-y-scroll rounded-sm flex flex-col"
          style={{
            width: isMobile ? "100%" : "74.5vw",
            gap: isMobile ? "5vw" : "1.429vw",
          }}
        >
          {/* Search Bar */}
          <div
            className="flex w-full items-center rounded-md"
            style={{
              padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",
              border: "1px solid rgba(237, 237, 237, 1)",
            }}
          >
            <Input
              type="search"
              placeholder="Search by job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-sm h-fit"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                boxShadow: "none",
                fontSize: isMobile ? "3.5vw" : "1vw",
              }}
            />
            <img
              src="/asset/magnifying-glass-icon.svg"
              alt="icon"
              style={{
                height: isMobile ? "5vw" : "1.143vw",
                width: isMobile ? "5vw" : "1.143vw",
              }}
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col flex-1 items-center justify-center relative">
              <LoadingOverlay isLoading={loading} />
            </div>
          ) : filteredJobs.length === 0 && searchQuery ? (
            <div className="flex flex-col flex-1 items-center justify-center rounded-md">
              <p
                className="text-slate-600"
                style={{ fontSize: isMobile ? "4vw" : "1.143vw" }}
              >
                No jobs found matching &#34;{searchQuery}&#34;
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col flex-1 items-center justify-center rounded-md relative">
              <FallbackCard
                type={"admin"}
                onClick={() => setJobDialogOpen(true)}
              />
            </div>
          ) : (
            // Job List
            <div
              className="flex flex-col rounded-md"
              style={{
                gap: isMobile ? "3vw" : "1.143vw",
              }}
            >
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="rounded-xl border-none transition-all hover:shadow-md"
                  style={{
                    padding: isMobile ? "4vw" : "1.429vw",
                    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent
                    className="p-0 flex flex-col"
                    style={{ gap: isMobile ? "3vw" : "0.857vw" }}
                  >
                    <div className="flex items-center" style={{ gap: "16px" }}>
                      <div
                        className={`${getStatusColor(
                          job.status
                        )} font-medium rounded-md capitalize`}
                        style={{
                          fontSize: isMobile ? "3vw" : "0.857vw",
                          padding: isMobile
                            ? "1vw 2.5vw"
                            : "0.286vw 0.714vw",
                        }}
                      >
                        {job.list_card.badge}
                      </div>
                      <span
                        className="text-slate-600 border-1 rounded-md"
                        style={{
                          fontSize: isMobile ? "3vw" : "0.857vw",
                          padding: isMobile
                            ? "1vw 2.5vw"
                            : "0.286vw 0.714vw",
                        }}
                      >
                        {job.list_card.started_on_text}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold text-slate-900"
                      style={{
                        fontSize: isMobile ? "4.5vw" : "1.286vw",
                      }}
                    >
                      {job.title}
                    </h3>

                    {/* Salary & CTA */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-slate-700"
                        style={{
                          fontSize: isMobile ? "3.5vw" : "1vw",
                        }}
                      >
                        {job.salary_range.display_text}
                      </span>
                      <div className={"relative flex items-center"} style={{gap: isMobile ? "5vw" : "1.429vw",}}>
                        <Button
                          onClick={() => {
                            setLoading(true);
                            router.push(`/admin/job/${job.id}`);
                          }}
                          className="rounded-md font-bold cursor-pointer"
                          style={{
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                            padding: isMobile
                              ? "2vw 4vw"
                              : "0.86vw 1.143vw",
                            color: "white",
                            backgroundColor: "rgba(1, 149, 159, 1)",
                          }}
                        >
                          {job.list_card.cta}
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="rounded-md font-bold cursor-pointer"
                          style={{
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                            padding: isMobile ? "2vw 4vw" : "0.86vw 1.143vw",
                            backgroundColor: "rgba(225, 20, 40, 1)",
                            color: "white",
                          }}
                        >
                          Delete Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA Card */}
        <div
          className="flex flex-col rounded-xl h-fit overflow-hidden relative"
          style={{
            width: isMobile ? "100%" : "auto",
            padding: isMobile ? "8vw 6vw" : "1.714vw",
            background:
              "url('/asset/work-background.webp') no-repeat center/cover",
            marginTop: isMobile ? "5vw" : "0",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.72)",
            }}
          />
          <div
            className="relative font-bold text-slate-200"
            style={{
              fontSize: isMobile ? "4.5vw" : "1.286vw",
              marginBottom: isMobile ? "2vw" : "0.286vw",
            }}
          >
            Recruit the best candidates
          </div>
          <div
            className="relative font-bold text-white"
            style={{
              fontSize: isMobile ? "3.5vw" : "1vw",
              marginBottom: isMobile ? "6vw" : "1.714vw",
            }}
          >
            Create jobs, invite, and hire with ease
          </div>
          <Button
            className="font-bold rounded-lg relative overflow-hidden cursor-pointer"
            onClick={() => setJobDialogOpen(true)}
            style={{
              fontSize: isMobile ? "4vw" : "1.143vw",
              color: "white",
              background: "rgba(1, 149, 159, 1)",
              height: isMobile ? "12vw" : "auto",
              padding: isMobile ? "3vw 5vw" : "0.5vw 1vw",
            }}
          >
            Create a new job
          </Button>
        </div>
      </div>

      <JobFormDialog
        open={jobDialogOpen}
        onOpenChange={setJobDialogOpen}
        onJobCreated={handleJobCreated}
      />

      <DeleteJobDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        jobId={selectedJobId || undefined}
        onDeleted={fetchJobs}
      />

    </>
  );
}
