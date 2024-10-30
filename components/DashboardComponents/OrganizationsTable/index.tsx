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
  Eye,
} from "lucide-react";
import Link from "next/link";

export interface OrganizationAttributes {
  organization_id: Buffer;
  name: string;
  nit: string;
  logo?: string;
  relative_logo_url?: string;
  address: string;
  founding_date: string;
  contact_number: number;
  is_active: boolean;
  website?: string;
}

export default function OrganizationsTable() {
  const [organizations, setOrganizations] = useState<OrganizationAttributes[]>(
    [],
  );
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const fetchOrganizations = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `https://chibataserver-production.up.railway.app//api/organizations?page=${page}`,
        { withCredentials: true },
      );
      const organizations = response.data.organizations;
      const totalPages = response.data.totalPages;

      setOrganizations(organizations);
      setTotalPages(totalPages);

      console.log("Fetched organizations:", organizations, "for page:", page);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations(currentPage);
  }, [currentPage, fetchOrganizations]);

  const handleOrganizationUpdated = useCallback(() => {
    fetchOrganizations(currentPage);
  }, [currentPage, fetchOrganizations]);

  const columns: ColumnDef<OrganizationAttributes>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "nit",
      header: "NIT",
    },
    {
      accessorKey: "founding_date",
      header: "Fecha de Fundación",
      cell: ({ row }) => {
        const date = new Date(row.getValue("founding_date"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "address",
      header: "Dirección",
    },
    {
      accessorKey: "contact_number",
      header: "Contacto",
    },
    {
      accessorKey: "is_active",
      header: "Activo",
      cell: ({ row }) => <div>{row.getValue("is_active") ? "Sí" : "No"}</div>,
    },
    {
      accessorKey: "website",
      header: "Sitio Web",
      cell: ({ row }) =>
        row.getValue("website") ? (
          <a
            href={row.getValue("website")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {row.getValue("website")}
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <div className="flex space-x-2 justify-center">
            <Link
              href={`/admin/organizations/${organization.organization_id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              <Eye className="h-5 w-5 " />
            </Link>
            {/* Add more action buttons if needed */}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: organizations,
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
        <h1 className="text-2xl font-bold">Organizaciones Registradas</h1>
        <Link
          href={"/admin/organizations/create"}
          className="rounded-lg bg-gray-900 p-3 text-white"
        >
          Crear Organización
        </Link>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Buscar Nombre..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
                  No hay organizaciones registradas
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
