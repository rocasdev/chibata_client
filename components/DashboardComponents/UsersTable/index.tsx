"use client";

import { useState, useEffect, useCallback } from "react";
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
  Table,
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
  UserCircle2Icon,
} from "lucide-react";
import Link from "next/link";

export type User = {
  user_id: string;
  firstname: string;
  surname: string;
  email: string;
  created_at: string;
  updated_at: string;
  Role: {
    name: string;
    path: string;
  };
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const fetchUsers = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users?page=${page}&limit=10`,
        { withCredentials: true },
      );
      const users = response.data.users;
      const totalPages = response.data.totalPages;

      setUsers(users);
      setTotalPages(totalPages);

      console.log("Fetched users:", users, "for page:", page);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user_id",
      header: "id",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("user_id")}</div>
      ),
    },
    {
      accessorKey: "firstname",
      header: "Nombre",
    },
    {
      accessorKey: "surname",
      header: "Apellido",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "Role.name",
      header: "Rol",
    },
    {
      accessorKey: "created_at",
      header: "Creado en",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <Link href={`/admin/users/${user.user_id}`}>
              <UserCircle2Icon className="text-blue-500" />
            </Link>
          </div>
        );
      },
    },
  ];

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

  useEffect(() => {
    table.setPageIndex(currentPage - 1);
  }, [currentPage, table]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Usuarios Registrados</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Buscar por correo..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
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
  );
}
