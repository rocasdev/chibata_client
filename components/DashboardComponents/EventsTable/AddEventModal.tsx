import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Event = {
  event_id: number;
  title: string;
  description: string | null;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "canceled";
  state: boolean;
};

interface AddEventModalProps {
  onEventAdded: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string(),
  date: Yup.date().required("La fecha es requerida"),
  time: Yup.string().required("La hora es requerida"),
  status: Yup.string()
    .oneOf(["scheduled", "in-progress", "completed", "canceled"])
    .required("El estado es requerido"),
  state: Yup.boolean().required("El estado activo/inactivo es requerido"),
  organizer_id: Yup.number().nullable(),
  organization_id: Yup.number().nullable(),
});

const AddEventModal: React.FC<AddEventModalProps> = ({ onEventAdded }) => {
  const initialValues: Partial<Event> = {
    title: "",
    description: "",
    date: "",
    time: "",
    status: "scheduled",
    state: true,
  };

  const handleSubmit = async (
    values: Partial<Event>,
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      await axios.post("http://localhost:4000/api/events", values, {
        withCredentials: true,
      });
      onEventAdded(); // Actualizar la tabla de eventos
      resetForm();
      // Aquí puedes agregar lógica para cerrar el modal si es necesario
    } catch (error) {
      console.error("Error al añadir el evento:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-neutral-200 text-btndark hover:text-white dark:bg-gray-900 dark:text-white dark:hover:text-black">
          Añadir Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Evento</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título
                </label>
                <Field
                  name="title"
                  as={Input}
                  className="!border-b border-b-neutral-600 dark:border-b-neutral-400"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <Field
                  name="description"
                  as={Textarea}
                  className="!rounded-none border-x-0 !border-b border-t-0 border-b-neutral-600 !bg-transparent dark:border-b-neutral-400"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha
                </label>
                <Field name="date" type="date" as={Input} />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hora
                </label>
                <Field name="time" type="time" as={Input} />
                <ErrorMessage
                  name="time"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>
                <Field name="status" as={Select}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Selecciona un estado</SelectLabel>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Finalizado</SelectItem>
                      <SelectItem value="canceled">Cancelado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div className="flex">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mr-5"
                >
                  Activo
                </label>
                <Field name="state" type="checkbox" />
                <ErrorMessage
                  name="state"
                  component="div"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Puedes agregar campos adicionales para organizer_id, localization_id y organization_id si es necesario */}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Añadiendo..." : "Añadir Evento"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
