"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  showClearButton?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search lawyers...",
  size = "md",
  showClearButton = true,
  isLoading = false,
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  const handleClear = () => {
    onChange("");
    onSearch?.("");
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-10 text-sm";
      case "lg":
        return "h-14 text-lg";
      default:
        return "h-12";
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`
          relative flex items-center rounded-lg border border-gray-200 bg-white
          shadow-sm transition-all duration-200
          ${
            isFocused
              ? "border-blue-500 ring-2 ring-blue-100"
              : "hover:border-gray-300"
          }
          ${getSizeClasses()}
        `}
      >
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-3 flex items-center">
          <Search
            className={`
              text-gray-400 transition-colors
              ${
                size === "sm"
                  ? "h-4 w-4"
                  : size === "lg"
                    ? "h-6 w-6"
                    : "h-5 w-5"
              }
              ${isFocused ? "text-blue-500" : ""}
            `}
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            flex-1 border-0 bg-transparent text-gray-900 placeholder-gray-500 outline-none
            ${
              size === "sm"
                ? "pr-3 pl-9 text-sm"
                : size === "lg"
                  ? "pr-4 pl-12 text-lg"
                  : "pr-4 pl-10 text-base"
            }
            disabled:cursor-not-allowed disabled:opacity-50
          `}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-3 flex items-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* Clear Button */}
        {!isLoading && showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute right-3 flex items-center justify-center rounded-full
              text-gray-400 transition-colors duration-200
              hover:bg-gray-100 hover:text-gray-600
              ${size === "sm" ? "h-6 w-6" : "h-7 w-7"}
            `}
          >
            <X className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
          </button>
        )}
      </div>
    </form>
  );
}
