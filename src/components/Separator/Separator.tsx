"use client"
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface Props {
  type: "or" | "dashed"
}
export default function Separator (props: Props) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  return (
    <div className="relative w-full">
      {props.type === "or" && (
        <>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center">
        <span
          className="bg-white text-slate-500"
          style={{
            fontSize: isMobile ? "3.5vw" : "0.857vw",
            paddingInline: isMobile ? "2vw" : "0.857vw",
          }}
        >
          or
        </span>
          </div>
        </>
      )}

      {props.type === "dashed" && (
        <>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-s-2 border-slate-300" />
          </div>
        </>
      )}

    </div>
  )
}