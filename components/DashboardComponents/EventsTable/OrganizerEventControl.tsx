"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "@/config/constants";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ArrowBigLeft,
  ArrowBigRight,
  Flag,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader, CircleOff, ShieldX } from "lucide-react";
import { generateCertificate } from "@/lib/CertificateGenerator";

const OrganizerEventControll = ({ id }: { id: number }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState<Array<any>>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/events/enrolls/${id}?page=${currentPage}&limit=10`,
        {
          withCredentials: true,
        },
      );
      setUsers(response.data.registrations);
      setEvent(response.data.event);
      setTotalPages(response.data.totalPages);
      console.log(users);
      console.log(response.data);
    } catch (err) {
      setError("Error al cargar el evento");
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleStatusChange = async (status: string) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/events/change-status/${id}`,
        { status },
        { withCredentials: true },
      );
      toast.success("Estado de asistencia actualizado con éxito");

      // Refetch the event data after successful update
      await fetchEvent();
    } catch (err: any) {
      console.error("Error al cambiar el estado del evento:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleAttendanceChange = async () => {
    if (!selectedUser || !selectedStatus) return;
    try {
      await axios.patch(
        `${BACKEND_URL}/events/enrolls/${id}/update-attendance/`,
        {
          userId: selectedUser.volunteer_id,
          status: selectedStatus,
        },
        { withCredentials: true },
      );
      toast.success("Estado de asistencia actualizado con éxito");

      // Refetch the event data after successful update
      await fetchEvent();

      setSelectedUser(null);
      setSelectedStatus(null);
    } catch (error) {
      console.error("Error al cambiar el estado de asistencia:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const giveUserCertificate = async (u_id: any) => {
    try {
      await axios.post(
        `${BACKEND_URL}/events/enrolls/${id}/give-certificate/`,
        {
          userId: u_id,
        },
        { withCredentials: true },
      );
      toast.success("Certificado generado exitosamente");

      // Refetch the event data after successful update
      await fetchEvent();
    } catch (error) {
      console.error("Error al cambiar el estado de asistencia:", error);
      toast.error("Error al registrar el certificado");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "volunteer_id",
      header: "id",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("volunteer_id")}</div>
      ),
    },
    {
      accessorFn: (row) => row.User.avatar, // Accede a User.avatar
      header: "Avatar",
      cell: ({ row }) => {
        const avatarUrl = row.original.User.avatar; // Obtiene el valor directamente
        return (
          <Avatar>
            <AvatarFallback>NaN</AvatarFallback>
            <AvatarImage src={avatarUrl} alt="User Avatar" />
          </Avatar>
        );
      },
    },
    {
      accessorKey: "User.firstname",
      header: "Nombre",
    },
    {
      accessorKey: "User.surname",
      header: "Apellido",
    },
    {
      accessorKey: "created_at",
      header: "Registrado en",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "attendance_status",
      header: "Asistencia",
    },
    {
      id: "attendance_status_change",
      header: "Cambiar asistencia",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Cambiar Estado</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col">
              {["Asistio", "No Asistio", "Cancelo", "Registrado"].map(
                (status) => (
                  <Dialog key={status}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedStatus(status);
                        }}
                      >
                        {status}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar cambio</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres marcar al usuario{" "}
                          <strong>
                            {user.User.firstname} {user.User.surname}
                          </strong>{" "}
                          como <strong>{status}</strong>?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(null);
                            setSelectedStatus(null);
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleAttendanceChange}>
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "send_certificate",
      header: "Expedir certificado",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-center space-x-2">
            {user.attendance_status === "Asistio" &&
            event.status === "Finalizado" &&
            user.is_certificated === false ? (
              <Button
                variant={"outline"}
                onClick={() => {
                  giveUserCertificate(user.volunteer_id);
                }}
              >
                Generar Certificado
              </Button>
            ) : (
              <div className="text-gray-500">
                {event.status != "Finalizado" &&
                  "Este evento aun no ha finalizado"}
                {user.attendance_status != "Asistio" && "El usuario no ha sido marcado como asistente"}
                {user.is_certificated === true && "El usuario ya tiene un certificado"}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: 10,
      },
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    table.setPageIndex(currentPage - 1);
  }, [currentPage, table]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No se encontró el evento</div>;

  return (
    <section className="rounded-lg bg-gray-50 px-4 py-4 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-2">
        <h1 className="mb-5 text-2xl font-bold">
          Información General del Evento
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative mb-5 flex h-full flex-col rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-bold">Título: {event.title}</h2>
            <p className="mb-4 text-sm">
              <span className="font-bold">Fecha:</span>{" "}
              {formatDate(event.date_time)}
            </p>
            <p className="line-clamp-2 text-sm">
              <span className="font-bold">Descripción:</span>{" "}
              {event.description}
            </p>
          </div>

          <div className="relative mb-5 flex h-full flex-col rounded-lg border p-4">
            <h2 className="mb-4 text-center text-xl font-bold">Cupos:</h2>
            <p className="flex h-full w-full items-center justify-center">
              <span
                className={`text-6xl font-bold ${event.current_volunteers === event.current_volunteers ? "text-green-600" : "text-red-600"}`}
              >
                {event.current_volunteers}
                {" / "}
                {event.max_volunteers}
              </span>
            </p>
          </div>

          <div className="relative flex h-full flex-col rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-bold">Estado:</h2>
            <p className="text-md mb-4">
              <span className="font-bold">Activo:</span>{" "}
              {event.is_active ? "Sí" : "No"}
            </p>

            <p className="text-md mb-4">
              <span className="font-bold">Progreso: </span> {event.status}
            </p>

            <div className="flex items-center justify-start gap-x-2">
              <TooltipProvider>
                {event.status === "Programado" && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant={"outline"}
                        onClick={() => handleStatusChange("En Progreso")}
                      >
                        <Loader size="small" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Establecer estado: En Progreso</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {event.status === "En Progreso" && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant={"outline"}
                        onClick={() => handleStatusChange("Finalizado")}
                      >
                        <Flag size="small" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Establecer estado: Finalizado</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {event.status === "Finalizado" ||
                  (event.status === "Cancelado" && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant={"outline"}
                          onClick={() => handleStatusChange("Programado")}
                        >
                          <Calendar size="small" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Establecer estado: Programado</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                {event.status != "Finalizado" &&
                  event.status != "Cancelado" && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant={"outline"}
                          onClick={() => handleStatusChange("Cancelado")}
                        >
                          <CircleOff size="small" className="text-red-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Establecer estado: Cancelado</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-5 text-2xl font-bold">Voluntarios Inscritos</h1>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Buscar por nombre..."
              value={
                (table.getColumn("volunteer_id")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("volunteer_id")
                  ?.setFilterValue(event.target.value)
              }
              className="h-10 w-[150px] rounded-md border !border-white p-2 lg:w-[250px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow className="w-full text-center text-xl">
                  Cargando...
                </TableRow>
              ) : error ? (
                <TableRow className="w-full text-center text-xl text-red-600">
                  Error al cargar los usuarios
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="text-center"
                  >
                    No se encontraron voluntarios inscritos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between border-t p-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <ArrowBigLeft className="h-5 w-5" />
            </Button>

            <div>
              Página{" "}
              <strong>
                {currentPage} de {totalPages}
              </strong>
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              <ArrowBigRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizerEventControll;
