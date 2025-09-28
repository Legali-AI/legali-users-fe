"use client";

interface CheckboxFilterOption {
  label: string;
  value: string | number;
  count?: number;
}

interface CheckboxFilterProps {
  title: string;
  options: CheckboxFilterOption[];
  selectedValues: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  className?: string;
}

export function CheckboxFilter({ title, options, selectedValues, onChange, className = "" }: CheckboxFilterProps) {
  const handleCheckboxChange = (value: string | number, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  return (
    <div className={className}>
      <h3 className="font-medium mb-3 text-gray-900">{title}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {options.map(option => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={e => handleCheckboxChange(option.value, e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm text-gray-700">{option.label}</span>
                {option.count !== undefined && <span className="text-xs text-gray-500 ml-2">({option.count})</span>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
