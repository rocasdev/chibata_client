import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Check, X } from "lucide-react";
import { BACKEND_URL } from "@/config/constants";
import { useUsers } from "@/hooks/useUsers";

export function ToggleUserStatusButton({
  user,
  onToggle,
}: {
  user: { user_id: string; is_active: boolean };
  onToggle: () => void;
}) {
  const [isActive, setIsActive] = useState(user.is_active);
  const [open, setOpen] = useState(false);

  const toggleUserStatus = async () => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/users/${user.user_id}/toggle-is-active`,
        {},
        { withCredentials: true },
      );
      const updatedUser = response.data.user;
      setIsActive(updatedUser.is_active);
      onToggle();
      setOpen(false);
    } catch (error) {
      console.error("Error updating user status", error);
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
            ¿Estás seguro que deseas marcar este usuario como{" "}
            {isActive ? "inactivo" : "activo"}?
          </p>
          <DialogFooter>
            <Button variant="destructive" onClick={toggleUserStatus}>
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
