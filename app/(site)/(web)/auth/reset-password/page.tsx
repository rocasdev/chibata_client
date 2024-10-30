import ResetPassword from "@/components/Auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Chibata",
  description: "Inicio de sesion en el sistema",
};

const ResetPasswordPage = () => {
  return (
    <>
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
