"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  Users2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { BACKEND_URL } from "@/config/constants";
import { useRouter } from "next/navigation";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoicm9jYXNkZXYiLCJhIjoiY20yNGZpNjMyMGc3aTJrcHZsaHoxdXF0NSJ9.HXBo42kG3TCq171NnIWPhA";

type Event = {
  event_id: number;
  title: string;
  description: string | null;
  slug: string;
  date_time: string;
  address: string;
  latitude: number;
  longitude: number;
  banner: string;
  status: "Programado" | "En Progreso" | "Finalizado" | "Cancelado";
  state: boolean;
  max_volunteers: number;
  current_volunteers: number;
  created_at: string;
  updated_at: string;
  User: {
    firstname: string;
    surname: string;
  };
  Organization: {
    name: string;
  };
};

const VolunteerEventDetails = ({ id }: { id: number }) => {
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [isIn, setIsIn] = useState<Boolean | null>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/events/${id}`, {
          withCredentials: true,
        });
        const isEnroll = await axios.get(
          `${BACKEND_URL}/events/is-enroll/${id}`,
          {
            withCredentials: true,
          },
        );
        setIsIn(isEnroll.data.isIn);
        setEvent(response.data.event);
      } catch (err) {
        setError("Error al cargar el evento");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const handleRegister = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/events/enroll/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success("Registro exitoso");
      router.push(`/eventos/${id}`);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error registering for event:", err);
      toast.error("Error al registrarse. Inténtalo de nuevo.");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No se encontró el evento</div>;

  return (
    <section className="bg-gray-50 py-10 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="relative h-64 sm:h-80 md:h-96">
          <Image
            src={event.banner || "/images/default-event-banner.jpg"}
            alt={event.title}
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="p-6">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {event.title}
          </h1>

          <div className="mb-6 flex flex-wrap gap-4">
            <span className="flex items-center text-gray-600 dark:text-gray-300">
              <CalendarIcon size={20} className="mr-2" />
              {formatDate(event.date_time)}
            </span>
            <span className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPinIcon size={20} className="mr-2" />
              {event.address}
            </span>
          </div>

          <p className="mb-6 text-gray-700 dark:text-gray-300">
            {event.description}
          </p>

          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <h3 className="flex items-center text-lg font-semibold">
                  <UserIcon size={20} className="mr-2" /> Organizador
                </h3>
              </CardHeader>
              <CardContent>
                <p>{event.User?.firstname + " " + event.User?.surname}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="flex items-center text-lg font-semibold">
                  <BuildingIcon size={20} className="mr-2" /> Organización
                </h3>
              </CardHeader>
              <CardContent>
                <p>{event.Organization?.name}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="flex items-center text-lg font-semibold">
                  <Users2 size={20} className="mr-2" /> Cupos
                </h3>
              </CardHeader>
              <CardContent>
                <p>
                  {event.current_volunteers} / {event.max_volunteers}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">Ubicación del evento</h3>
            <div className="h-[400px] w-full overflow-hidden rounded-lg">
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: event.longitude,
                  latitude: event.latitude,
                  zoom: 14,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              >
                <Marker longitude={event.longitude} latitude={event.latitude}>
                  <div className="animate-bounce">
                    <MapPinIcon className="h-6 w-6 text-red-500" />
                  </div>
                </Marker>
              </Map>
            </div>
          </div>

          <div className="flex justify-center">
            {isIn ? (
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-300">
                Ya estás inscrito en este evento
              </h3>
            ) : event.current_volunteers === event.max_volunteers ? (
              <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-300">
                Este evento está lleno
              </h3>
            ) : (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Registrarse para el evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirmar registro</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que deseas registrarte para este evento?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleRegister}>Confirmar registro</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerEventDetails;
