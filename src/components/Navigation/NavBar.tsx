"use client"

import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {auth} from "@/lib/firebase";

interface Props {
  title?: string;
  profileImg?: string;
}

export default function NavBar(props: Props) {
  const deviceType = useSelector((state:RootState) => state.screen.deviceType);
  const isMobile =  deviceType === "mobile";
  const loggedIn = useSelector((state:RootState) => state.user.loggedIn);




  return (
      <nav
        className="w-full bg-white border-b border-slate-200 shadow-sm relative top-0 left-0 z-50"
        style={{
          height: isMobile ? "14vw" : "4.571vw",
          paddingInline: isMobile ? "5vw" : "1.429vw",
        }}
      >
        <div className={"w-full h-full flex justify-between items-center"}>
          <div
              className={"font-bold text-slate-800"}
              style={{
                fontSize: "1.286vw",
              }}
          >
            {props.title ? props.title : ''}
          </div>

          <div className="flex items-center" style={{gap: 8}}>
            {loggedIn && (
              <div
                className={"font-semibold text-slate-500 cursor-pointer"}
                onClick={() => auth.signOut()}
              >
                Logout
              </div>
            )}
            <img
              src={props.profileImg ? props.profileImg : 'asset/profile-placeholder.png'} alt={'profile'}
              style={{
                width: '2vw',
                height: '2vw'
              }}
            />
          </div>
        </div>
      </nav>
  );
}
