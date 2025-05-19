// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}