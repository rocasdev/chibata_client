"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPinIcon, CalendarIcon, UserIcon, BuildingIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

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
  created_at: string;
  updated_at: string;
  organizer: string;
  organization: string;
};

const EventDetails = ({ id }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/events/${id}`,
          {
            withCredentials: true,
          },
        );
        setEvent(response.data.event);
        
      } catch (err) {
        setError("Error al cargar el evento");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
    console.log(event);
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

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h3 className="flex items-center text-lg font-semibold">
                  <UserIcon size={20} className="mr-2" /> Organizador
                </h3>
              </CardHeader>
              <CardContent>
                <p>{event.organizer}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="flex items-center text-lg font-semibold">
                  <BuildingIcon size={20} className="mr-2" /> Organización
                </h3>
              </CardHeader>
              <CardContent>
                <p>{event.organization}</p>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
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
            <Button className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700">
              Registrarse para el evento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
