// File: components/AdminContent.tsx
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import JobFormDialog from "@/components/Dialog/JobFormDialog";
import {useState} from "react";
import {EmptyJobCard} from "@/components/Card/EmptyJobCard";

export default function AdminContent() {
  const deviceType = useSelector((state: RootState) => state.screen.deviceType)
  const isMobile = deviceType === "mobile"

  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  return (
    <>
      <JobFormDialog open={jobDialogOpen} onOpenChange={setJobDialogOpen} />

      <div
        className="w-full h-full relative flex justify-between"
        style={{
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "5vw 4vw" : "2.571vw 1.714vw",
          gap: isMobile ? "5vw" : "0"
        }}
      >
        {/* Main Content Area */}
        <div
          className="h-full overflow-hidden overflow-y-scroll rounded-sm flex flex-col"
          style={{
            width: isMobile ? "100%" : "74.5vw",
            gap: isMobile ? "5vw" : "1.429vw"
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
              placeholder="Search..."
              className="rounded-sm h-fit"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                boxShadow: "none",
                fontSize: isMobile ? "4vw" : "inherit"
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

          {/* Empty State */}
          <div className="flex flex-col flex-1 items-center justify-center rounded-md relative">
            <EmptyJobCard type={"admin"} onClick={() => setJobDialogOpen(true)} />
          </div>
        </div>

        {/* CTA Card */}
        <div
          className="flex flex-col rounded-xl h-fit overflow-hidden relative"
          style={{
            width: isMobile ? "100%" : "auto",
            padding: isMobile ? "8vw 6vw" : "1.714vw",
            background: "url('/asset/work-background.webp') no-repeat center/cover",
            marginTop: isMobile ? "5vw" : "0"
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
            className="relative font-bold"
            style={{
              fontSize: isMobile ? "4.5vw" : "1.286vw",
              color: "rgba(224, 224, 224, 1)",
              marginBottom: isMobile ? "2vw" : "0.286vw"
            }}
          >
            Recruit the best candidates
          </div>
          <div
            className="relative font-bold"
            style={{
              fontSize: isMobile ? "3.5vw" : "1vw",
              color: "rgba(255, 255, 255, 1)",
              marginBottom: isMobile ? "6vw" : "1.714vw"
            }}
          >
            Create jobs, invite, and hire with ease
          </div>

          <Button
            className="font-bold rounded-lg relative overflow-hidden cursor-pointer"
            onClick={() => setJobDialogOpen(true)}
            style={{
              fontSize: isMobile ? "4vw" : "1.143vw",
              color: "rgba(255, 255, 255, 1)",
              background: "rgba(1, 149, 159, 1)",
              height: isMobile ? "12vw" : "auto",
              padding: isMobile ? "3vw 5vw" : "0.5vw 1vw"
            }}
          >
            Create a new job
          </Button>
        </div>
      </div>
    </>

  );
}