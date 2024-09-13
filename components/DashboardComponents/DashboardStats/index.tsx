"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users2, Calendar, BookUser, MapPinCheck } from "lucide-react";

const DashboardStats = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [organizationCount, setOrganizationCount] = useState<number | null>(
    null,
  );
  const [locationCount, setLocationCount] = useState<number | null>(null);

  // Fetch counts on component mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Asegúrate de tener el token correcto

        const userCountResponse = await axios.get(
          "http://localhost:1337/api/users/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const eventCountResponse = await axios.get(
          "http://localhost:1337/api/events/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const organizationCountResponse = await axios.get(
          "http://localhost:1337/api/organizations/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // const locationCountResponse = await axios.get(
        //   "http://localhost:1337/api/locations/",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   },
        // );
        console.log(userCountResponse.data.length);
        console.log(eventCountResponse.data.length);
        console.log(organizationCountResponse.data.length);
        setUserCount(userCountResponse.data.length || 0);
        setEventCount(eventCountResponse.data.length || 0);
        setOrganizationCount(organizationCountResponse.data.length || 0);
        // setLocationCount(locationCountResponse.data.count);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex w-full flex-row items-center justify-center gap-4">
          <Users2 className="max-h-[40px] min-h-[20px] min-w-[20px] max-w-[40px]" />
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">
              Usuarios <br /> Registrados
            </CardTitle>
            <CardDescription className="mt-2 text-xl text-green-800 dark:text-green-600 sm:text-lg md:text-xl lg:text-2xl">
              {userCount !== null && userCount !== undefined
                ? userCount.toLocaleString()
                : "Cargando..."}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex w-full flex-row items-center justify-center gap-4">
          <Calendar className="max-h-[40px] min-h-[20px] min-w-[20px] max-w-[40px]" />
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">
              Eventos <br /> Registrados
            </CardTitle>
            <CardDescription className="mt-2 text-xl text-green-800 dark:text-green-600 sm:text-lg md:text-xl lg:text-2xl">
              {eventCount !== null && eventCount !== undefined
                ? eventCount.toLocaleString()
                : "Cargando..."}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex w-full flex-row items-center justify-center gap-4">
          <BookUser className="max-h-[40px] min-h-[20px] min-w-[20px] max-w-[40px]" />
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">
              Organizaciones Registradas
            </CardTitle>
            <CardDescription className="mt-2 text-xl text-green-800 dark:text-green-600 sm:text-lg md:text-xl lg:text-2xl">
              {organizationCount !== null && organizationCount !== undefined
                ? organizationCount
                : "Cargando..."}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex w-full flex-row items-center justify-center gap-4">
          <MapPinCheck className="max-h-[40px] min-h-[20px] min-w-[20px] max-w-[40px]" />
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">
              Localizaciones Registradas
            </CardTitle>
            <CardDescription className="mt-2 text-xl text-green-800 dark:text-green-600 sm:text-lg md:text-xl lg:text-2xl">
              {locationCount !== null ? locationCount : "Cargando..."}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </section>
  );
};

export default DashboardStats;
