"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUp, MapPin, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import toast from "react-hot-toast";
import Map, { Marker, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import debounce from "lodash.debounce";
import { BACKEND_URL } from "@/config/constants";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoicm9jYXNkZXYiLCJhIjoiY20yNGZpNjMyMGc3aTJrcHZsaHoxdXF0NSJ9.HXBo42kG3TCq171NnIWPhA";

interface SearchResult {
  place_name: string;
  center: [number, number];
}

interface EditEventFormProps {
  id: string;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ id }) => {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 11,
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = React.useRef<MapRef | null>(null);
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/events/${id}`, {
          withCredentials: true,
        });
        setEvent(response.data.event);
        console.log(response.data);
        setImagePreview(response.data.event.banner);
        setViewport({
          latitude: response.data.event.latitude,
          longitude: response.data.event.longitude,
          zoom: 11,
        });
      } catch (error) {
        console.error("Error al obtener el evento:", error);
        toast.error("Error al cargar la información del evento");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/categories`, {
          withCredentials: true,
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error al cargar categorías");
      }
    };

    fetchEvent();
    fetchCategories();
  }, [id]);

  const searchPlaces = debounce(
    async (query: string, setFieldValue: Function) => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query,
          )}.json?access_token=${MAPBOX_TOKEN}&limit=5`,
        );
        const data = await response.json();
        setSearchResults(
          data.features.map((feature: any) => ({
            place_name: feature.place_name,
            center: feature.center,
          })),
        );
      } catch (error) {
        console.error("Error searching places:", error);
        toast.error("Error al buscar lugares");
      } finally {
        setIsSearching(false);
      }
    },
    300,
  );

  const handleSearchSelect = (
    result: SearchResult,
    setFieldValue: Function,
  ) => {
    const [longitude, latitude] = result.center;

    setFieldValue("longitude", longitude.toFixed(6));
    setFieldValue("latitude", latitude.toFixed(6));
    setFieldValue("address", result.place_name);

    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      duration: 2000,
    });

    setSearchResults([]);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("El título es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    date_time: Yup.date().required("La fecha y hora son requeridas"),
    address: Yup.string().required("La dirección es requerida"),
    latitude: Yup.number().required("La latitud es requerida").min(-90).max(90),
    longitude: Yup.number()
      .required("La longitud es requerida")
      .min(-180)
      .max(180),
    category_id: Yup.string().required("La categoría es requerida"),
    status: Yup.string().required("El estado es requerido"),
    max_volunteers: Yup.number().required("El número máximo de voluntarios es requerido"),
  });

  const handleMapClick = (event, setFieldValue) => {
    const { lng, lat } = event.lngLat;
    setFieldValue("longitude", lng.toFixed(6));
    setFieldValue("latitude", lat.toFixed(6));

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features[0]) {
          setFieldValue("address", data.features[0].place_name);
        }
      });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "banner" && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key].toString());
        }
      });

      await toast.promise(
        axios.put(`${BACKEND_URL}/events/${id}`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Actualizando evento",
          success: () => {
            router.push("/admin/events");
            return "Evento actualizado exitosamente";
          },
          error: (error) => {
            console.error("Error al actualizar el evento:", error);
            return "Error al actualizar el evento";
          },
        },
      );
    } catch (error) {
      console.error("Error durante la actualización del evento:", error);
      toast.error("Algo salió mal durante la actualización del evento");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFieldValue("banner", file);
      };

      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!event) {
    return <div>No se pudo cargar la información del evento.</div>;
  }

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
            Editar Evento
          </h2>

          <Formik
            initialValues={{
              title: event.title || "",
              description: event.description || "",
              max_volunteers: event.max_volunteers || 0,
              date_time:
                new Date(event.date_time).toISOString().replace(/Z/g, "") || "",
              address: event.address || "",
              latitude: event.latitude || 0,
              longitude: event.longitude || 0,
              category_id: event.category_id || "",
              status: event.status || "",
              banner: event.banner || null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, setFieldValue, isSubmitting, values }) => (
              <Form>
                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="title">Título del Evento</Label>
                    <Field
                      as={Input}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Título del evento"
                      className={
                        touched.title && errors.title ? "border-red-600" : ""
                      }
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="date_time">Fecha y Hora</Label>
                    <Field
                      as={Input}
                      type="datetime-local"
                      id="date_time"
                      name="date_time"
                      className={
                        touched.date_time && errors.date_time
                          ? "border-red-600"
                          : ""
                      }
                    />
                    <ErrorMessage
                      name="date_time"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5">
                  <div className="w-full">
                    <Label htmlFor="description">Descripción</Label>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Describe el evento..."
                      className="w-full rounded-lg border border-stroke bg-transparent p-4 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                {/* Campo de cupos max */}
                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5">
                  <div className="w-full">
                    <Label htmlFor="max_volunteers">Cupos Máximos</Label>
                    <Field
                      as={Input}
                      id="max_volunteers"
                      name="max_volunteers"
                      placeholder="25"
                      className="w-full rounded-lg border border-stroke bg-transparent p-4 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    />
                    <ErrorMessage
                      name="max_volunteers"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5">
                  <div className="w-full">
                    <Label htmlFor="category_id">Categoría</Label>
                    <Field
                      as="select"
                      id="category_id"
                      name="category_id"
                      className="w-full rounded-lg border border-stroke bg-transparent p-4 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    >
                      <option value={event.category_id} className="text-black">
                        {event.Category.name}
                      </option>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <option
                            key={category.category_id}
                            value={category.category_id}
                            className="text-black"
                          >
                            {category.name}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="category_id"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 w-full lg:mb-12.5">
                  <Label>Ubicación del evento</Label>

                  <div className="relative mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar lugar..."
                        className="pl-10"
                        onChange={(e) => {
                          setIsSearching(true);
                          searchPlaces(e.target.value, setFieldValue);
                        }}
                      />
                    </div>

                    {searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
                        <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                          {searchResults.map((result, index) => (
                            <li
                              key={index}
                              className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() =>
                                handleSearchSelect(result, setFieldValue)
                              }
                            >
                              {result.place_name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="h-[400px] w-full overflow-hidden rounded-lg">
                    <Map
                      ref={mapRef}
                      mapboxAccessToken={MAPBOX_TOKEN}
                      initialViewState={viewport}
                      mapStyle="mapbox://styles/mapbox/streets-v11"
                      onClick={(e) => handleMapClick(e, setFieldValue)}
                    >
                      <Marker
                        longitude={Number(values.longitude)}
                        latitude={Number(values.latitude)}
                      >
                        <div className="animate-bounce">
                          <MapPin className="h-6 w-6 text-red-500" />
                        </div>
                      </Marker>
                    </Map>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="latitude">Latitud</Label>
                      <Field
                        as={Input}
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        className="w-full"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitud</Label>
                      <Field
                        as={Input}
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        className="w-full"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Field
                        as={Input}
                        id="address"
                        name="address"
                        type="text"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-7.5 flex w-full flex-col items-center justify-center gap-2 lg:mb-12.5 lg:gap-4">
                  <Label htmlFor="bannerInput">Banner del Evento</Label>
                  <div
                    className="flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-2"
                    onClick={() =>
                      document.getElementById("bannerInput")?.click()
                    }
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview as string}
                        alt="Vista previa"
                        className="h-full w-full rounded-lg object-cover"
                        width={400}
                        height={200}
                      />
                    ) : (
                      <>
                        <ImageUp className="h-14 w-14" />
                        <p>Sube una imagen para el banner</p>
                      </>
                    )}
                    <input
                      id="bannerInput"
                      name="banner"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      className="hidden"
                    />
                  </div>
                  <ErrorMessage
                    name="banner"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <Link href="/admin/events" className="hover:text-green-600">
                    Volver
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 rounded-full bg-green-800 px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho disabled:opacity-50 dark:bg-green-700 dark:hover:bg-blackho"
                  >
                    {isSubmitting ? "Actualizando..." : "Actualizar Evento"}
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </section>
  );
};

export default EditEventForm;
