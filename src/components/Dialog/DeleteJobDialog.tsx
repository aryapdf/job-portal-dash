"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteJob } from "@/lib/services/jobService";
import { useState } from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
  onDeleted?: () => void;
}

export default function DeleteJobDialog(props: Props) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile";;

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!props.jobId) return;
    setLoading(true);
    try {
      await deleteJob(props.jobId);
      props.onDeleted?.();
      props.onOpenChange(false);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="max-w-sm"
        style={{
          padding: isMobile ? "5vw 4vw" : "2.571vw 1.714vw",
        }}>
        <DialogHeader>
          <DialogTitle
            className="font-bold text-slate-900"
            style={{fontSize: isMobile ? "4.5vw" : "1.286vw", paddingBottom: isMobile ? "3vw" : "1.559vw"}}
          >Delete Job</DialogTitle>
          <DialogDescription style={{fontSize: isMobile ? "3.5vw" : "0.857vw"}}>
            Are you sure you want to delete this job? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => props.onOpenChange(false)}
            disabled={loading}
            style={{
              fontSize: isMobile ? "3.5vw" : "0.857vw",
              padding: isMobile
                ? "2vw 4vw"
                : "0.86vw 1.143vw",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            style={{
              fontSize: isMobile ? "3.5vw" : "0.857vw",
              padding: isMobile
                ? "2vw 4vw"
                : "0.86vw 1.143vw",
              color: "white",
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
