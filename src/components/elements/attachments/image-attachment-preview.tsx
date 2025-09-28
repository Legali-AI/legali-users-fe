"use client";

import Image from "next/image";
import { H5 } from "../typography";

export interface ImageAttachmentPreviewProps {
  images: string[];
  maxVisible?: number;
  className?: string;
  imageSize?: number;
  onImageClick?: (image: string, index: number) => void;
  onRemainingClick?: () => void;
}

export function ImageAttachmentPreview({
  images,
  maxVisible = 3,
  className = "",
  imageSize = 78,
  onImageClick,
  onRemainingClick,
}: ImageAttachmentPreviewProps) {
  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleImages.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className="relative flex aspect-square w-fit items-center justify-center rounded-md bg-gray-200"
          style={{ height: `${imageSize}px`, width: `${imageSize}px` }}>
          <Image
            src={image}
            alt={`Attachment`}
            width={imageSize}
            height={imageSize}
            className="h-full w-full rounded-md object-cover"
            onClick={onImageClick ? () => onImageClick(image, index) : undefined}
          />
          {/* Show +remaining overlay on the last visible image */}
          {index === maxVisible - 1 && remainingCount > 0 && (
            <button
              type="button"
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-black/50 backdrop-blur-[3.2px]"
              onClick={onRemainingClick}>
              <H5 level="title" weight="medium" className="text-white">
                {remainingCount}+
              </H5>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
