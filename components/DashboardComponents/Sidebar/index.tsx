"use client";

import Link from "next/link";
import { adminSidebarData, volunteerSidebarData, organizationSidebarData } from "./sidebarData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Bell, Settings, UserCircle } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
const Sidebar = () => {
  const user = useUser()

  let menu;

  if (user?.role_name === "Administrador") {
    menu = adminSidebarData;
  } else if (user?.role_name === "Voluntario") {
    menu = volunteerSidebarData
  } else {
    menu = organizationSidebarData
  }

  return (
    <div className="flex flex-col p-1 w-full h-full bg-neutral-200 dark:bg-gray-900">
      <Link href={user?.route || "/"} className="flex justify-center items-center p-2 gap-1 mb-5">
        <Image
          src={`/images/logo/logo-icon.svg`}
          width={40}
          height={40}
          alt="Logo Chibatá"
          priority={true}
        />
        <span className="hidden lg:block lg:text-2xl font-bold text-green-800 dark:text-green-700">Chibatá</span>
      </Link>
      <div className="menu flex flex-col gap-y-2 p-2 items-center lg:items-start">
        <span className="hidden lg:block text-sm text-neutral-600 dark:text-neutral-400 pointer-events-none">MENU</span>
        {
          menu.map((item) => (
            <Link href={item.path} key={item.id} className="flex items-center p-2">
              <item.icon className="!min-w-[16px] w-[16px] !min-h-[16px] h-[16px] lg:mr-2" />
              <span className="hidden lg:block lg:text-lg">{item.name}</span>
            </Link>
          ))
        }
      </div>
      <div className="menu flex flex-col gap-y-2 p-2 items-center lg:items-start">
        <span className="hidden lg:block text-sm text-neutral-600 dark:text-neutral-400 pointer-events-none">OTROS</span>
        <Link href="/admin/profile" className="flex items-center p-2">
          <UserCircle className="!min-w-[16px] w-[16px] !min-h-[16px] h-[16px] md:mr-1 lg:mr-2" />
          <span className="hidden lg:block lg:text-lg">Perfil</span>
        </Link>
        <Link href="/admin/settings" className="flex items-center p-2">
          <Settings className="!min-w-[16px] w-[16px] !min-h-[16px] h-[16px] lg:mr-2" />
          <span className="hidden lg:block lg:text-lg">Configuración</span>
        </Link>
        <Link href="/admin/notifications" className="flex items-center p-2">
          <Bell className="!min-w-[16px] w-[16px] !min-h-[16px] h-[16px] md:mr-1 lg:mr-2" />
          <span className="hidden lg:block lg:text-lg">Notificaciones</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;