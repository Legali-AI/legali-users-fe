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
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DeleteConfirmationDialog } from "../../../components/elements/delete-confirmation-dialog";
import { Small } from "../../../components/elements/typography";
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
  SHOW_COUNT_OPTIONS,
} from "../../../data/file.data";
import {
  useFileMutation,
  useFilesQuery,
  useStorageInfoQuery,
} from "../../../hooks/use-file";
import { cn } from "../../../lib/utils";
import type {
  DeleteDocumentApiUserDocumentsDocumentIdDeleteData,
  UploadDocumentsApiUserDocumentsUploadsPostData,
} from "../../../sdk/out";
import { createFileTableColumns } from "./file-table-columns";
import { FileViewDialog } from "./file-view-dialog";
import { UploadDocuments } from "./UploadDocuments";

const ITEMS_PER_PAGE = 8;

export default function FilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedCaseType, setSelectedCaseType] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  const [documents, setDocuments] = React.useState<FileItem[]>([]);
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);

  // Storage/subscription info
  const { data: storageInfo, isLoading: isStorageInfoLoading } =
    useStorageInfoQuery();

  // Fetch documents from API
  const currentPage = React.useMemo(
    () => Math.max(1, parseInt(searchParams.get("page") || "1", 10)),
    [searchParams]
  );
  const { data: filesResponse, isLoading: isFilesLoading } = useFilesQuery({
    search: debouncedSearch || null,
    limit: ITEMS_PER_PAGE,
    current_page: currentPage,
  });
  const { uploadWithToast, isUploading } = useFileMutation();

  const isLoading = isStorageInfoLoading || isFilesLoading;

  React.useEffect(() => {
    const docs = (filesResponse?.data || []).map(doc => ({
      id: doc.document_id,
      fileName: doc.file_name,
      summary: doc.ai_summary || "-",
      caseTitle: "-",
      date: new Date(doc.uploaded_at).toLocaleDateString("en-CA"),
      fileSize: doc.file_size
        ? `${(doc.file_size / (1024 * 1024)).toFixed(2)} MB`
        : undefined,
      fileType: doc.mime_type || undefined,
      aiSummary: doc.ai_summary || undefined,
    })) as FileItem[];
    setDocuments(docs);
  }, [filesResponse]);

  // Debounce search input to limit requests
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // Upload handlers
  const handleAddUploadFiles = (files: File[]) => {
    setUploadFiles(prev => [...prev, ...files]);
  };

  const handleRemoveUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadDocuments = async () => {
    if (uploadFiles.length === 0) return;
    await uploadWithToast(
      {
        body: { files: uploadFiles, metadata: null },
      } as UploadDocumentsApiUserDocumentsUploadsPostData,
      () => setUploadFiles([])
    );
  };

  // Dialog handlers
  const handleViewFile = React.useCallback((file: FileItem) => {
    setSelectedFile(file);
    setShowViewDialog(true);
  }, []);

  const handleEditAccess = React.useCallback((file: FileItem) => {
    console.log("Edit access for file:", file.id);
  }, []);

  const { deleteWithToast, downloadWithToast } = useFileMutation();

  const handleDeleteFile = React.useCallback((file: FileItem) => {
    setSelectedFile(file);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (selectedFile) {
      await deleteWithToast({
        path: { document_id: selectedFile.id },
      } as DeleteDocumentApiUserDocumentsDocumentIdDeleteData);
    }
    setShowDeleteDialog(false);
    setSelectedFile(null);
  }, [selectedFile, deleteWithToast]);

  const handleDownloadFile = React.useCallback(
    (file: FileItem) => {
      void downloadWithToast({ documentId: file.id, fileName: file.fileName });
    },
    [downloadWithToast]
  );

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
    data: documents,
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
        pageSize: ITEMS_PER_PAGE,
      },
    },
  });

  return (
    <main className="flex h-full w-full flex-1 flex-col gap-4 overflow-hidden bg-gradient-to-b from-white to-sky-blue-100 lg:gap-5">
      {/* Upload & Summary */}
      <UploadDocuments
        onSelect={handleAddUploadFiles}
        onUpload={handleUploadDocuments}
        files={uploadFiles}
        disabled={isUploading || isLoading}
        onRemove={handleRemoveUploadFile}
        usedMb={storageInfo?.total_size_mb ?? null}
        filesCount={storageInfo?.total_files ?? null}
        limitGb={storageInfo?.current_limit_storage_gb ?? null}
      />
      {/* Filters Row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-[10px]">
          {/* Case Type Filter */}
          <Select value={selectedCaseType} onValueChange={setSelectedCaseType}>
            <SelectTrigger className="w-full border-white-400 bg-white sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CASE_TYPE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Filter */}
          <Input
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-white-400 bg-white sm:w-auto"
          />
        </div>

        {/* Right Filter */}
        <div className="flex items-center gap-[10px]">
          <Small className="text-slate-gray">Show</Small>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20 border-white-400 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHOW_COUNT_OPTIONS.map(option => (
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
      <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-white to-sky-blue-100">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="h-full overflow-x-auto overflow-y-auto rounded-[20px]">
            <Table className="min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="border-white-400">
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead
                          key={header.id}
                          className="h-[56px] border-white-400 bg-white px-3 text-center whitespace-nowrap md:h-[60px] lg:px-5 xl:h-[64px]"
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading documents...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "h-[60px] border-white-400 md:h-[64px] xl:h-[67px]",
                        index % 2 === 0 ? "bg-white" : "bg-sky-blue-100"
                      )}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className="px-3 text-center whitespace-nowrap lg:px-5"
                        >
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
        </div>

        {/* Server Pagination */}
        {documents.length > 0 && (
          <div className="flex flex-shrink-0 items-center justify-center p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      const prev = Math.max(1, currentPage - 1);
                      if (prev === currentPage) return;
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.set("page", prev.toString());
                      router.push(`/file?${params.toString()}`);
                    }}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {(() => {
                  const meta = (
                    filesResponse as unknown as {
                      meta?: { total_page?: number };
                    } | null
                  )?.meta;
                  const totalPages = meta?.total_page ?? 1;
                  return Array.from(
                    { length: totalPages },
                    (_, i) => i + 1
                  ).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          params.set("page", page.toString());
                          router.push(`/file?${params.toString()}`);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ));
                })()}

                <PaginationItem>
                  {(() => {
                    const meta = (
                      filesResponse as unknown as {
                        meta?: { total_page?: number };
                      } | null
                    )?.meta;
                    const totalPages = meta?.total_page ?? 1;
                    return (
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          const next = Math.min(totalPages, currentPage + 1);
                          if (next === currentPage) return;
                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          params.set("page", next.toString());
                          router.push(`/file?${params.toString()}`);
                        }}
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    );
                  })()}
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
        aiSummary={selectedFile?.aiSummary || null}
      />
    </main>
  );
}
