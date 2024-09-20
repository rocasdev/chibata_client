import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Event } from "./index"; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

interface EditEventFormProps {
  event: Event;
  onSubmit: (values: Event) => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("El título es requerido"),
  description: Yup.string(),
  date: Yup.date().required("La fecha es requerida"),
  time: Yup.string().required("La hora es requerida"),
  status: Yup.string()
    .oneOf(["scheduled", "in-progress", "completed", "canceled"])
    .required("El estado es requerido"),
});

export const EditEventForm: React.FC<EditEventFormProps> = ({
  event,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={event}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
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
              className={errors.title && touched.title ? "border-red-500" : ""}
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-sm text-red-500"
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
              className={
                errors.description && touched.description
                  ? "border-red-500"
                  : ""
              }
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha
            </label>
            <Field
              name="date"
              type="date"
              as={Input}
              className={errors.date && touched.date ? "border-red-500" : ""}
            />
            <ErrorMessage
              name="date"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Hora
            </label>
            <Field
              name="time"
              type="time"
              as={Input}
              className={errors.time && touched.time ? "border-red-500" : ""}
            />
            <ErrorMessage
              name="time"
              component="div"
              className="text-sm text-red-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <Field name="status" id="status">
              {({ field, form }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    form.setFieldValue(field.name, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un Estado" />
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
                </Select>
              )}
            </Field>
          </div>

          <Button type="submit" className="w-full">
            Guardar Cambios
          </Button>
        </Form>
      )}
    </Formik>
  );
};
