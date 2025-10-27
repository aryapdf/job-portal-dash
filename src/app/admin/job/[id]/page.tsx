"use client"

import AdminContent from "@/components/Content/AdminContent";
import {useParams, useSearchParams} from "next/navigation";
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

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();

  const jobId = params.id as string;
  const jobName = searchParams.get("job-title");

  const [candidates, setCandidates] = useState<any[]>([]);

  const style = {
    tableHead: {
      fontSize: "12px",
      fontWeight: "bold",
      padding: "26px 16px",
      backgroundColor: "rgba(250, 250, 250, 1)",
    },
    tableCell: {
      fontSize: "14px",
      padding: "16px",
      borderBottom: "1px solid rgba(237, 237, 237, 1",
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
      <div className={"flex flex-col w-full h-full relative"} style={{padding: "24px", gap:"24px"}}>
        <div className={"font-bold"} style={{color: "rgba(29, 31, 32, 1)", fontSize: "18px"}}>{jobName}</div>

        <div className={"rounded-md flex-1 flex flex-col items-center justify-center"} style={{padding: "24px", border: "1px solid rgba(224, 224, 224, 1)"}}>
          {candidates.length === 0
            ? (
              <>
                <EmptyJobCard type={"candidates"} />
              </>
            )
            : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{
                        ...style.tableHead,
                        borderBottom: "1px solid rgba(237, 237, 237, 1",
                        borderLeft: "1px solid rgba(237, 237, 237, 1",
                        borderRight: "1px solid rgba(237, 237, 237, 1"
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
                            borderBottom: "1px solid rgba(237, 237, 237, 1",
                            borderLeft: "1px solid rgba(237, 237, 237, 1",
                            borderRight: "1px solid rgba(237, 237, 237, 1"
                          }}
                        >{candidate.fullName}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.email}</TableCell>
                        <TableCell style={{...style.tableCell}}>{candidate.phoneNumber}</TableCell>
                        <TableCell style={{...style.tableCell}}>{new Date(candidate.dateOfBirth).toLocaleDateString()}</TableCell>
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
