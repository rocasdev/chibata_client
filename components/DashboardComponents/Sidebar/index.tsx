"use client";

import Link from "next/link";
import {
  adminSidebarData,
  volunteerSidebarData,
  organizationSidebarData,
} from "./sidebarData";
import Image from "next/image";
import { Bell, Settings, UserCircle } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { type Sidebar } from "@/types/sidebar";
const Sidebar = () => {
  const user = useUser();
  let menu: Sidebar[];
  if (user?.role_name === "Administrador") {
    menu = adminSidebarData;
  } else if (user?.role_name === "Voluntario") {
    menu = volunteerSidebarData;
  } else {
    menu = organizationSidebarData;
  }

  return (
    <div className="flex h-full w-full flex-col bg-neutral-200 p-1 dark:bg-gray-900">
      <Link
        href={user?.role_path || "#"}
        className="mb-5 flex items-center justify-center gap-1 p-2"
      >
        <Image
          src={`/images/logo/logo-icon.svg`}
          width={40}
          height={40}
          alt="Logo Chibatá"
          priority={true}
        />
        <span className="hidden font-bold text-green-800 dark:text-green-700 lg:block lg:text-2xl">
          Chibatá
        </span>
      </Link>
      <div className="menu flex flex-col items-center gap-y-2 p-2 lg:items-start">
        <span className="pointer-events-none hidden text-sm text-neutral-600 dark:text-neutral-400 lg:block">
          MENU
        </span>
        {menu.map((item) => (
          <Link
            href={item.path}
            key={item.id}
            className="flex items-center p-2"
          >
            <item.icon className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] lg:mr-2" />
            <span className="hidden lg:block lg:text-lg">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="menu flex flex-col items-center gap-y-2 p-2 lg:items-start">
        <span className="pointer-events-none hidden text-sm text-neutral-600 dark:text-neutral-400 lg:block">
          OTROS
        </span>
        <Link
          href={`${user?.role_path}/profile`}
          className="flex items-center p-2"
        >
          <UserCircle className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] md:mr-1 lg:mr-2" />
          <span className="hidden lg:block lg:text-lg">Perfil</span>
        </Link>
        <Link
          href={`${user?.role_path}/settings`}
          className="flex items-center p-2"
        >
          <Settings className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] lg:mr-2" />
          <span className="hidden lg:block lg:text-lg">Configuración</span>
        </Link>
        <Link
          href={`${user?.role_path}/notifications`}
          className="flex items-center p-2"
        >
          <Bell className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] md:mr-1 lg:mr-2" />
          <span className="hidden lg:block lg:text-lg">Notificaciones</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
