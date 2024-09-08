"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });


export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Lines />
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
