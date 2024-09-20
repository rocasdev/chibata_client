import { useState } from "react";
import { Trash } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function DeleteNotificationButton({
  notificationId,
  onDelete, // Añadir prop para manejar la eliminación
}: {
  notificationId: number;
  onDelete: (id: number) => void; // Tipo de la función callback
}) {
  const [open, setOpen] = useState(false);

  const deleteNotification = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/notifications/${notificationId}`, {withCredentials: true});
      console.log("Notification deleted");
      setOpen(false);
      if (onDelete) {
        onDelete(notificationId); // Llamar al callback para actualizar la lista
      }
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-red-500 hover:text-red-700">
        <Trash className="h-5 w-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Notificación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro que deseas eliminar esta notificación?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={deleteNotification}>Eliminar</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
