"use client";
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  user_id: string;
  firstname: string;
  surname: string;
  avatar: string;
  email: string;
  doc_type: string;
  doc_num: string;
  phone_number: string;
  is_active: boolean;
  Role: {
    name: string;
  };
};

const UserDetails = ({ id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}`,
          {
            withCredentials: true,
          },
        );
        setUser(response.data.user);
      } catch (err) {
        setError("Error al cargar el usuario");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No se encontró el usuario</div>;

  const userInitials = user ? `${user.firstname[0] + user.surname[0]}` : "NaN";

  return (
    <section className="bg-gray-50 py-10 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="p-6">
          <div className="flex w-full flex-col items-center justify-center md:flex-row">
            <div className="mr-5 flex flex-col items-center justify-center">
              <Avatar className="h-35 w-35">
                <AvatarFallback>{userInitials}</AvatarFallback>
                <AvatarImage src={user?.avatar} />
              </Avatar>
            </div>
            <div className="flex flex-col text-lg">
              <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                {user.firstname} {user.surname}
              </h1>

              <div className="mb-6 flex flex-wrap gap-4">
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  {user.is_active ? (
                    <CheckCircleIcon
                      size={20}
                      className="mr-2 text-green-500"
                    />
                  ) : (
                    <XCircleIcon size={20} className="mr-2 text-red-500" />
                  )}
                  {user.is_active ? "Activo" : "Inactivo"}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  <b className="font-bold text-green-600">Rol:</b>{" "}
                  {user.Role.name}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <b className="font-bold text-green-600">Email:</b>{" "}
                  {user.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <b className="font-bold text-green-600">Documento:</b>{" "}
                  {user.doc_type} {user.doc_num}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <b className="font-bold text-green-600">Teléfono:</b>{" "}
                  {user.phone_number}
                </p>
              </div>
              <Link href={"/admin/users"} className="bg-green-600 text-white text-center py-2 rounded-md">Volver</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetails;
