import About from "@/components/About";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Feature from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Inicio"
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Feature />
      <CTA />
      <FAQ />
      <Contact />
      </>
  );
}