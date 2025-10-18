"use client";

import { Input } from "@/components/ui/input";

interface PriceRange {
  min: number;
  max: number;
}

interface PriceRangeFilterProps {
  value: PriceRange;
  onChange: (range: PriceRange) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  currency?: string;
  className?: string;
}

export function PriceRangeFilter({
  value,
  onChange,
  minPlaceholder = "Min price",
  maxPlaceholder = "Max price",
  currency = "$",
  className = "",
}: PriceRangeFilterProps) {
  const handleMinChange = (min: number) => {
    onChange({ ...value, min });
  };

  const handleMaxChange = (max: number) => {
    onChange({ ...value, max });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm font-medium text-gray-500">{currency}</div>
            <Input
              type="number"
              placeholder={minPlaceholder}
              value={value.min || ""}
              onChange={e => handleMinChange(Number(e.target.value) || 0)}
              className="pl-8 h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm font-medium text-gray-500">{currency}</div>
            <Input
              type="number"
              placeholder={maxPlaceholder}
              value={value.max || ""}
              onChange={e => handleMaxChange(Number(e.target.value) || 0)}
              className="pl-8 h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
          </div>
        </div>

        {/* Price Range Display */}
        {(value.min > 0 || value.max > 0) && (
          <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 rounded-lg py-2 px-3">
            {currency}
            {value.min || 0} - {currency}
            {value.max || "∞"}
          </div>
        )}

        {/* Quick Price Ranges */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "< $100", min: 0, max: 100 },
            { label: "$100-300", min: 100, max: 300 },
            { label: "$300-500", min: 300, max: 500 },
            { label: "$500+", min: 500, max: 10000 },
          ].map(range => (
            <button
              key={range.label}
              type="button"
              onClick={() => onChange({ min: range.min, max: range.max })}
              className={`
                rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200
                ${
                  value.min === range.min && value.max === range.max
                    ? "border-blue-300 bg-blue-100 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                }
              `}>
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
