"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getcontext } from "./context";

export default function HomePage() {
  const { data: session, status } = useSession();
  const context = getcontext();
  const user = context && typeof context === "object" && "user" in context ? (context as { user: any }).user : undefined;
  const router = useRouter();

  // Optional: Keep your auth redirect logic
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (Object.keys(user).length == 0 && !['loading','authenticated'].includes(status))) {
      console.log('here',!session,status)
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage" >
      <h1>Welcome!</h1>
  
    </div>
  );
}