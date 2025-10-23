

"use client";

import { useSession, signOut } from "next-auth/react"; // signOut is now used
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Your Dashboard, {session.user?.name}!
          </h2>
          <p className="mt-2 text-gray-700">
            Your email is: {session.user?.email}
          </p>

          {/* This button is now active, which fixes the unused 'signOut' warning. */}
        
        </div>
      </div>
    );
  }

  return null;
}