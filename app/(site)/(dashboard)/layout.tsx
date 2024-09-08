"use client"

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Sidebar from "@/components/DashboardComponents/Sidebar";
import Topbar from "@/components/DashboardComponents/Topbar";
import { UserProvider, useUser } from '../../context/UserContext';
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  return (
    <UserProvider>
      <div className="relative h-screen w-full flex !overflow-x-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-[18%]">
          <Sidebar />
        </div>
        {/* Content */}
        <div className="flex w-full lg-[82%]">
          <Topbar/>
        </div>
      </div>
    </UserProvider>
  );
}