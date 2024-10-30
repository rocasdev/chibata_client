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

  // Fetch counts on component mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts = await axios.get(
          "https://chibataserver-production.up.railway.app//api/dashboard/counts/",
          {
            withCredentials: true
          },
        );
        setUserCount(counts.data.user_counts || 0);
        setEventCount(counts.data.event_counts || 0);
        setOrganizationCount(counts.data.organization_counts || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
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
              Organizaciones <br /> Registradas
            </CardTitle>
            <CardDescription className="mt-2 text-xl text-green-800 dark:text-green-600 sm:text-lg md:text-xl lg:text-2xl">
              {organizationCount !== null && organizationCount !== undefined
                ? organizationCount
                : "Cargando..."}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </section>
  );
};

export default DashboardStats;
