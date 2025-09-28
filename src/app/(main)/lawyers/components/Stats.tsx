interface Stat {
  label: string;
  value: string | number;
  change?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  description?: string;
}

interface StatsProps {
  stats: Stat[];
  layout?: "horizontal" | "vertical" | "grid";
  variant?: "simple" | "card" | "bordered";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Stats({ stats, layout = "grid", variant = "card", size = "md", className = "" }: StatsProps) {
  const getLayoutClasses = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-wrap gap-4";
      case "vertical":
        return "flex flex-col space-y-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "simple":
        return "p-0";
      case "bordered":
        return "p-6 border border-gray-200 rounded-lg";
      default:
        return "p-6 bg-white border border-gray-100 rounded-lg shadow-sm";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          value: "text-2xl font-bold",
          label: "text-sm font-medium",
          change: "text-xs",
          spacing: "space-y-1",
        };
      case "lg":
        return {
          value: "text-4xl font-bold",
          label: "text-base font-medium",
          change: "text-sm",
          spacing: "space-y-3",
        };
      default:
        return {
          value: "text-3xl font-bold",
          label: "text-sm font-medium",
          change: "text-sm",
          spacing: "space-y-2",
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const baseItemClasses = getVariantClasses();

  const getChangeClasses = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeIcon = (type: "increase" | "decrease" | "neutral") => {
    switch (type) {
      case "increase":
        return "↗";
      case "decrease":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {stats.map(stat => (
        <div
          key={`${stat.label}-${stat.value}`}
          className={`${baseItemClasses} ${layout === "horizontal" ? "min-w-0 flex-1" : ""}`}>
          <div className={sizeClasses.spacing}>
            {/* Icon and Label */}
            <div className="flex items-center justify-between">
              <p className={`${sizeClasses.label} tracking-wide text-gray-600 uppercase`}>{stat.label}</p>
              {stat.icon && <div className="text-gray-400">{stat.icon}</div>}
            </div>

            {/* Value */}
            <div className="flex items-baseline">
              <p className={`${sizeClasses.value} text-gray-900`}>{stat.value}</p>
              {stat.change && (
                <span
                  className={`
                    ml-2 ${sizeClasses.change} flex items-center font-medium
                    ${getChangeClasses(stat.change.type)}
                  `}>
                  <span className="mr-1">{getChangeIcon(stat.change.type)}</span>
                  {stat.change.value}
                </span>
              )}
            </div>

            {/* Description */}
            {stat.description && <p className="mt-1 text-xs text-gray-500">{stat.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
