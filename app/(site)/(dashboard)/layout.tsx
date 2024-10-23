"use client"

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import Sidebar from "@/components/DashboardComponents/Sidebar";
import Topbar from "@/components/DashboardComponents/Topbar";
import { UserProvider, useUser } from '../../context/UserContext';

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
        <div className="flex flex-col w-full lg-[82%]">
          <Topbar />
          <div className="content w-full h-[calc(100vh-60px)] overflow-x-hidden overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}