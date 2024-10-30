import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Notification } from ".";

export function ToggleReadButton({
  notification,
  onToggle,
}: {
  notification: Notification;
  onToggle: (updatedNotification: Notification) => void;
}) {
  const [isRead, setIsRead] = useState(notification.is_read);
  const [open, setOpen] = useState(false);

  const toggleReadStatus = async () => {
    try {
      // Actualiza el estado de la notificación en el servidor
      const response = await axios.patch(
        `https://chibataserver-production.up.railway.app/api/notifications/${notification.notification_id}`, // Asegúrate de que esta URL sea correcta en tu servidor
        null,
        { withCredentials: true }
      );
      
      // Obtiene la notificación actualizada
      const updatedNotification: Notification = response.data.notification;
      setIsRead(updatedNotification.is_read);
      onToggle(updatedNotification); // Actualiza el estado en el componente padre
      setOpen(false); // Cierra el diálogo después de la actualización
    } catch (error) {
      console.error("Error updating notification status", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-green-500 hover:text-green-700"
      >
        {isRead ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro que deseas marcar esta notificación como {isRead ? "no leída" : "leída"}?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={toggleReadStatus}>
              Confirmar
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
