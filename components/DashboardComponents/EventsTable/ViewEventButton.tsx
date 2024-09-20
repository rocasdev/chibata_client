"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Calendar } from "lucide-react"; // Un icono de calendario para los eventos
import { Event } from "./index"; // Define una interfaz para los eventos si aún no lo tienes

export function ViewEventButton({ eventId }: { eventId: number }) {
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState<Event | null>(null); // Define el tipo Event
  const [loading, setLoading] = useState(false);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/events/${eventId}`,
        { withCredentials: true },
      );
      console.log(response.data);
      setEventData(response.data.event);
    } catch (error) {
      console.error("Error fetching event details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchEventDetails();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-blue-500 hover:text-blue-700"
      >
        <Calendar className="h-5 w-5" /> {/* Icono de calendario */}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Evento</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p>Cargando...</p>
          ) : eventData ? (
            <div>
              <p>
                <strong>Título:</strong> {eventData.title}
              </p>
              <p>
                <strong>Descripción:</strong> {eventData.description}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(eventData.date).toLocaleString()}
              </p>
              <p>
                <strong>Hora:</strong> {eventData.time}
              </p>
              <p>
                <strong>Organizador:</strong> {eventData.organizer}
              </p>
              <p>
                <strong>Organización:</strong> {eventData.organization}
              </p>
              <p>
                <strong>Estado:</strong> {eventData.state ? "Activo" : "Inactivo"}
              </p>
            </div>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
