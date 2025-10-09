"use client";

import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { P } from "../typography";

export interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string | undefined;
  fileName?: string | undefined;
}

export function FileViewerModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}: FileViewerModalProps) {
  const [fileType, setFileType] = useState<string>("");
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (fileName) {
      const parts = fileName.split(".");
      const lastPart = parts[parts.length - 1]?.toLowerCase() || "";
      const extension = lastPart.split("_")[0];
      setFileType(extension || "");
      setIsImage(
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
      );
      setIsPdf(extension === "pdf");
    }
  }, [fileName]);

  const handleOpenInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const getFileIcon = () => {
    if (isImage) return <ImageIcon size={24} className="text-blue-500" />;
    if (isPdf) return <FileText size={24} className="text-red-500" />;
    return <FileText size={24} className="text-gray-500" />;
  };

  const renderFileContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText size={48} className="mb-4 text-gray-400" />
          <P level="body" className="mb-2 text-gray-600">
            Unable to preview this file
          </P>
          <P level="body" className="text-sm text-gray-500">
            {fileName}
          </P>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleOpenInNewTab} variant="outline">
              <ExternalLink size={16} className="mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    if (isImage && fileUrl) {
      return (
        <div className="flex flex-col items-center">
          <div className="relative max-h-[70vh] max-w-full">
            <Image
              src={fileUrl}
              alt={fileName || "File preview"}
              width={800}
              height={600}
              className="max-h-[70vh] max-w-full rounded-lg object-contain"
              onError={() => setError(true)}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleOpenInNewTab} variant="outline">
              <ExternalLink size={16} className="mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    if (isPdf && fileUrl) {
      return (
        <div className="flex flex-col items-center">
          <div className="relative h-[70vh] w-full rounded-lg border">
            <iframe
              src={fileUrl}
              title={fileName || "PDF Preview"}
              className="h-full w-full rounded-lg"
              onError={() => setError(true)}
              onLoad={e => {
                const iframe = e.target as HTMLIFrameElement;
                try {
                  if (iframe.contentDocument === null) {
                    setError(true);
                  }
                } catch {
                  setError(true);
                }
              }}
            />
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-gray-50">
                <FileText size={48} className="mb-4 text-gray-400" />
                <P level="body" className="mb-2 text-gray-600">
                  PDF preview not available
                </P>
                <P level="body" className="mb-4 text-sm text-gray-500">
                  {fileName}
                </P>
                <div className="flex gap-2">
                  <Button onClick={handleOpenInNewTab} variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleOpenInNewTab} variant="outline">
              <ExternalLink size={16} className="mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {getFileIcon()}
        <P level="body" className="mt-4 mb-2 text-gray-600">
          {fileName}
        </P>
        <P level="body" className="mb-4 text-sm text-gray-500">
          {fileType.toUpperCase()} File
        </P>
        <div className="flex gap-2">
          <Button onClick={handleOpenInNewTab} variant="outline">
            <ExternalLink size={16} className="mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon()}
            <span className="truncate">{fileName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-80px)] overflow-auto">
          {renderFileContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
