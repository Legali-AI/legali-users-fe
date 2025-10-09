"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Pencil, UserIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";

interface ProfileUploadProps {
  value?: File | string | null;
  defaultValue?: File | string | null;
  onChange: (value: File | string | null) => void;
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
  defaultValue,
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
    } else if (defaultValue instanceof File) {
      const url = URL.createObjectURL(defaultValue);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreview(value);
    } else if (typeof defaultValue === "string") {
      setPreview(defaultValue);
    } else {
      setPreview(null);
    }
    return undefined;
  }, [value, defaultValue]);

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
          "relative flex aspect-square h-[110px] w-auto cursor-pointer items-center justify-center rounded-full transition-all hover:brightness-90 md:h-[130px] lg:h-[153px]",
          profileUploadVariants({ variant }),
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={handleClick}
        aria-label="Upload profile image"
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={e => {
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
            className={cn(
              "size-16 md:size-20",
              profileUploadVariants({ textVariant: variant })
            )}
          />
        )}

        {/* Edit Button */}
        <Button
          type="button"
          size="icon"
          variant="gradient-blue"
          className="absolute right-0 bottom-0 h-10 w-10 rounded-full p-0"
          onClick={e => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={disabled}
        >
          <Pencil size={20} />
        </Button>

        {/* Remove Button */}
        {/* {preview && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-0 left-0 h-6 w-6 rounded-full p-0"
            onClick={e => {
              e.stopPropagation();
              handleRemove();
            }}
            disabled={disabled}
          >
            <X size={12} />
          </Button>
        )} */}
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
