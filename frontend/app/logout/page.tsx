"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useSession();

  useEffect(() => {
    const performLogout = async () => {
      await logout(); // Wait for backend logout to complete
      router.push("/signout");
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
}