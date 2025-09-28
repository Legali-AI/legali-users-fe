"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { ProfileUpload } from "@/components/elements/profile-upload";
import { Typography } from "@/components/elements/typography";
import { LogoutButton } from "@/components/module/auth/logout-button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isMockAuthentication, mockUpdateProfile } from "@/data/mock-profile.data";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfileCache } from "@/hooks/use-profile";
import { type ProfileFormData, profileFormSchema, regionOptions, subscriptionTypeOptions } from "@/schema/profile";
import { updateProfileApiAuthProfilePut } from "@/sdk/sdk.gen";
import { getAccessToken } from "../../../lib/auth";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();
  const { user } = useAuth();
  const updateProfileCache = useUpdateProfileCache();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.first_name || "Legali",
      lastName: user?.last_name || "Legali",
      profileImage: user?.profile_picture_url || null,
      dateOfBirth: "1990-01-01",
      subscriptionType: "Premium",
      region: "united-states",
      tokenUsage: 5000,
      storageUsage: "20000 MB",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.first_name || "Legali",
        lastName: user.last_name || "Legali",
        profileImage: user.profile_picture_url || null,
        dateOfBirth: "1990-01-01",
        subscriptionType: "Premium",
        region: "united-states",
        tokenUsage: 5000,
        storageUsage: "20000 MB",
      });
    }
  }, [user, form]);

  // Function to handle profile picture upload
  const handleProfileImageChange = async (file: File | null) => {
    if (!file) {
      form.setValue("profileImage", null);
      return;
    }

    try {
      const localUrl = URL.createObjectURL(file);
      form.setValue("profileImage", localUrl);
    } catch (error) {
      console.error("Error handling profile image:", error);
      alert("Failed to process profile image");
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);

      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        profile_picture_url: typeof data.profileImage === "string" ? data.profileImage : null,
      };

      // Use mock service for mock users, real API for others
      if (isMockAuthentication()) {
        const mockResponse = await mockUpdateProfile(updateData);
        const updatedUser = mockResponse.data.data;

        updateProfileCache({
          id: updatedUser.id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          profile_picture_url: updatedUser.profile_picture_url || null,
          city_id: updatedUser.city_id || null,
        });

        setIsEditing(false);
      } else {
        const apiResponse = await updateProfileApiAuthProfilePut({
          body: updateData,
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });

        if (apiResponse.data?.data) {
          const updatedUser = apiResponse.data.data;

          updateProfileCache({
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            profile_picture_url: updatedUser.profile_picture_url || null,
            city_id: updatedUser.city_id || null,
          });

          setIsEditing(false);
        } else {
          throw new Error("No data received from profile update");
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert(`Profile update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full w-full flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col gap-6 overflow-y-auto px-4 pb-8 sm:gap-8 sm:px-6 lg:gap-10 lg:px-8">
        {/* Mock User Indicator */}
        {isMockAuthentication() && (
          <div className="rounded-lg border border-sky-blue-300 bg-sky-blue-100/80 p-3 backdrop-blur-sm sm:p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-blue-500"></div>
              <p className="text-xs font-medium text-sky-blue-800 sm:text-sm">Test Account Mode</p>
            </div>
            <p className="mt-1 text-xs text-sky-blue-700">
              You are logged in with a test account. Profile changes will be saved locally during this session.
              {user?.email?.includes("lawyers") ? " (Lawyer Account)" : " (User Account)"}
            </p>
          </div>
        )}

        {/* Header with Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant={"orange"}
              disabled={isSubmitting}
              className="h-9 text-sm sm:h-10 sm:text-base">
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="ml-2">Edit</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Button type="submit" form={formId} disabled={isSubmitting} className="h-9 text-sm sm:h-10 sm:text-base">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={isSubmitting}
                className="h-9 text-sm sm:h-10 sm:text-base">
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-1 flex-col space-y-4 sm:space-y-5">
            <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-10">
              {/* Left Column - Profile Avatar */}
              <div className="flex flex-col items-center gap-4 pb-4 lg:px-10 lg:pb-0">
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ProfileUpload
                          value={field.value}
                          onChange={handleProfileImageChange}
                          disabled={!isEditing || isSubmitting}
                          className="mx-auto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Form Fields */}
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          First Name
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isSubmitting}
                          className="h-10 w-full rounded-[10px] border-light-gray-400 bg-white/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base"
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
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          Last Name
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isSubmitting}
                          className="h-10 w-full rounded-[10px] border-light-gray-400 bg-white/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          Date of Birth
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={!isEditing || isSubmitting}
                          className="h-10 w-full rounded-[10px] border-light-gray-400 bg-white/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subscription Type */}
                <FormField
                  control={form.control}
                  name="subscriptionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          Subscription Type
                        </Typography>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing || isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded-[10px] border-light-gray-400 bg-white/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base">
                            <SelectValue placeholder="Select subscription type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subscriptionTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Region */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          Region
                        </Typography>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing || isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="h-10 w-full rounded-[10px] border-light-gray-400 bg-white/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Token Usage */}
                <FormField
                  control={form.control}
                  name="tokenUsage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          Token Usage
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          className="h-10 w-full rounded-[10px] border-light-gray-400 bg-gray-50/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Storage Usage */}
                <FormField
                  control={form.control}
                  name="storageUsage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography level="body" weight="semibold" className="text-sm text-deep-navy sm:text-base">
                          Storage Usage
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          className="h-10 w-full rounded-[10px] border-light-gray-400 bg-gray-50/80 px-4 py-2 text-sm text-slate-gray-400 backdrop-blur-sm sm:h-[39px] sm:px-6 sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer with Logout Button */}
            <div className="flex justify-center pt-4 sm:justify-end sm:pt-6">
              <LogoutButton variant="destructive" className="w-full sm:w-auto" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
