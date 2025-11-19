"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/ragsearch");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏥</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Nurse Finder</h1>
        <p className="text-gray-600">Redirecting to search...</p>
      </div>
    </div>
  );
}