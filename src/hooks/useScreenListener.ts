import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScreenWidth } from "@/store/screenSlice";


export function useScreenListener() {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => {
            dispatch(setScreenWidth(window.innerWidth));
        }

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);
}