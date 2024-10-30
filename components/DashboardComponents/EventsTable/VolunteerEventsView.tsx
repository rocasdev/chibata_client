"use client";
import { useEffect, useState, useCallback } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

type Category = {
  category_id: string;
  name: string;
};

type Organization = {
  organization_id: string;
  name: string;
  logo: string;
};

type EventType = {
  event_id: string;
  title: string;
  description: string;
  date_time: string;
  status: "Programado" | "En Progreso" | "Finalizado" | "Cancelado";
  Organization: Organization;
  Category: Category;
};

interface EventCardProps {
  event: EventType;
}

const EventCard = ({ event }: EventCardProps) => (
  <Card className="flex h-[300px] flex-col">
    <CardHeader className="flex-none">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <Link
          href={`/volunteer/events/${event.event_id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          <Calendar className="h-5 w-5" />
        </Link>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
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
    <CardFooter className="flex-none">
      <span
        className={`rounded px-2 py-1 text-sm ${
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
    </CardFooter>
  </Card>
);

interface CategorySliderProps {
  categoryName: string;
  events: EventType[];
  categoryId?: string;
}

const CategorySlider = ({
  categoryName,
  events,
  categoryId,
}: CategorySliderProps) => (
  <div className="mb-8">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold">{categoryName}</h2>
      <Link
        href={`/volunteer/events/category/${categoryId}`}
        className={!categoryId ? "pointer-events-none opacity-50" : ""}
      >
        <Button variant="ghost" className="flex items-center gap-2">
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {events.length > 0 ? (
          events.map((event) => (
            <CarouselItem
              key={event.event_id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <EventCard event={event} />
            </CarouselItem>
          ))
        ) : (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card className="flex h-[300px] items-center justify-center">
              <p className="text-gray-500">No hay eventos disponibles</p>
            </Card>
          </CarouselItem>
        )}
      </CarouselContent>
      {events.length > 0 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  </div>
);

export default function VolunteerEventsView() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory === "all") {
        response = await axios.get("https://chibataserver-production.up.railway.app/api/events", {
          withCredentials: true,
        });
        setEvents(response.data.events || []);
      } else {
        const category = categories.find(
          (cat) => cat.name === selectedCategory,
        );
        if (category) {
          response = await axios.get(
            `https://chibataserver-production.up.railway.app/api/events/category/${category.category_id}`,
            { withCredentials: true },
          );
          setEvents(response.data.events.events || []);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, categories]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("https://chibataserver-production.up.railway.app/api/categories", {
        withCredentials: true,
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, selectedCategory]);

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const eventsByCategory =
    selectedCategory === "all"
      ? categories.reduce(
          (acc, category) => ({
            ...acc,
            [category.name]: filteredEvents.filter(
              (event) => event.Category.category_id === category.category_id,
            ),
          }),
          {} as Record<string, EventType[]>,
        )
      : {
          [selectedCategory]: filteredEvents,
        };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Eventos Disponibles</h1>
        <div className="flex gap-4">
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
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-gray-500">Cargando eventos...</p>
        </div>
      ) : (
        Object.entries(eventsByCategory).map(
          ([categoryName, categoryEvents]) => {
            const category = categories.find(
              (cat) => cat.name === categoryName,
            );
            return (
              <CategorySlider
                key={categoryName}
                categoryName={categoryName}
                events={categoryEvents}
                categoryId={category?.category_id}
              />
            );
          },
        )
      )}
    </div>
  );
}
