"use client";

import {
  FileArchive,
  FileAudio,
  FileCode,
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Small } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

interface UploadDocumentsProps {
  onSelect: (files: File[]) => void;
  onUpload: () => void;
  files: File[];
  onRemove: (index: number) => void;
  usedMb?: number | null;
  filesCount?: number | null;
  limitGb?: number | null;
  disabled?: boolean;
}

export function UploadDocuments({
  onSelect,
  onUpload,
  files,
  onRemove,
  usedMb,
  disabled,
  filesCount,
  limitGb,
}: UploadDocumentsProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xlsx"] as const;
  const ALLOWED_MIME = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]);

  const fileSchema = z.instanceof(File).refine(
    file => {
      const name = file.name.toLowerCase();
      const hasAllowedExt = ALLOWED_EXTENSIONS.some(ext =>
        name.endsWith(`.${ext}`)
      );
      const hasAllowedMime = file.type ? ALLOWED_MIME.has(file.type) : true; // some browsers omit type for doc(x)
      return hasAllowedExt && hasAllowedMime;
    },
    { message: "Only PDF, DOC, DOCX, and XLSX files are allowed" }
  );
  const filesSchema = z.array(fileSchema);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(e.target.files || []);
    const parsed = filesSchema.safeParse(next);
    if (!parsed.success) {
      toast.error("Only PDF, DOC, DOCX, and XLSX files are allowed");
      const valid = next.filter(f => fileSchema.safeParse(f).success);
      if (valid.length) {
        const remaining = 10 - files.length;
        if (remaining <= 0) {
          toast.error("You can upload at most 10 files at a time");
          return;
        }
        const trimmed = valid.slice(0, remaining);
        if (valid.length > remaining) {
          toast.error("You can upload at most 10 files at a time");
        }
        onSelect(trimmed);
      }
      return;
    }
    if (next.length) {
      const remaining = 10 - files.length;
      if (remaining <= 0) {
        toast.error("You can upload at most 10 files at a time");
        return;
      }
      const trimmed = next.slice(0, remaining);
      if (next.length > remaining) {
        toast.error("You can upload at most 10 files at a time");
      }
      onSelect(trimmed);
    }
  };

  const totalSizeMb = React.useMemo(() => {
    const bytes = files.reduce((acc, f) => acc + f.size, 0);
    return (bytes / (1024 * 1024)).toFixed(2);
  }, [files]);

  const formattedUsed = React.useMemo(() => {
    if (typeof usedMb !== "number") return "-";
    if (usedMb >= 1024) return `${(usedMb / 1024).toFixed(2)} GB`;
    return `${usedMb.toFixed?.(2) ?? usedMb} MB`;
  }, [usedMb]);

  const renderIcon = (file: File) => {
    const name = file.name.toLowerCase();
    const type = file.type;
    const className = "h-4 w-4 text-sky-blue-700";
    if (type.includes("pdf") || name.endsWith(".pdf"))
      return <FileType className={className} />;
    if (type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/.test(name))
      return <FileImage className={className} />;
    if (type.includes("sheet") || /\.(xlsx|xls|csv)$/.test(name))
      return <FileSpreadsheet className={className} />;
    if (type.includes("word") || /\.(docx?|rtf|txt|md)$/.test(name))
      return <FileText className={className} />;
    if (type.includes("zip") || /\.(zip|rar|7z|tar|gz)$/.test(name))
      return <FileArchive className={className} />;
    if (type.startsWith("audio/") || /\.(mp3|wav|m4a|ogg)$/.test(name))
      return <FileAudio className={className} />;
    if (type.startsWith("video/") || /\.(mp4|mov|webm|mkv)$/.test(name))
      return <FileVideo className={className} />;
    if (/\.(js|ts|tsx|json|yml|yaml|xml|html|css|scss)$/.test(name))
      return <FileCode className={className} />;
    return <FileIcon className={className} />;
  };

  return (
    <div className="flex flex-col gap-3 rounded-[10px] border border-white-400 bg-white p-3 lg:p-4">
      {/* Summary + Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-slate-gray flex items-center gap-3">
          <Small>Used: {formattedUsed}</Small>
          <Small>
            • Files: {typeof filesCount === "number" ? filesCount : "-"}
          </Small>
          <Small>
            Limit:{" "}
            {typeof limitGb === "number"
              ? `${limitGb.toFixed?.(2) ?? limitGb} GB`
              : "-"}
          </Small>
        </div>
        <div className="h-0 flex-1 sm:h-auto" />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xlsx"
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          + Add Documents
        </button>
        <button
          type="button"
          onClick={onUpload}
          disabled={files.length === 0 || disabled}
          className={cn(
            "rounded-md px-3 py-2 text-sm",
            files.length === 0
              ? "bg-slate-200 text-slate-500"
              : "bg-deep-navy text-white"
          )}
        >
          Upload
        </button>

        <div className="text-slate-gray ml-auto flex items-center gap-2">
          <Small>{files.length} selected</Small>
          {files.length > 0 && <Small>• {totalSizeMb} MB</Small>}
        </div>
      </div>
      {/* Selected files list */}
      {files.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {files.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="bg-sky-blue-50 flex items-center justify-between rounded border px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                {renderIcon(f)}
                <Small className="truncate">{f.name}</Small>
                <Small className="text-slate-gray">
                  {(f.size / (1024 * 1024)).toFixed(2)} MB
                </Small>
              </div>
              <Button
                size={"xs"}
                level={"caption"}
                variant={"destructive"}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onRemove(idx);
                }}
              >
                remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
