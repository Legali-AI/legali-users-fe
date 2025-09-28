import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Lawyer } from "@/types";

interface ServicePackagesProps {
  lawyer: Lawyer;
  selectedPackage: string | null;
  onPackageSelect: (packageId: string) => void;
}

export function ServicePackages({
  lawyer,
  selectedPackage,
  onPackageSelect,
}: ServicePackagesProps) {
  return (
    <Card className="border border-gray-100 bg-white shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-gray-900">Service Packages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6">
        {lawyer.pricingPackages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-colors sm:p-4 ${
              selectedPackage === pkg.id
                ? "border-blue-500 bg-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onPackageSelect(pkg.id)}
            aria-label={`Select ${pkg.name} package`}
          >
            <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
              <h3 className="font-medium text-gray-900">{pkg.name}</h3>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(pkg.price)}
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-600">{pkg.description}</p>
            <p className="mb-3 text-xs text-gray-500">
              Duration: {pkg.duration}
            </p>
            <ul className="space-y-1">
              {pkg.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center text-sm text-gray-600"
                >
                  • {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
