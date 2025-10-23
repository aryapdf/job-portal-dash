"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { setUser, clearUser } from "@/store/userSlice";

export default function AuthListener({children}: {children: React.ReactNode}) {
  const dispatch = useDispatch();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
              let role: "admin" | "user" = "user";
              try {
                  const tokenResult = await user.getIdTokenResult();
                  role = (tokenResult.claims.role as "admin" | "user") || "user";
              } catch (error) {
                  console.error("Failed to get user role: ", error);
              }

              dispatch(
                  setUser({
                      uid:user.uid,
                      email: user.email,
                      role,
                  })
              );
          } else {
              dispatch(clearUser());
          }
      });

      return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}