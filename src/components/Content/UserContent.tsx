"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import JobFormDialog from "@/components/Dialog/JobFormDialog";
import {useState} from "react";
import {EmptyJobCard} from "@/components/Card/EmptyJobCard";

export default function UserContent() {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  return (
    <>
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
          className="w-full h-full overflow-hidden overflow-y-scroll rounded-sm flex flex-col"

        >
          {/* Empty State */}
          <div className="flex flex-col flex-1 items-center justify-center rounded-md relative">
            <EmptyJobCard type={"user"} />
          </div>
        </div>
      </div>
    </>

  );
}