"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

export type Notification = {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Eye, EyeOff, Trash } from "lucide-react";

function ViewNotificationButton({
  notification,
}: {
  notification: Notification;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-500 hover:text-blue-700"
      >
        <FileText className="h-5 w-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalles de la Notificación</DialogTitle>
            <hr className="shadow-lg"/>
          </DialogHeader>
          <div>
            <p className="mb-4 font-light">
              <strong className="font-bold">Título:</strong> {notification.title}
            </p>
            <p className="mb-4 font-light">
              <strong className="font-bold">Mensaje:</strong> {notification.message}
            </p>
            <p className="mb-4 font-light">
              <strong className="font-bold">Fecha:</strong>{" "}
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ToggleReadButton({
  notification,
  onToggle,
}: {
  notification: Notification;
  onToggle: (notification: Notification) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    onToggle(notification);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-green-500 hover:text-green-700"
      >
        {notification.is_read ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambio de estado</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro que deseas marcar esta notificación como{" "}
            {notification.is_read ? "no leída" : "leída"}?
          </p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleToggle}>
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

function DeleteNotificationButton({
  notificationId,
  onDelete,
}: {
  notificationId: number;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(notificationId);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash className="h-5 w-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Notificación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro que deseas eliminar esta notificación?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
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

export default function NotificationsTable() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const fetchNotifications = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/notifications/own?page=${page}&limit=10`,
        { withCredentials: true },
      );
      const notifications = response.data.notifications;
      const totalPages = response.data.totalPages;

      setNotifications(notifications);
      setTotalPages(totalPages);

      console.log("Fetched notifications:", notifications, "for page:", page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  const handleDelete = useCallback(
    async (notificationId: number) => {
      try {
        await axios.delete(
          `http://localhost:4000/api/notifications/${notificationId}`,
          { withCredentials: true },
        );
        await fetchNotifications(currentPage);
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    },
    [currentPage, fetchNotifications],
  );

  const handleToggleRead = useCallback(
    async (updatedNotification: Notification) => {
      try {
        // Actualizar en el servidor
        await axios.patch(
          `http://localhost:4000/api/notifications/${updatedNotification.notification_id}`,
          null,
          { withCredentials: true },
        );
        await fetchNotifications(currentPage);
      } catch (error) {
        console.error("Error toggling read status:", error);
      }
    },
    [currentPage, fetchNotifications],
  );

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "title",
      header: "Titulo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "message",
      header: "Mensaje",
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "is_read",
      header: "Leído",
      cell: ({ row }) => <div>{row.getValue("is_read") ? "Sí" : "No"}</div>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="flex space-x-2">
            <ViewNotificationButton
              notification={notification}
            />
            <ToggleReadButton
              notification={notification}
              onToggle={handleToggleRead}
            />
            <DeleteNotificationButton
              notificationId={notification.notification_id}
              onDelete={handleDelete}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: notifications,
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

  useEffect(() => {
    table.setPageIndex(currentPage - 1);
  }, [currentPage, table]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Notificaciones</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Buscar Mensaje..."
            value={
              (table.getColumn("message")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("message")?.setFilterValue(event.target.value)
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
        <UITable>
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
            {table.getRowModel().rows.length ? (
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
                  No hay notificaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>

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
  );
}
