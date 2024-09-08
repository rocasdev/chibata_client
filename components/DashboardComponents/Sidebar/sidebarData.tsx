import { Sidebar } from "@/types/sidebar";
import { BookUser, Building, Calendar, Home, MapPinCheck, Tag, Users2 } from "lucide-react";

const adminSidebarData : Sidebar[] = [
  {
    id: 1,
    name: "Inicio",
    path: "/admin",
    role: "admin",
    icon: Home
  },
  {
    id: 2,
    name: "Eventos",
    path: "/admin/events",
    role: "admin",
    icon: Calendar
  },
  {
    id: 3,
    name: "Organizaciones",
    path: "/admin/organizations",
    role: "admin",
    icon: Building
  },
  {
    id: 4,
    name: "Usuarios",
    path: "/admin/users",
    role: "admin",
    icon: Users2
  },
  {
    id: 5,
    name: "Localizaciones",
    path: "/admin/localizations",
    role: "admin",
    icon: MapPinCheck
  },
  {
    id: 6,
    name: "Categorias",
    path: "/admin/categories",
    role: "admin",
    icon: Tag
  },
]

const volunteerSidebarData : Sidebar[] = [
  {
    id: 1,
    name: "Inicio",
    path: "/volunteer",
    role: "volunteer",
    icon: Home
  },
  {
    id: 2,
    name: "Eventos",
    path: "/admin/events",
    role: "volunteer",
    icon: Calendar
  },
  {
    id: 3,
    name: "Organizaciones",
    path: "/admin/organizations",
    role: "volunteer",
    icon: BookUser
  },
  {
    id: 4,
    name: "Usuarios",
    path: "/admin/users",
    role: "volunteer",
    icon: Users2
  },
  {
    id: 5,
    name: "Localizaciones",
    path: "/admin/localizations",
    role: "volunteer",
    icon: MapPinCheck
  },
  {
    id: 6,
    name: "Categorias",
    path: "/admin/categories",
    role: "volunteer",
    icon: Tag
  },
]

const organizationSidebarData : Sidebar[] = [
  {
    id: 1,
    name: "Inicio",
    path: "/admin",
    role: "organization",
    icon: Home
  },
  {
    id: 2,
    name: "Eventos",
    path: "/admin/events",
    role: "admin",
    icon: Calendar
  },
  {
    id: 3,
    name: "Organizaciones",
    path: "/admin/organizations",
    role: "organization",
    icon: BookUser
  },
  {
    id: 4,
    name: "Usuarios",
    path: "/admin/users",
    role: "organization",
    icon: Users2
  },
  {
    id: 5,
    name: "Localizaciones",
    path: "/admin/localizations",
    role: "organization",
    icon: MapPinCheck
  },
  {
    id: 6,
    name: "Categorias",
    path: "/admin/categories",
    role: "organization",
    icon: Tag
  },
]

export {
  adminSidebarData,
  volunteerSidebarData,
  organizationSidebarData
}