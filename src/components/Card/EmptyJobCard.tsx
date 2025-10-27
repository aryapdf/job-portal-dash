import {Card, CardDescription, CardFooter, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface Props {
  type: "admin" | "user" | "candidates"
  onClick?: () => void;
}

export function EmptyJobCard(props: Props) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === 'mobile'

  return (
    <>
      {props.type === "admin" && (
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
          <CardFooter style={{padding: isMobile ? "0" : "inherit"}}>
            {props.onClick && (
              <Button
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  props.onClick ? props.onClick() : console.log('')
                }}
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
            )}
          </CardFooter>
        </Card>
      )}

      {props.type === "user" && (
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
            Please wait for the next batch of openings.
          </CardDescription>
          <CardFooter style={{padding: isMobile ? "0" : "inherit"}}>
          </CardFooter>
        </Card>
      )}

      {props.type === "candidates" && (
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
            src="/asset/empty-candidate-state.png"
            alt="empty state"
            style={{
              width: isMobile ? "50vw" : "18.286vw",
              height: isMobile ? "50vw" : "17.143vw",
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
            No candidates found
          </CardTitle>
          <CardDescription
            className="w-fit h-fit"
            style={{
              color: "rgba(76, 76, 76, 1)",
              marginBottom: isMobile ? "5vw" : "1.143vw",
              fontSize: isMobile ? "3.5vw" : "0.857vw",
            }}
          >
            Share your job vacancies so that more candidates will apply.
          </CardDescription>
          <CardFooter style={{padding: isMobile ? "0" : "inherit"}}>
          </CardFooter>
        </Card>
      )}
    </>

  )
}