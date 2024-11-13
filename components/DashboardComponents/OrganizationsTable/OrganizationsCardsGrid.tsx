/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowBigLeft, ArrowBigRight, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BACKEND_URL } from "@/config/constants";

type Organization = {
  organization_id: string;
  name: string;
  logo: string;
  is_active: boolean;
};

export default function OrganizationsCardGrid() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrganizations = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/organizations?page=${page}`,
        { withCredentials: true },
      );
      const organizations = response.data.organizations;
      const totalPages = Math.ceil(response.data.totalPages);

      setOrganizations(organizations);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations(currentPage);
  }, [currentPage, fetchOrganizations]);

  const filteredOrganizations = organizations.filter((organization) =>
    organization.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const OrganizationCard = ({
    organization,
  }: {
    organization: Organization;
  }) => (
    <Card className="flex h-[400px] w-[300px] flex-col overflow-hidden transition-all hover:shadow-lg bg-neutral-300 dark:bg-gray-900">
      <CardHeader className="flex-none pb-0">
        <h3 className="truncate text-xl font-semibold">{organization.name}</h3>
        <Badge
          className={`${organization.is_active? "!text-green-500" : "!text-red-500"} text-sm text-center font-bold !bg-transparent w-full`}
        >
          {organization.is_active ? (
            <CheckCircle className="mr-1 h-3 w-3" />
          ) : (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {organization.is_active ? "Activa" : "Inactiva"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center p-6">
        <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary/10">
          
          <img
            src={organization.logo}
            alt={`Logo de ${organization.name}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-none">
        <Button asChild className="w-full">
          <Link href={`/volunteer/organizations/${organization.organization_id}`}>
            Ver Organización
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Organizaciones</h1>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar organizaciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 max-w-md rounded-md border !border-white p-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredOrganizations.map((organization) => (
          <OrganizationCard
            key={organization.organization_id}
            organization={organization}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          <ArrowBigLeft className="h-5 w-5" />
        </Button>

        <div>
          Página{" "}
          <strong>
            {currentPage} de {totalPages}
          </strong>
        </div>

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
        >
          <ArrowBigRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
