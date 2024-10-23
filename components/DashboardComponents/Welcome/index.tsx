"use client";
import React from "react";
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

const Welcome = () => {
  const user = useUser();

  return (
    <section className="mb-4 w-full">
      <Card className="flex flex-col items-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 dark:text-gray-200">
        <CardHeader className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
          <div className="flex flex-col md:mr-5">
            <Image
              src={`${user?.avatar}`}
              alt="Profile photo"
              className="h-20 w-20 rounded-full md:h-32 md:w-32"
              width={100}
              height={100}
            />
          </div>
          <div className="grow-1 flex flex-col">
            <h2 className="text-[2em] font-medium">
              Bienvenido de nuevo{" "}
              <b className="font-extrabold">
                {user?.firstname} {user?.surname}
              </b>
            </h2>
            <h4 className="text-lg mt-2 font-medium text-green-600">{user?.role_name}</h4>
          </div>
        </CardHeader>
      </Card>
    </section>
  );
};

export default Welcome;
