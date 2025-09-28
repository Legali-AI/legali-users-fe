"use client";

import { Plus, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { P } from "../typography";
import { FileAttachmentItem } from "./file-attachment-item";

export interface FileAttachmentProps {
  value?: File[];
  onChange: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  placeholder?: string;
  onError?: (error: string) => void;
}

const DEFAULT_ACCEPT = "image/*,.pdf,.doc,.docx,.xlsx,.xls";
const DEFAULT_MAX_FILES = 10;
const DEFAULT_MAX_SIZE = 10; // 10MB

export function FileAttachment({
  value = [],
  onChange,
  className,
  disabled = false,
  accept = DEFAULT_ACCEPT,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizePerFile = DEFAULT_MAX_SIZE,
  placeholder = "+ Attachment",
  onError,
}: FileAttachmentProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    onError?.("");

    const oversizedFiles = files.filter(file => file.size > maxSizePerFile * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      onError?.(`Some files exceed the maximum size of ${maxSizePerFile}MB`);
      return;
    }

    const totalFiles = value.length + files.length;
    if (totalFiles > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = [...value, ...files];
    onChange(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-[5px]", className)}>
      {/* Upload Button */}
      <button
        type="button"
        className={cn(
          "flex h-[39px] w-fit cursor-pointer items-center justify-center gap-2 rounded-md border border-white-500 bg-white px-6 transition-colors",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "hover:bg-gray-50"
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-label="Upload files">
        <Plus size={16} />
        <P level="body" className="text-slate-gray-400">
          {placeholder}
        </P>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileUpload}
          className="hidden"
          disabled={disabled}
        />
      </button>

      {/* Attached Files */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-[5px]">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex h-[39px] items-center gap-2 rounded-md border border-white-500 bg-white px-6">
              <FileAttachmentItem filename={file.name} className="h-auto border-none bg-transparent px-0 py-0" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removeFile(index);
                  }
                }}
                className="flex aspect-square h-5 w-auto items-center justify-center rounded transition-colors hover:bg-gray-100"
                disabled={disabled}
                aria-label={`Remove ${file.name}`}>
                <X size={14} className="text-slate-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
