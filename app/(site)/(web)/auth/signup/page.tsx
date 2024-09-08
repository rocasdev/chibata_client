import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | Chibatá",
  description: "Página para el registro de voluntarios.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
