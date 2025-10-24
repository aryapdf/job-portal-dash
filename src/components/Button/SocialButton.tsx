// Reusable Social Button Component
"use client"

import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface Props {
    icon: string;
    text: string;
    onClick?: () => void;
}

export default function SocialButton  (props: Props) {
    const deviceType = useSelector((state: RootState) => state.screen.deviceType)
    const isMobile = deviceType === "mobile"

    return(
        <Button
            variant="outline"
            onClick={props.onClick}
            className="w-full font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 transition-all shadow-sm hover:shadow-md"
            style={{
                color: "rgba(64, 64, 64, 1)",
                fontSize: isMobile ? "3.5vw" : "1vw",
                height: isMobile ? "12vw" : "3.429vw",
            }}
        >
            <img
                src={props.icon}
                alt="icon"
                style={{
                    marginRight: isMobile ? "3vw" : "0.714vw",
                    height: isMobile ? "5vw" : props.icon.includes('google') ? "1.714vw" : "1.143vw",
                    width: isMobile ? "5vw" : props.icon.includes('google') ? "1.714vw" : "1.143vw",
                }}
            />
            {props.text}
        </Button>
    )
};