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
import { ChevronDown, Download, Eye, FileText } from "lucide-react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { BACKEND_URL } from "@/config/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PreviewCertificate from "./PreviewCertificate";
import { generateCertificate } from "@/lib/CertificateGenerator";
import Image from "next/image";

export type Certificate = {
  certificate_id: string;
  organizationName: string;
  organizationLogo: string;
  volunteerName: string;
  eventName: string;
  issueDate: string;
  downloadUrl: string;
  previewUrl: string;
};

function ViewCertificateButton({ certificate }: { certificate: Certificate }) {
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Detalles del Certificado
            </DialogTitle>
            <hr className="shadow-lg" />
          </DialogHeader>
          <div>
            <p className="mb-4 font-light">
              <strong className="font-bold">Organización:</strong>{" "}
              {certificate.organizationName}
            </p>
            <p className="mb-4 font-light">
              <strong className="font-bold">Evento:</strong>{" "}
              {certificate.eventName}
            </p>
            <p className="mb-4 font-light">
              <strong className="font-bold">Fecha de Expedición:</strong>{" "}
              {new Date(certificate.issueDate).toLocaleDateString()}
            </p>
            <PreviewCertificate certificate={certificate} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreviewButton({ certificate }: { certificate: Certificate }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-green-500 hover:text-green-700"
      >
        <Eye className="h-5 w-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl !max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Vista Previa del Certificado
            </DialogTitle>
          </DialogHeader>
          <PreviewCertificate certificate={certificate} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function CertificatesTable() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const fetchCertificates = useCallback(async (page: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/users/certificates/own?page=${page}&limit=10`,
        { withCredentials: true },
      );
      const data_certificates = response.data.certificates;
      const totalPages = response.data.totalPages;

      const f_certificates: Array<any> = [];

      data_certificates.forEach((certificate) => {
        const addOne = {
          certificate_id: certificate.certificate_id,
          organizationName: certificate.Organization.name,
          organizationLogo: certificate.Organization.logo,
          volunteerName:
            certificate.User.firstname + " " + certificate.User.surname,
          eventName: certificate.Event.title,
          issueDate: certificate.issue_date,
        };
        f_certificates.push(addOne);
      });

      console.log(f_certificates);

      setCertificates(f_certificates);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  }, []);

  useEffect(() => {
    fetchCertificates(currentPage);
  }, [currentPage, fetchCertificates]);

  const handleDownload = useCallback(async (certificate: Certificate) => {
    const certificateData = {
      eventName: certificate.eventName,
      organizationName: certificate.organizationName,
      volunteerName: certificate.volunteerName, // Add this to your Certificate type
      organizationLogo: certificate.organizationLogo, // Add your logo paths
      platformLogo: "/images/logo/logo-light.svg",
      issueDate: certificate.issueDate,
      certificate_id: certificate.certificate_id,
    };

    try {
      await generateCertificate(certificateData);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  }, []);

  const columns: ColumnDef<Certificate>[] = [
    {
      accessorKey: "organizationName",
      header: "Organización",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("organizationName")}</div>
      ),
    },
    {
      accessorKey: "organizationLogo",
      header: "logo",
      cell: ({ row }) => (
        <div className="capitalize">
          <Image
            src={row.getValue("organizationLogo")}
            alt="org_logo"
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      accessorKey: "eventName",
      header: "Evento",
    },
    {
      accessorKey: "issueDate",
      header: "Fecha de Expedición",
      cell: ({ row }) => {
        const date = new Date(row.getValue("issueDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const certificate = row.original;
        return (
          <div className="flex space-x-2">
            <ViewCertificateButton certificate={certificate} />
            <PreviewButton certificate={certificate} />
            <button
              onClick={() => handleDownload(certificate)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: certificates,
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
      <h1 className="mb-5 text-2xl font-bold">Mis Certificados</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Buscar por evento..."
            value={(table.getColumn("event")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("event")?.setFilterValue(event.target.value)
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
                  No hay certificados disponibles
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
