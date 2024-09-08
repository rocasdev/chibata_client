import ForgotPassword from "@/components/Auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Chibata",
  description: "Inicio de sesion en el sistema",
  // other metadata
};

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
