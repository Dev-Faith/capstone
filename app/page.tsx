"use client";
import Image from "next/image";
import Page from "./dashboard/page";
import LoginPage from "./login/page";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userLoggedIn } = useAuth();
  const router = useRouter();
  useEffect(() => {
    !userLoggedIn && router.push("/login");
  }, []);
  return (
    <div>
      <Page />
    </div>
  );
}
