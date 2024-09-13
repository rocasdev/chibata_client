"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users2, Calendar, BookUser, MapPinCheck } from "lucide-react";

const Welcome = () => {
  return (
    <section className="w-full mb-4">
      <Card className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex flex-row items-center gap-4 justify-center w-full">
          <h3 className="text-xl">Bienvenido de nuevo Administrador</h3>
        </CardHeader>
      </Card>
    </section>
  );
};

export default Welcome;
