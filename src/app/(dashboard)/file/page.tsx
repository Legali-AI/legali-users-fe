"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { Small } from "../../../components/elements/typography";
import { DeleteConfirmationDialog } from "../../../components/module/forum/delete-confirmation-dialog";
import { Input } from "../../../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  CASE_TYPE_OPTIONS,
  type FileItem,
  getFilesByCaseType,
  SHOW_COUNT_OPTIONS,
} from "../../../data/file.data";
import { createFileTableColumns } from "./file-table-columns";
import { FileViewDialog } from "./file-view-dialog";

export default function FilePage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedCaseType, setSelectedCaseType] = React.useState("all");

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);

  // Filter files based on case type
  const filteredData = React.useMemo(() => {
    return getFilesByCaseType(selectedCaseType);
  }, [selectedCaseType]);

  // Dialog handlers
  const handleViewFile = React.useCallback((file: FileItem) => {
    setSelectedFile(file);
    setShowViewDialog(true);
  }, []);

  const handleEditAccess = React.useCallback((file: FileItem) => {
    console.log("Edit access for file:", file.id);
  }, []);

  const handleDeleteFile = React.useCallback((file: FileItem) => {
    setSelectedFile(file);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    if (selectedFile) {
      console.log("Deleting file:", selectedFile.id);
    }
    setShowDeleteDialog(false);
    setSelectedFile(null);
  }, [selectedFile]);

  const handleViewPDF = React.useCallback(() => {
    console.log("Opening PDF:", selectedFile?.fileName);
  }, [selectedFile]);

  const handleDownloadFile = React.useCallback((file: FileItem) => {
    console.log("Downloading file:", file.id);
  }, []);

  // Create table columns with handlers
  const columns = React.useMemo(
    () =>
      createFileTableColumns({
        onViewFile: handleViewFile,
        onEditAccess: handleEditAccess,
        onDeleteFile: handleDeleteFile,
        onDownloadFile: handleDownloadFile,
      }),
    [handleViewFile, handleEditAccess, handleDeleteFile, handleDownloadFile]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <main className="flex h-full w-full flex-1 flex-col gap-5 overflow-hidden bg-gradient-to-b from-white to-sky-blue-100">
      {/* Filters Row */}
      <div className="flex items-center justify-between">
        {/* Left Filters */}
        <div className="flex items-center gap-[10px]">
          {/* Case Type Filter */}
          <Select value={selectedCaseType} onValueChange={setSelectedCaseType}>
            <SelectTrigger className="border-white-400 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CASE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Filter */}
          <Input
            placeholder="Search files..."
            value={
              (table.getColumn("fileName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("fileName")?.setFilterValue(event.target.value)
            }
            className="border-white-400 bg-white"
          />
        </div>

        {/* Right Filter */}
        <div className="flex items-center gap-[10px]">
          <Small className="text-slate-gray">Show</Small>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="border-white-400 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHOW_COUNT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Small className="text-slate-gray">entries</Small>
        </div>
      </div>

      {/* Files Table */}
      <div className="flex w-full flex-col bg-gradient-to-b from-white to-sky-blue-100">
        <div className="overflow-hidden rounded-[20px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-white-400">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-[64px] border-white-400 bg-white px-5 text-center"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`h-[67px] border-white-400 ${
                      index % 2 === 0 ? "bg-white" : "bg-sky-blue-100"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-5 text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No files found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Only show if there's content */}
        {table.getRowModel().rows?.length > 0 && table.getPageCount() > 1 && (
          <div className="flex items-center justify-center p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from(
                  { length: Math.min(3, table.getPageCount()) },
                  (_, i) => {
                    const pageNum = i + 1;
                    const isActive =
                      pageNum === table.getState().pagination.pageIndex + 1;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            table.setPageIndex(pageNum - 1);
                          }}
                          isActive={isActive}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="This action can't be undone. Delete anyway?"
        confirmText="Confirm"
        cancelText="Cancel"
      />

      <FileViewDialog
        isOpen={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        fileName={selectedFile?.fileName || ""}
        aiSummary={selectedFile?.aiSummary || ""}
        onViewPDF={handleViewPDF}
      />
    </main>
  );
}
