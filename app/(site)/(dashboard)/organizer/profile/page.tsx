import Profile from "@/components/DashboardComponents/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Perfil",
};

export default function EventsPage() {
    return (
        <div>
            <Profile/>
        </div>
    );
} 
