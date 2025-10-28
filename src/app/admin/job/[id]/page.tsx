"use client"

import AdminContent from "@/components/Content/AdminContent";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getCandidates} from "@/lib/services/candidateService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {EmptyJobCard} from "@/components/Card/EmptyJobCard";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Button} from "@/components/ui/button";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter()
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  const jobId = params.id as string;
  const jobName = searchParams.get("job-title");

  const [candidates, setCandidates] = useState<any[]>([]);

  const style = {
    tableHead: {
      fontSize: isMobile ? "1.56vw" : "0.86vw",
      fontWeight: "bold",
      padding: `${isMobile ? "3.39vw" : "1.86vw"} ${isMobile ? "2.08vw" : "1.14vw"}`,
      backgroundColor: "rgba(250, 250, 250, 1)",
    },
    tableCell: {
      fontSize: isMobile ? "1.82vw" : "1vw",
      padding: isMobile ? "2.08vw" : "1.14vw",
      borderBottom: `1px solid rgba(237, 237, 237, 1)`,
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCandidates(jobId);
      setCandidates(result);
      console.log(result);
    };
    fetchData();
  }, [jobId]);

  return (
    <div style={{
      width: "100vw",
      flex: "1 1 auto",
      display: "flex",
      flexDirection: "column",
    }}>
      <div className={"flex flex-col w-full h-full relative"} style={{
        padding: isMobile ? "3.13vw" : "1.71vw",
        gap: isMobile ? "3.13vw" : "1.71vw"
      }}>
        <div className={"font-bold flex items-center"} style={{
          color: "rgba(29, 31, 32, 1)",
          fontSize: isMobile ? "2.34vw" : "1.29vw",
          gap: isMobile ? "2.34vw" : "1.29vw"
        }}>
          <Button
            onClick={() => {router.push("/user")}}
            className="flex items-center justify-center border-1 cursor-pointer"
            style={{
              background: "transparent",
              padding: isMobile ? "0.52vw" : "0.29vw",
              border: "none",
              boxShadow: "none"
            }}
          >
            <img
              src="/asset/arrow-left.svg" alt=""
              className={"w-full h-full object-contain"}
              style={{
                width: isMobile ? "2.60vw" : "1.43vw",
                height: isMobile ? "2.60vw" : "1.43vw"
              }}
            />
          </Button>
          {jobName}
        </div>

        <div className={"rounded-md flex-1 flex flex-col"} style={{
          padding: isMobile ? "3.13vw" : "1.71vw",
          border: `1px solid rgba(224, 224, 224, 1)`
        }}>
          {candidates.length === 0
            ? (
              <div className={"w-full h-full flex items-center justify-center"}>
                <EmptyJobCard type={"candidates"} />
              </div>
            )
            : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{
                        ...style.tableHead,
                        borderBottom: `1px solid rgba(237, 237, 237, 1)`,
                        borderLeft: `1px solid rgba(237, 237, 237, 1)`,
                        borderRight: `1px solid rgba(237, 237, 237, 1)`
                      }}>NAMA LENGKAP</TableHead>
                      <TableHead style={{...style.tableHead}}>EMAIL ADDRESS</TableHead>
                      <TableHead style={{...style.tableHead}}>PHONE NUMBERS</TableHead>
                      <TableHead style={{...style.tableHead}}>DATE OF BIRTH</TableHead>
                      <TableHead style={{...style.tableHead}}>DOMICILE</TableHead>
                      <TableHead style={{...style.tableHead}}>GENDER</TableHead>
                      <TableHead style={{...style.tableHead}}>LINK LINKEDIN</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">No candidates found.</TableCell>
                      </TableRow>
                    )}
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell
                          style={{
                            ...style.tableCell,
                            borderBottom: `1px solid rgba(237, 237, 237, 1)`,
                            borderLeft: `1px solid rgba(237, 237, 237, 1)`,
                            borderRight: `1px solid rgba(237, 237, 237, 1)`
                          }}
                        >{candidate.fullName}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.email}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.phoneNumber}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.dateOfBirth ? new Date(candidate.dateOfBirth).toLocaleDateString() : '-'}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.domicile || '-'}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.gender.toUpperCase()}</TableCell>
                        <TableCell style={{...style.tableCell}}>
                          {candidate.linkedin ? (
                            <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              {candidate.linkedin}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}