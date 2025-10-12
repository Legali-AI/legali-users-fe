"use client";

import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  id: string;
}

interface FileUploadProgressProps {
  files: UploadingFile[];
  onRemoveFile?: (fileId: string) => void;
}

export function FileUploadProgress({ files, onRemoveFile }: FileUploadProgressProps) {
  const [displayFiles, setDisplayFiles] = useState<UploadingFile[]>(files);

  useEffect(() => {
    setDisplayFiles(files);
  }, [files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="size-6 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="size-6 text-blue-500" />;
      case "txt":
        return <FileText className="size-6 text-gray-500" />;
      default:
        return <FileText className="size-6 text-gray-500" />;
    }
  };

  if (displayFiles.length === 0) return null;

  return (
    <div className="space-y-3">
      {displayFiles.map(uploadFile => (
        <div
          key={uploadFile.id}
          className="relative overflow-hidden rounded-2xl border border-sky-blue-200 bg-white p-4 shadow-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-sky-blue-100">
                {uploadFile.status === "completed" ? (
                  <CheckCircle className="size-6 text-green-500" />
                ) : (
                  <Upload className="size-6 text-sky-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-slate-gray-800">
                  {uploadFile.status === "uploading" && "Uploading Document"}
                  {uploadFile.status === "completed" && "Upload complete"}
                  {uploadFile.status === "error" && "Upload failed"}
                </h4>
                <p className="text-sm text-slate-gray-500">
                  {uploadFile.status === "uploading" && "Uploading..."}
                  {uploadFile.status === "completed" && "✓ Uploaded"}
                  {uploadFile.status === "error" && "Please try again"}
                </p>
              </div>
            </div>

            {onRemoveFile && (
              <button
                type="button"
                onClick={() => onRemoveFile(uploadFile.id)}
                className="text-slate-gray-400 transition-colors hover:text-slate-gray-600">
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* File Info */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-lg border-2",
                uploadFile.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : "bg-sky-blue-50 border-sky-blue-200"
              )}>
              {uploadFile.status === "completed" ? (
                <CheckCircle className="size-6 text-green-500" />
              ) : (
                getFileIcon(uploadFile.file.name)
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-gray-800">{uploadFile.file.name}</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    uploadFile.status === "completed" ? "text-green-600" : "text-sky-blue-600"
                  )}>
                  {uploadFile.status === "completed" && "✓ Uploaded"}
                  {uploadFile.status === "uploading" && `${uploadFile.progress}%`}
                  {uploadFile.status === "error" && "Failed"}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-sm text-slate-gray-500">
                <span>{formatFileSize(uploadFile.file.size)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out",
                uploadFile.status === "completed"
                  ? "bg-green-500"
                  : uploadFile.status === "error"
                    ? "bg-red-500"
                    : "bg-sky-blue-500"
              )}
              style={{
                width: `${uploadFile.status === "completed" ? 100 : uploadFile.progress}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to create uploading file objects
export function createUploadingFile(file: File): UploadingFile {
  return {
    file,
    progress: 0,
    status: "uploading",
    id: `${file.name}-${Date.now()}-${Math.random()}`,
  };
}

// Helper function to simulate file upload progress
export function simulateFileUpload(
  uploadFile: UploadingFile,
  onProgress: (updatedFile: UploadingFile) => void,
  onComplete: (fileId: string) => void
) {
  let progress = 0;
  const interval = setInterval(
    () => {
      progress += Math.random() * 15 + 5; // Increment by 5-20%

      if (progress >= 100) {
        progress = 100;
        const completedFile = {
          ...uploadFile,
          progress: 100,
          status: "completed" as const,
        };
        onProgress(completedFile);
        onComplete(uploadFile.id);
        clearInterval(interval);
      } else {
        const updatedFile = {
          ...uploadFile,
          progress: Math.round(progress),
        };
        onProgress(updatedFile);
      }
    },
    200 + Math.random() * 300
  ); // Random interval between 200-500ms

  return () => clearInterval(interval);
}
