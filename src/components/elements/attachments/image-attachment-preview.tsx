"use client";

import Image from "next/image";
import { useState } from "react";
import { H5 } from "../typography";
import { FileViewerModal } from "./file-viewer-modal";

export interface ImageAttachmentPreviewProps {
  images: string[];
  maxVisible?: number;
  className?: string;
  imageSize?: number;
  onRemainingClick?: () => void;
}

export function ImageAttachmentPreview({
  images,
  maxVisible,
  className = "",
  imageSize = 78,
  onRemainingClick,
}: ImageAttachmentPreviewProps) {
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const getFileNameFromUrl = (url: string) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.split("?")[0];
  };

  const handleImageClick = (imageUrl: string) => {
    const fileName = getFileNameFromUrl(imageUrl);
    setSelectedFileUrl(imageUrl);
    setSelectedFileName(fileName);
    setShowFileModal(true);
  };

  const handleCloseModal = () => {
    setShowFileModal(false);
    setSelectedFileUrl("");
    setSelectedFileName("");
  };

  const handleImageClickWrapper = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    handleImageClick(imageUrl);
  };

  const visibleImages = maxVisible ? images.slice(0, maxVisible) : images;
  const remainingCount = maxVisible ? images.length - maxVisible : 0;

  return (
    <div
      className={`flex min-w-0 items-center gap-2 overflow-hidden ${className}`}
    >
      {visibleImages.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative flex aspect-square w-fit flex-shrink-0 items-center justify-center rounded-md bg-gray-200"
          style={{ height: `${imageSize}px`, width: `${imageSize}px` }}
        >
          <button
            type="button"
            className="h-full w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0"
            onClick={e => handleImageClickWrapper(e, image)}
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-image-click="true"
          >
            <Image
              src={image}
              alt={getFileNameFromUrl(image) || `Attachment ${index + 1}`}
              width={imageSize}
              height={imageSize}
              className="h-full w-full rounded-md object-cover"
            />
          </button>
          {/* Show +remaining overlay on the last visible image */}
          {maxVisible && index === maxVisible - 1 && remainingCount > 0 && (
            <button
              type="button"
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-black/50 backdrop-blur-[3.2px]"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onRemainingClick?.();
              }}
            >
              <H5 level="title" weight="medium" className="text-white">
                {remainingCount}+
              </H5>
            </button>
          )}
        </div>
      ))}

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={showFileModal}
        onClose={handleCloseModal}
        fileUrl={selectedFileUrl}
        fileName={selectedFileName}
      />
    </div>
  );
}
