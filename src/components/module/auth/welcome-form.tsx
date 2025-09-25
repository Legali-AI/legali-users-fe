"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAccessToken } from "@/lib/auth";
import { useAuth } from "../../../hooks/use-auth";
import { useUpdateProfileCache } from "../../../hooks/use-profile";
import {
  type WelcomeFormData,
  welcomeFormSchema,
} from "../../../schema/welcome";
import {
  getAllCitiesApiLocationsCitiesGet,
  getAllCountriesApiLocationsCountriesGet,
  getAllRegionsApiLocationsRegionsGet,
  updateProfileApiAuthProfilePut,
} from "../../../sdk/sdk.gen";
import { ProfileUpload } from "../../elements/profile-upload";
import { H1, P } from "../../elements/typography";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export function WelcomeForm() {
  const router = useRouter();
  const { user } = useAuth();
  const updateProfileCache = useUpdateProfileCache();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location data states
  const [regions, setRegions] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [countries, setCountries] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [cities, setCities] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const form = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeFormSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      region: "",
      profileImage: null,
    },
  });

  // Update form values when user data becomes available
  useEffect(() => {
    if (user?.first_name || user?.last_name) {
      form.setValue("firstName", user.first_name || "");
      form.setValue("lastName", user.last_name || "");
    }
  }, [user, form]);

  // Load regions on component mount
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setIsLoadingLocations(true);
        const response = await getAllRegionsApiLocationsRegionsGet();
        if (response.data?.data) {
          setRegions(response.data.data);
        }
      } catch (error) {
        console.error("Error loading regions:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    loadRegions();
  }, []);

  // Load countries when region changes
  const handleRegionChange = async (regionId: number) => {
    try {
      setIsLoadingLocations(true);
      setSelectedRegionId(regionId);
      setSelectedCountryId(null);
      setSelectedCityId(null);
      setCountries([]);
      setCities([]);

      // Update form region field
      form.setValue("region", regionId.toString());

      const response = await getAllCountriesApiLocationsCountriesGet({
        query: { region_id: regionId },
      });

      if (response.data?.data) {
        setCountries(response.data.data);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Load cities when country changes
  const handleCountryChange = async (countryId: number) => {
    try {
      setIsLoadingLocations(true);
      setSelectedCountryId(countryId);
      setSelectedCityId(null);
      setCities([]);

      const response = await getAllCitiesApiLocationsCitiesGet({
        query: { country_id: countryId },
      });

      if (response.data?.data) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error("Error loading cities:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleSubmit = async (data: WelcomeFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare profile update data
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        city_id: selectedCityId,
        // Note: profile_picture_url would need to be handled separately
        // as it requires file upload
      };

      // Update profile using SDK (automatic token refresh handled by client)
      const response = await updateProfileApiAuthProfilePut({
        body: updateData,
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.data?.data) {
        // Update local user data
        const updatedUser = response.data.data;

        updateProfileCache({
          id: updatedUser.id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          profile_picture_url: updatedUser.profile_picture_url || null,
          city_id: updatedUser.city_id || null,
        });

        // Redirect to profile page
        router.push("/profile");
      } else {
        throw new Error("No data received from profile update");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      // Show error message to user
      alert(
        `Profile update failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    formState: { isLoading },
  } = form;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/logo.png" width={80} height={50} alt="Logo" />
        <H1 level="h3" weight="semibold" className="text-deep-navy">
          Fill your credentials
        </H1>
      </div>

      {/* Debug Info */}
      {Object.keys(form.formState.errors).length > 0 && (
        <div className="w-full rounded-md bg-red-50 p-4">
          <h4 className="text-sm font-medium text-red-800">
            Form Validation Errors:
          </h4>
          <ul className="mt-2 text-sm text-red-700">
            {Object.entries(form.formState.errors).map(([field, error]) => (
              <li key={field}>
                {field}: {String(error?.message || "Invalid")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="m-auto flex w-full flex-1 gap-8 self-center"
        >
          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ProfileUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full flex-col gap-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-base font-semibold text-deep-navy">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name..."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-base font-semibold text-deep-navy">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name..."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selection */}
            <div className="space-y-4">
              {/* Region */}
              <FormItem className="space-y-1">
                <FormLabel className="text-base font-semibold text-deep-navy">
                  Region
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    handleRegionChange(parseInt(value, 10))
                  }
                  disabled={isLoading || isLoadingLocations}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* Country */}
              <FormItem className="space-y-1">
                <FormLabel className="text-base font-semibold text-deep-navy">
                  Country
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    handleCountryChange(parseInt(value, 10))
                  }
                  disabled={
                    isLoading || isLoadingLocations || !selectedRegionId
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* City */}
              <FormItem className="space-y-1">
                <FormLabel className="text-base font-semibold text-deep-navy">
                  City
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    setSelectedCityId(parseInt(value, 10))
                  }
                  disabled={
                    isLoading || isLoadingLocations || !selectedCountryId
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full border-light-gray-400 bg-white px-6 text-slate-gray-400 hover:bg-slate-50"
                disabled={isLoading}
                onClick={() => form.reset()}
              >
                <P
                  level="body"
                  weight="semibold"
                  className="text-slate-gray-400"
                >
                  Cancel
                </P>
              </Button>

              <Button
                type="submit"
                variant="orange"
                className="h-10 rounded-full bg-warm-orange-400 px-6"
                disabled={isLoading || isSubmitting}
              >
                <P level="body" weight="semibold" className="text-white">
                  {isSubmitting ? "Updating Profile..." : "Finish"}
                </P>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
