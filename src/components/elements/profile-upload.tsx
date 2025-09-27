"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Pencil, UserIcon, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ProfileUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  variant?: VariantProps<typeof profileUploadVariants>["variant"];
}

const profileUploadVariants = cva("", {
  variants: {
    variant: { blue: "bg-[#BADEEB]", gray: "bg-[#CACBD1]" },
    textVariant: {
      blue: "text-white",
      gray: "text-brand-gray-50",
    },
  },
});

export function ProfileUpload({
  value,
  onChange,
  className,
  disabled = false,
  accept = "image/*",
  variant = "blue",
  maxSize = 5,
}: ProfileUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreview(value);
    } else {
      setPreview(null);
    }
    return undefined;
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* biome-ignore lint: Need div to avoid nested buttons */}
      <div
        className={cn(
          "relative flex aspect-square h-[153px] w-[153px] cursor-pointer items-center justify-center rounded-full transition-all hover:brightness-90",
          profileUploadVariants({ variant }),
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={handleClick}
        aria-label="Upload profile image"
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile preview"
            width={153}
            height={153}
            className="h-full w-full overflow-hidden rounded-full object-cover"
          />
        ) : (
          <UserIcon
            size={80}
            className={profileUploadVariants({ textVariant: variant })}
          />
        )}

        {/* Edit Button */}
        <Button
          type="button"
          size="icon"
          variant="gradient-blue"
          className="absolute right-0 bottom-0 h-10 w-10 rounded-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={disabled}
        >
          <Pencil size={20} />
        </Button>

        {/* Remove Button */}
        {preview && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-0 left-0 h-6 w-6 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            disabled={disabled}
          >
            <X size={12} />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
