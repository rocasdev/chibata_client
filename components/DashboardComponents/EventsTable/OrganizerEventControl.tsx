"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  Users2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  UserCircle2Icon,
} from "lucide-react";
import Link from "next/link";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoicm9jYXNkZXYiLCJhIjoiY20yNGZpNjMyMGc3aTJrcHZsaHoxdXF0NSJ9.HXBo42kG3TCq171NnIWPhA";

type Event = {
  event_id: number;
  title: string;
  description: string | null;
  slug: string;
  date_time: string;
  address: string;
  latitude: number;
  longitude: number;
  banner: string;
  status: "Programado" | "En Progreso" | "Finalizado" | "Cancelado";
  state: boolean;
  max_volunteers: number;
  current_volunteers: number;
  created_at: string;
  updated_at: string;
  User: {
    firstname: string;
    surname: string;
  };
  Organization: {
    name: string;
  };
};

const OrganizerEventControll = ({ id }: { id: number }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/events/enrolls/${id}?page=${currentPage}&limit=10`,
          {
            withCredentials: true,
          },
        );
        setUsers(response.data.registrations);
        setTotalPages(response.data.total_pages);
        console.log(users);
      } catch (err) {
        setError("Error al cargar el evento");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "volunteer_id",
      header: "id",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("volunteer_id")}</div>
      ),
    },
    {
      accessorKey: "User.avatar",
      header: "avatar",
      cell: ({ row }) => (
        <div className="font-medium">
          <Avatar>
            <AvatarFallback>{row.getValue("User.firstname")}</AvatarFallback>
            <AvatarImage src={`${row.getValue("User.avatar")}`} />
          </Avatar>
        </div>
      ),
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
      header: "Estado de Asistencia",
    },
    {
      id: "actions",
      header: "Ver",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-center space-x-2">
            <Link href={`/admin/users/${user.user_id}`}>
              <UserCircle2Icon className="text-blue-500" />
            </Link>
          </div>
        );
      },
    },
  ];

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
  if (!users) return <div>No se encontró el evento</div>;

  return (
    <section className="bg-gray-50 py-10 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-5 text-2xl font-bold">Usuarios Registrados</h1>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Buscar por correo..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="h-10 w-[150px] rounded-md border !border-white p-2 lg:w-[250px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                    No users found
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
              Page{" "}
              <strong>
                {currentPage} of {totalPages}
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
