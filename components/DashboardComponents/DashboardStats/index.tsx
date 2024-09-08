"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users2, Calendar, BookUser, MapPinCheck } from "lucide-react";

const DashboardStats = () => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex flex-row items-center gap-4 justify-center w-full">
          <Users2 className="min-w-[20px] min-h-[20px] max-w-[40px] max-h-[40px]" />
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">Usuarios <br /> Registrados</CardTitle>
            <CardDescription className="text-xl mt-2 sm:text-lg md:text-xl lg:text-2xl text-green-800 dark:text-green-600">1'000.000</CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex flex-row items-center gap-4 justify-center w-full">
          <Calendar className="min-w-[20px] min-h-[20px] max-w-[40px] max-h-[40px]"/>
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">Eventos <br /> Registrados</CardTitle>
            <CardDescription className="text-xl mt-2 sm:text-lg md:text-xl lg:text-2xl text-green-800 dark:text-green-600">1'000.000</CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex flex-row items-center gap-4 justify-center w-full">
          <BookUser className="min-w-[20px] min-h-[20px] max-w-[40px] max-h-[40px]" />
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">Organizaciones Registradas</CardTitle>
            <CardDescription className="text-xl mt-2 sm:text-lg md:text-xl lg:text-2xl text-green-800 dark:text-green-600">1'000.000</CardDescription>
          </div>
        </CardHeader>
      </Card>
      <Card className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex flex-row items-center gap-4 justify-center w-full">
          <MapPinCheck className="min-w-[20px] min-h-[20px] max-w-[40px] max-h-[40px]"/>
          <div className="card__text text-center">
            <CardTitle className="text-base sm:text-sm md:text-base lg:text-lg">Localizaciones Registradas</CardTitle>
            <CardDescription className="text-xl mt-2 sm:text-lg md:text-xl lg:text-2xl text-green-800 dark:text-green-600">1'000.000</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </section>
  );
};

export default DashboardStats;
