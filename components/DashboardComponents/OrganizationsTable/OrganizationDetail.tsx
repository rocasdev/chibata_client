"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, CheckCircle, XCircle, Globe } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

interface Organization {
  id: string;
  name: string;
  nit: string;
  address: string;
  founding_date: string;
  contact_number: string;
  is_active: boolean;
  logo: string;
  website?: string;
}

const OrganizationDetails = ({ id }: { id: string }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(
          `https://chibataserver-production.up.railway.app/api/organizations/${id}`,
          {
            withCredentials: true,
          },
        );
        setOrganization(response.data.organization);
      } catch (err) {
        setError("Error al cargar la organización");
        console.error("Error fetching organization:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">No se encontró la organización</div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/organizations">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Detalles de la Organización
          </h1>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <div className="flex flex-col items-center justify-between gap-4 border-b border-stroke pb-8 dark:border-strokedark lg:flex-row">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg lg:h-32 lg:w-32">
                <Image
                  src={
                    organization.logo || "/images/placeholder-organization.jpg"
                  }
                  alt="Organization logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-black dark:text-white lg:text-3xl">
                    {organization.name}
                  </h2>
                  {organization.is_active ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} />
                  )}
                </div>
                <p className="text-body-color dark:text-body-color-dark mt-1">
                  NIT: {organization.nit}
                </p>
                {organization.website && (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Globe size={16} />
                    Sitio web
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8">
            <Card className="border-stroke bg-transparent dark:border-strokedark mb-5">
              <CardHeader className="border-b border-stroke pb-4 dark:border-strokedark">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Información de la Organización
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Dirección
                    </p>
                    <p className="text-black dark:text-white">
                      {organization.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Fecha de Fundación
                    </p>
                    <p className="text-black dark:text-white">
                      {new Date(organization.founding_date).toLocaleDateString(
                        "es-CO",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Número de Contacto
                    </p>
                    <p className="text-black dark:text-white">
                      +57 {organization.contact_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Estado
                    </p>
                    <p className="flex items-center gap-2 text-black dark:text-white">
                      {organization.is_active ? (
                        <>
                          <CheckCircle className="text-green-500" size={16} />
                          Activa
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-500" size={16} />
                          Inactiva
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrganizationDetails;
