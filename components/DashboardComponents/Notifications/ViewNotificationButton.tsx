"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { FileText } from "lucide-react";
import { Notification } from "./index";
import { BACKEND_URL } from "@/config/constants";

export function ViewNotificationButton({
  notificationId,
}: {
  notificationId: number;
}) {
  const [open, setOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<Notification | null>(
    null,
  ); // Cambiado a Notification | null

  const [loading, setLoading] = useState(false);

  const fetchNotificationDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/dashboard/notifications/${notificationId}`,
        { withCredentials: true },
      );
      console.log(response.data);
      setNotificationData(response.data.notification);
    } catch (error) {
      console.error("Error fetching notification details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchNotificationDetails();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-blue-500 hover:text-blue-700"
      >
        <FileText className="h-5 w-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Notificación</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p>Cargando...</p>
          ) : notificationData ? (
            <div>
              <p>
                <strong>Título:</strong> {notificationData.title}
              </p>
              <p>
                <strong>Mensaje:</strong> {notificationData.message}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(notificationData.created_at).toLocaleString()}
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
