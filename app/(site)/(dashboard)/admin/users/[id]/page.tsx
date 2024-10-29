import UserDetails from "@/components/DashboardComponents/UsersTable/UserDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Usuario",
};

export default async function UserDetailPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <UserDetails id={id} />
    </div>
  );
}
