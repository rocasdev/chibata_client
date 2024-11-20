"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, X } from "lucide-react";
import Link from "next/link";
import { BACKEND_URL } from "@/config/constants";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Category {
  category_id: string;
  name: string;
}

interface Organization {
  organization_id: string;
  name: string;
  logo: string;
}

interface EventType {
  event_id: string;
  title: string;
  description: string;
  date_time: string;
  status: "Programado" | "En Progreso" | "Finalizado" | "Cancelado";
  max_volunteers: number;
  current_volunteers: number;
  Organization: Organization;
  Category: Category;
}

interface EventCardProps {
  event: EventType;
}

const ALL_CATEGORIES = "all_categories";
const ALL_ORGANIZATIONS = "all_organizations";

const EventCard = ({ event }: EventCardProps) => (
  <Card className="h-[300px] bg-neutral-300 dark:bg-gray-900">
    <CardHeader>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <Link
          href={`/volunteer/events/${event.event_id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          <CalendarIcon className="h-5 w-5" />
        </Link>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          {new Date(event.date_time).toLocaleString()}
        </p>
      </div>
      <div className="mb-2">
        <p className="line-clamp-2 text-sm text-gray-700">
          {event.description || "Sin descripción"}
        </p>
      </div>
      <div className="mt-2">
        <p className="text-sm">Organización: {event.Organization.name}</p>
        <p className="text-sm">Categoría: {event.Category.name}</p>
      </div>
    </CardContent>
    <CardFooter>
      <span
        className={`mr-4 rounded px-2 py-1 text-sm ${
          event.status === "Programado"
            ? "bg-blue-100 text-blue-800"
            : event.status === "En Progreso"
              ? "bg-green-100 text-green-800"
              : event.status === "Finalizado"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
        }`}
      >
        {event.status}
      </span>
      <span
        className={`rounded-md px-2 py-1 text-sm ${event.current_volunteers === event.max_volunteers ? "bg-red-200 text-red-900" : "bg-green-200 text-green-900"} `}
      >
        Cupos: {event.current_volunteers} / {event.max_volunteers}
      </span>
    </CardFooter>
  </Card>
);

export default function VolunteerEventsView() {
  const [date, setDate] = useState<Date>();
  const [events, setEvents] = useState<EventType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [selectedOrganization, setSelectedOrganization] =
    useState<string>(ALL_ORGANIZATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ events: EventType[] }>(
        `${BACKEND_URL}/events`,
        {
          withCredentials: true,
        },
      );
      console.log("Eventos recibidos del backend:", response.data.events);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get<{ categories: Category[] }>(
        `${BACKEND_URL}/categories`,
        {
          withCredentials: true,
        },
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await axios.get<{ organizations: Organization[] }>(
        `${BACKEND_URL}/organizations`,
        {
          withCredentials: true,
        },
      );
      setOrganizations(response.data.organizations || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchOrganizations();
  }, [fetchEvents, fetchCategories, fetchOrganizations]);

  // Función auxiliar para normalizar fechas
  const normalizeDate = (date: Date | string) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const today = normalizeDate(new Date());
  console.log(today);

  const filteredEvents = events.filter((event) => {
    const eventDate = normalizeDate(event.date_time);
    const searchDate = date ? normalizeDate(date) : null;
    console.log(searchDate);
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES ||
      event.Category.category_id === selectedCategory;
    const matchesOrganization =
      selectedOrganization === ALL_ORGANIZATIONS ||
      event.Organization.organization_id === selectedOrganization;
    const matchesDate = searchDate
      ? eventDate.getTime() === searchDate.getTime()
      : true;
    const isFutureOrToday = eventDate >= today;
    const isFinished = event.status != "Finalizado";

    console.log(`Filtering event: ${event.title}`);
    console.log(`  Event date: ${eventDate.toISOString()}`);
    console.log(`  Search date: ${searchDate?.toISOString()}`);
    console.log(`  matchesSearch: ${matchesSearch}`);
    console.log(`  matchesCategory: ${matchesCategory}`);
    console.log(`  matchesOrganization: ${matchesOrganization}`);
    console.log(`  matchesDate: ${matchesDate}`);
    console.log(`  isFutureOrToday: ${isFutureOrToday}`);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesOrganization &&
      matchesDate &&
      isFutureOrToday &&
      isFinished
    );
  });

  console.log("Eventos filtrados:", filteredEvents);

  const clearFilters = () => {
    setSelectedCategory(ALL_CATEGORIES);
    setSelectedOrganization(ALL_ORGANIZATIONS);
    setDate(undefined);
    setSearchQuery("");
  };

  const getActiveFilters = () => {
    const filters: string[] = [];

    if (selectedCategory !== ALL_CATEGORIES) {
      const category = categories.find(
        (c) => c.category_id === selectedCategory,
      );
      if (category) filters.push(`Categoría: ${category.name}`);
    }

    if (selectedOrganization !== ALL_ORGANIZATIONS) {
      const organization = organizations.find(
        (o) => o.organization_id === selectedOrganization,
      );
      if (organization) filters.push(`Organización: ${organization.name}`);
    }

    if (date) {
      filters.push(`Fecha: ${new Date(date).toLocaleDateString()}`);
    }

    if (searchQuery) {
      filters.push(`Búsqueda: ${searchQuery}`);
    }

    return filters;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Eventos Disponibles</h1>

        {/* Filters Section */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Input
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>
                Todas las categorías
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedOrganization}
            onValueChange={setSelectedOrganization}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Organización" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ORGANIZATIONS}>
                Todas las organizaciones
              </SelectItem>
              {organizations.map((org) => (
                <SelectItem
                  key={org.organization_id}
                  value={org.organization_id}
                >
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start rounded-none !border-b-2 border-none !bg-transparent text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {getActiveFilters().length > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              Limpiar filtros
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {getActiveFilters().length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-gray-600">
              Filtros activos:
            </h2>
            <div className="flex flex-wrap gap-2">
              {getActiveFilters().map((filter, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-gray-500">Cargando eventos...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))
          ) : (
            <div className="col-span-full flex h-[300px] items-center justify-center">
              <p className="text-gray-500">No se encontraron eventos</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
