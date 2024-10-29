import { Sidebar } from "@/types/sidebar";
import {
  BookUser,
  Building,
  Calendar,
  Home,
  Tag,
  Users2,
} from "lucide-react";

const adminSidebarData: Sidebar[] = [
  {
    id: 1,
    name: "Inicio",
    path: "/admin",
    role: "admin",
    icon: Home,
  },
  {
    id: 2,
    name: "Eventos",
    path: "/admin/events",
    role: "admin",
    icon: Calendar,
  },
  {
    id: 3,
    name: "Organizaciones",
    path: "/admin/organizations",
    role: "admin",
    icon: Building,
  },
  {
    id: 4,
    name: "Usuarios",
    path: "/admin/users",
    role: "admin",
    icon: Users2,
  },
  {
    id: 5,
    name: "Categorias",
    path: "/admin/categories",
    role: "admin",
    icon: Tag,
  },
];

const volunteerSidebarData: Sidebar[] = [
  {
    id: 1,
    name: "Inicio",
    path: "/volunteer",
    role: "volunteer",
    icon: Home,
  },
  {
    id: 2,
    name: "Eventos",
    path: "/volunteer/events",
    role: "volunteer",
    icon: Calendar,
  },
  {
    id: 3,
    name: "Organizaciones",
    path: "/volunteer/organizations",
    role: "volunteer",
    icon: BookUser,
  },
];

const organizationSidebarData: Sidebar[] = [
  {
    id: 1,
    name: "Inicio",
    path: "/organizer",
    role: "organization",
    icon: Home,
  },
  {
    id: 2,
    name: "Mis Eventos",
    path: "/organizer/my-events",
    role: "organization",
    icon: Calendar,
  },
  {
    id: 3,
    name: "Mi Organizacion",
    path: "/organizer/my-organization",
    role: "organization",
    icon: BookUser,
  },
];

export { adminSidebarData, volunteerSidebarData, organizationSidebarData };
