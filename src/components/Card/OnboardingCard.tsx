"use client"

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Card, CardDescription, CardFooter, CardTitle} from "@/components/ui/card";

export default function Page() {
  const deviceType = useSelector((state: RootState) => state.screen.deviceType)
  const isMobile = deviceType === "mobile"

  const style: any = {
    container: {
      width: "100vw",
      flex: "1 1 auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <div style={style.container}>
      <div
        className="w-full h-full relative flex flex-col !md:flex-row justify-between"
        style={{
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
            <Card
              className="w-fit h-fit text-center items-center rounded-md"
              style={{
                gap: "unset",
                border: "none",
                boxShadow: "none",
                padding: isMobile ? "5vw" : "0"
              }}
            >
              <img
                src="/asset/empty-state.png"
                alt="empty state"
                style={{
                  width: isMobile ? "50vw" : "21.857vw",
                  height: isMobile ? "50vw" : "21.429vw",
                  marginBottom: isMobile ? "5vw" : "1.429vw"
                }}
              />
              <CardTitle
                className="font-semibold text-neutral-900 w-fit h-fit"
                style={{
                  fontSize: isMobile ? "5vw" : "1.429vw",
                  marginBottom: isMobile ? "2vw" : "0.286vw",
                }}
              >
                No job openings available
              </CardTitle>
              <CardDescription
                className="w-fit h-fit"
                style={{
                  color: "rgba(76, 76, 76, 1)",
                  marginBottom: isMobile ? "5vw" : "1.143vw",
                  fontSize: isMobile ? "3.5vw" : "0.857vw",
                }}
              >
                Create a job opening now and start the candidate process.
              </CardDescription>
              <CardFooter style={{ padding: isMobile ? "0" : "inherit" }}>
                <Button
                  className="w-full font-bold transition-colors shadow-md hover:shadow-lg"
                  style={{
                    background: "rgba(251, 192, 55, 1)",
                    color: "rgba(64, 64, 64, 1)",
                    fontSize: isMobile ? "4vw" : "1.143vw",
                    height: isMobile ? "12vw" : "2.857vw",
                    padding: isMobile ? "3vw 5vw" : "0.429vw 1.143vw",
                    marginTop: isMobile ? "3vw" : "1vw"
                  }}
                >
                  Create a new job
                </Button>
              </CardFooter>
            </Card>
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
    </div>
  );
}