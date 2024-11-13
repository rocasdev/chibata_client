import { useState } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Event } from "./index"; // Asegúrate de importar correctamente tu tipo o interfaz de Event
import { BACKEND_URL } from "@/config/constants";

export function ToggleEventStatusButton({
  event,
  onToggle,
}: {
  event: Event;
  onToggle: () => void;
}) {
  const [isActive, setIsActive] = useState(event.is_active === true);
  const [open, setOpen] = useState(false);

  const toggleEventStatus = async () => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/events/${event.event_id}`,
        {},
        { withCredentials: true },
      );

      const updatedEvent: Event = response.data.event;
      setIsActive(updatedEvent.is_active === true);
      onToggle(); // Call the onToggle function to refresh the table
      setOpen(false);
    } catch (error) {
      console.error("Error updating event status", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-green-500 hover:text-green-700"
      >
        {isActive ? (
          <X className="h-5 w-5 !text-red-600" />
        ) : (
          <Check className="h-5 w-5" />
        )}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro que deseas marcar este evento como{" "}
            {isActive ? "inactivo" : "activo"}?
          </p>
          <DialogFooter>
            <Button variant="destructive" onClick={toggleEventStatus}>
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
