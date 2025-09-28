"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Download } from "lucide-react";
import { P } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import type { FileItem } from "../../../data/file.data";

interface FileTableColumnsProps {
  onViewFile: (file: FileItem) => void;
  onEditAccess: (file: FileItem) => void;
  onDeleteFile: (file: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
}

export const createFileTableColumns = ({
  onViewFile,
  onEditAccess,
  onDeleteFile,
  onDownloadFile,
}: FileTableColumnsProps): ColumnDef<FileItem>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 "
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <P level="body" className="text-center">
        {row.getValue("date")}
      </P>
    ),
  },
  {
    accessorKey: "fileName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          File Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <P level="body" className="text-center">
        {row.getValue("fileName")}
      </P>
    ),
  },
  {
    accessorKey: "summary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Summary
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <P level="body" className="text-center">
        {row.getValue("summary")}
      </P>
    ),
  },
  {
    accessorKey: "caseTitle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          weight="semibold"
          className="h-auto p-0 "
        >
          Case
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <P level="body" className="text-center">
        {row.getValue("caseTitle")}
      </P>
    ),
  },
  {
    id: "actions",
    header: () => (
      <P level="body" className="text-center" weight="semibold">
        Actions
      </P>
    ),
    cell: ({ row }) => {
      const file = row.original;

      return (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-brand-gray-50 px-[10px] text-slate-gray-400 hover:bg-white-400"
            onClick={() => onViewFile(file)}
          >
            <P level="body" className="text-slate-gray">
              View
            </P>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-sky-blue-600 px-[10px] text-white"
            onClick={() => onEditAccess(file)}
          >
            <P level="body" className="text-white">
              Edit Access
            </P>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-brand-rose px-[10px] text-white hover:bg-brand-rose"
            onClick={() => onDeleteFile(file)}
          >
            <P level="body" className="text-white">
              Delete
            </P>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownloadFile(file)}
          >
            <Download size={16} className="text-sky-blue-800" />
          </Button>
        </div>
      );
    },
  },
];
