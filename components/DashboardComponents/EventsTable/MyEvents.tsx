"use client"
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
import { Calendar as CalendarIcon, Plus, ArrowBigLeft, ArrowBigRight, PencilIcon } from "lucide-react";
import Link from "next/link";
import { ToggleEventStatusButton } from "./ToggleEventStatusButton";
import { Event } from "./index";
import { BACKEND_URL } from "@/config/constants";
import { useUser } from "@/app/context/UserContext";

export default function EventsCardGrid() {
  const user = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/organizer/myevents?page=${page}`,
        { withCredentials: true },
      );
      const events = response.data.events;
      const totalPages = Math.ceil(response.data.totalPages);

      setEvents(events);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  const handleEventUpdated = useCallback(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="h-[300px] bg-neutral-300 dark:bg-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">{event.title}</h3>
          <Link
            href={`/organizer/my-events/${event.event_id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <CalendarIcon className="h-5 w-5" />
          </Link>
          <ToggleEventStatusButton
            event={event}
            onToggle={handleEventUpdated}
          />
          <Link
            href={`/organizer/my-events/edit/${event.event_id}`}
            className="text-yellow-500 hover:text-yellow-700"
          >
            <PencilIcon className="h-5 w-5 " />
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

  const CreateEventCard = () => (
    <Link href="/organizer/my-events/create" className="h-full">
      <Card className="flex h-[300px] cursor-pointer flex-col items-center justify-center transition-all bg-neutral-300 dark:bg-gray-900">
        <Plus className="mb-4 h-12 w-12 text-gray-400" />
        <p className="text-lg font-medium text-gray-600">Crear Nuevo Evento</p>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Eventos Registrados</h1>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 max-w-md rounded-md border !border-white p-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentPage === 1 && <CreateEventCard />}
        {filteredEvents.map((event) => (
          <EventCard key={event.event_id} event={event} />
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
