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
import {
  ChevronDown,
  ArrowBigLeft,
  ArrowBigRight,
  FileText,
  Pencil,
} from "lucide-react";
import AddEventModal from "./AddEventModal";
import { ViewEventButton } from "./ViewEventButton";
import { ToggleEventStatusButton } from "./ToggleEventStatusButton";
import { EditEventModal } from "./EditEventModal";

export type Event = {
  event_id: number;
  title: string;
  description: string | null;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "canceled";
  state: boolean;
  created_at: string;
  updated_at: string;
  organizer: string;
  organization: string;
};

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const fetchEvents = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/events?page=${page}`,
        { withCredentials: true },
      );
      const events = response.data.events;
      const totalPages = response.data.totalPages;

      setEvents(events);
      setTotalPages(totalPages);

      console.log("Fetched events:", events, "for page:", page);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  const handleEventAdded = useCallback(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  const handleEventUpdated = useCallback(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "time",
      header: "Hora",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "organizer",
      header: "Organizador",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("organizer")}</div>
      ),
    },
    {
      accessorKey: "organization",
      header: "Organización",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("organization")}</div>
      ),
    },
    {
      accessorKey: "state",
      header: "Activo",
      cell: ({ row }) => <div>{row.getValue("state") ? "Sí" : "No"}</div>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex space-x-2">
            <ViewEventButton eventId={event.event_id} />
            <ToggleEventStatusButton 
              event={event}
              onToggle={handleEventUpdated}
            />
            <EditEventModal 
              event={event}
              onEventUpdated={handleEventUpdated}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: events,
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
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Eventos Registrados</h1>
        <AddEventModal onEventAdded={handleEventAdded} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Buscar Título..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
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
                  No hay eventos registrados
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