import React, { useState } from 'react';
import axios from 'axios';
import { Event } from './index'; // Adjust the import path as needed
import { EditEventForm } from './EditEventForm'; // Adjust the import path as needed
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react';

interface EditEventModalProps {
  event: Event;
  onEventUpdated: () => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ event, onEventUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values: Event) => {
    try {
      await axios.put(`http://localhost:4000/api/events/${event.event_id}`, values, { withCredentials: true });
      onEventUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className='p-0'><Pencil className='h-5 w-5 text-yellow-300' /></button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <EditEventForm event={event} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};