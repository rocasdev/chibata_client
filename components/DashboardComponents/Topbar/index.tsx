"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Para obtener la ruta actual
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import ThemeToggler from "./ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/app/context/UserContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, PanelLeft, Settings, UserCircle } from "lucide-react";
import Image from "next/image";
import {
  adminSidebarData,
  organizationSidebarData,
  volunteerSidebarData,
} from "../Sidebar/sidebarData";
import axios from "axios";
import { BACKEND_URL } from "@/config/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { type Notification } from "../Notifications";

const Topbar = () => {
  const user = useUser();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userInitials = user ? `${user.firstname[0] + user.surname[0]}` : "NaN";
  const router = useRouter();
  const pathname = usePathname(); // Ruta actual

  const fetchNotifications = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/notifications/own?page=${page}&limit=3`,
        { withCredentials: true },
      );
      const notifications = response.data.notifications;

      setNotifications(notifications);

      console.log("Fetched notifications:", notifications, "for page:", page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, null, {
        withCredentials: true,
      });

      // Redirigir al usuario a la página de inicio de sesión
      router.push("/auth/signin");

      toast.success("Has cerrado sesión correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Hubo un problema al cerrar sesión");
    }
  };

  const handleToggleRead = useCallback(
    async (updatedNotification: Notification) => {
      try {
        // Actualizar en el servidor
        await axios.patch(
          `${BACKEND_URL}/notifications/${updatedNotification.notification_id}`,
          null,
          { withCredentials: true },
        );
        await fetchNotifications(1);
      } catch (error) {
        console.error("Error toggling read status:", error);
      }
    },
    [fetchNotifications],
  );

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  let menu;

  if (user?.role_name === "Administrador") {
    menu = adminSidebarData;
  } else if (user?.role_name === "Voluntario") {
    menu = volunteerSidebarData;
  } else {
    menu = organizationSidebarData;
  }

  const pathSegments = pathname.split("/").filter((segment) => segment); // Evitar segmentos vacíos

  return (
    <>
      <header className="m flex h-[60px] w-full items-center justify-between bg-transparent px-4 shadow-lg lg:h-[70px] xl:px-8">
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger>
              <PanelLeft />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle className="sr-only">Titulo :b</SheetTitle>
                <SheetDescription>
                  <Link
                    href={user?.role_path || "/"}
                    className="mb-5 flex items-center justify-center gap-1 p-2"
                  >
                    <Image
                      src={`/images/logo/logo-icon.svg`}
                      width={40}
                      height={40}
                      alt="Logo Chibatá"
                      priority={true}
                    />
                    <span className="text-2xl font-bold text-green-800 dark:text-green-700">
                      Chibatá
                    </span>
                  </Link>
                  <div className="menu flex flex-col items-start gap-y-2 p-2">
                    <span className="pointer-events-none block text-sm text-neutral-600 dark:text-neutral-400">
                      MENU
                    </span>
                    {menu.map((item) => (
                      <Link
                        href={item.path}
                        key={item.id}
                        className="flex items-center p-2"
                      >
                        <item.icon className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] lg:mr-2" />
                        <span className="text-lg">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="menu flex flex-col items-start gap-y-2 p-2">
                    <span className="pointer-events-none block text-sm text-neutral-600 dark:text-neutral-400">
                      OTROS
                    </span>
                    <Link
                      href="/admin/profile"
                      className="flex items-center p-2"
                    >
                      <UserCircle className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] md:mr-1 lg:mr-2" />
                      <span className="text-lg">Perfil</span>
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center p-2"
                    >
                      <Settings className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] lg:mr-2" />
                      <span className="text-lg">Configuración</span>
                    </Link>
                    <Link
                      href="/admin/notifications"
                      className="flex items-center p-2"
                    >
                      <Bell className="h-[16px] !min-h-[16px] w-[16px] !min-w-[16px] md:mr-1 lg:mr-2" />
                      <span className="text-lg">Notificaciones</span>
                    </Link>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <Breadcrumb className="hidden lg:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={user?.role_path}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");

              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  {/* Verificar si es el último elemento para mostrarlo como página */}
                  {index === pathSegments.length - 1 ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbLink href={href}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="my-auto !border-none !bg-transparent !text-black dark:!text-white">
                <Bell size={24} fontSize={24} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              {notifications.length > 0 ? (
                <div className="relative flex flex-col gap-2">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="my-2 flex cursor-pointer justify-center gap-2"
                      onClick={() => handleToggleRead(notification)}
                    >
                      <span
                        className={`my-auto h-4 w-4 rounded-full bg-green-600 ${notification.is_read ? "hidden" : "block"}`}
                      ></span>
                      <div className="flex w-2/3 flex-col gap-2">
                        <p className="text-sm font-bold">
                          {notification.title}
                        </p>
                        <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                          {notification.message}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500">
                          {notification.created_at}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div
                    className="my-2 flex cursor-pointer justify-center gap-2"
                    onClick={() =>
                      router.push(`${user?.role_path}/notifications`)
                    }
                  >
                    <div className="flex w-2/3 flex-col gap-2 text-center">
                      <p className="text-sm font-bold">
                        Ver todas las notificaciones
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <h3>No hay notificaciones que mostrar</h3>
              )}
            </PopoverContent>
          </Popover>
          <ThemeToggler />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-2 rounded-lg bg-neutral-200 p-2 dark:bg-gray-900">
                <div className="flex flex-col text-end">
                  <h3 className="lg:text-md text-sm font-bold">
                    {user?.firstname} {user?.surname}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {user?.role_name}
                  </p>
                </div>
                <Avatar>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                  <AvatarImage src={user?.avatar} />
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`${user?.role_path}/profile`}>
                <DropdownMenuItem className="cursor-pointer">
                  Perfil
                </DropdownMenuItem>
              </Link>
              <Link href={`${user?.role_path}/profile`}>
                <DropdownMenuItem className="cursor-pointer">
                  Configuración
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default Topbar;
