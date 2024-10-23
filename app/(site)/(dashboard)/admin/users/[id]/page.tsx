import UserDetails from "@/components/DashboardComponents/UsersTable/UserDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Usuario",
};

export default function UserDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div>
      <UserDetails id={params.id} />
    </div>
  );
}
