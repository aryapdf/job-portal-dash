"use client"

import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface Props {
  title?: string;
  profileImg?: string;
}

export default function NavBar(props: Props) {
  const deviceType = useSelector((state:RootState) => state.screen.deviceType);
  const isMobile =  deviceType === "mobile";




  return (
      <nav
        className="w-full bg-white border-b border-slate-200 shadow-sm fixed top-0 left-0 z-50"
        style={{
          height: isMobile ? "14vw" : "4vw",
          paddingInline: isMobile ? "5vw" : "20px",
        }}
      >
        <div className={"w-full h-full flex justify-between items-center"}>
          <div className={"font-bold text-slate-800"}>
            {props.title ? props.title : ''}
          </div>

          <img
              src={props.profileImg ? props.profileImg : 'asset/profile-placeholder.png'} alt={'profile'}
              style={{
                width: '28px',
                height: '28px'
              }}
          />
        </div>
      </nav>
  );
}
