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
import { ViewNotificationButton } from "./ViewNotificationButton";
import { ToggleReadButton } from "./ToggleReadButton";
import { DeleteNotificationButton } from "./DeleteNotificationButton";

export type Notification = {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  is_read: boolean;
};

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
        `http://localhost:4000/api/notifications?page=${page}`,
        { withCredentials: true },
      );
      const notifications = response.data.notifications;
      const totalPages = response.data.totalPages;

      setNotifications(notifications);
      setTotalPages(totalPages);

      console.log(
        "Fetched notifications:",
        notifications,
        "for page:",
        page,
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const handleDelete = useCallback((notificationId: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.notification_id !== notificationId,
      ),
    );
  }, []);

  const handleToggleRead = useCallback(
    async (updatedNotification: Notification) => {
      try {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notification_id === updatedNotification.notification_id
              ? { ...notification, is_read: !notification.is_read }
              : notification,
          ),
        );
      } catch (error) {
        console.error("Error toggling read status:", error);
      }
    },
    [],
  );

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
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "is_read",
      header: "Leído",
      cell: ({ row }) => <div>{row.getValue("is_read") ? "Yes" : "No"}</div>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="flex space-x-2">
            <ViewNotificationButton
              notificationId={notification.notification_id}
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
            value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
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
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          >
            <ArrowBigRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}