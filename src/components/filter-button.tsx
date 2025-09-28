"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterButtonProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FilterButton({
  title,
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  multiple = true,
  clearable = true,
  disabled = false,
  className = "",
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: string) => {
    if (multiple) {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter(v => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }

    return `${selectedValues.length} selected`;
  };

  const hasSelection = selectedValues.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative flex w-full items-center justify-between rounded-lg border
          border-gray-200 bg-white px-4 py-2 text-left
          shadow-sm transition-all duration-200
          ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-gray-300 hover:shadow-md"}
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : ""}
          ${hasSelection ? "border-blue-200 bg-blue-50" : ""}
        `}>
        <div className="flex min-w-0 flex-1 items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">{title}:</span>
          <span
            className={`
              truncate text-sm
              ${hasSelection ? "font-medium text-blue-700" : "text-gray-500"}
            `}>
            {getDisplayText()}
          </span>
        </div>

        <div className="ml-2 flex items-center">
          {clearable && hasSelection && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-1 rounded-full p-1 transition-colors hover:bg-gray-200">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={`
              h-4 w-4 text-gray-400 transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            ) : (
              options.map(option => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      flex w-full items-center justify-between px-4 py-2
                      text-left text-sm transition-colors hover:bg-gray-50
                      ${isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"}
                    `}>
                    <span className="flex items-center">
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      )}
                      {option.label}
                    </span>
                    {option.count !== undefined && <span className="text-xs text-gray-500">({option.count})</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-5 cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={e => {
            if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          aria-label="Close dropdown"
        />
      )}
    </div>
  );
}
