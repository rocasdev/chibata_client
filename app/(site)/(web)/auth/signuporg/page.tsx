import Signuporg from "@/components/Auth/Siginuporg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | Chibatá",
  description: "Página para el registro de voluntarios.",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signuporg />
    </>
  );
}
