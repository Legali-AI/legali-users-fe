"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useId, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProfileUpload } from "@/components/elements/profile-upload";
import { Typography } from "@/components/elements/typography";
import { LogoutButton } from "@/components/module/auth/logout-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfileCache } from "@/hooks/use-profile";
import {
  type ProfileFormData,
  profileFormSchema,
  regionOptions,
  subscriptionTypeOptions,
} from "@/schema/profile";
import { updateProfileApiAuthProfilePut } from "@/sdk/sdk.gen";
import { getAccessToken } from "../../../lib/auth";
import { isMockAuthentication, mockUpdateProfile } from "@/data/mock-profile.data";

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
        profile_picture_url:
          typeof data.profileImage === "string" ? data.profileImage : null,
      };

      let response;
      
      // Use mock service for mock users, real API for others
      if (isMockAuthentication()) {
        response = await mockUpdateProfile(updateData);
      } else {
        response = await updateProfileApiAuthProfilePut({
          body: updateData,
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
      }

      if (response.data?.data) {
        const updatedUser = response.data.data;

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
    } catch (error) {
      console.error("Profile update error:", error);
      alert(
        `Profile update failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-10 overflow-hidden">
      {/* Mock User Indicator */}
      {isMockAuthentication() && (
        <div className="rounded-lg bg-sky-blue-100 border border-sky-blue-300 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-blue-500"></div>
            <p className="text-sm font-medium text-sky-blue-800">
              Test Account Mode
            </p>
          </div>
          <p className="text-xs text-sky-blue-700 mt-1">
            You are logged in with a test account. Profile changes will be saved locally during this session.
            {user?.email?.includes('lawyers') ? ' (Lawyer Account)' : ' (User Account)'}
          </p>
        </div>
      )}
      
      {/* Header with Action Buttons */}
      <div className="flex items-center gap-3">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant={"orange"}
            disabled={isSubmitting}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button type="submit" form={formId} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
            >
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
          className="flex w-full flex-1 flex-col space-y-5"
        >
          <div className="flex w-full gap-10">
            {/* Left Column */}
            <div className="flex flex-col gap-5 px-10">
              {/* Profile Avatar */}
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

            {/* Right Column */}
            <div className="grid flex-1 grid-cols-2 flex-col gap-5">
              {/* Form Fields */}
              <div className="space-y-5">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          First Name
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isSubmitting}
                          className="h-[39px] w-full rounded-[10px] border-light-gray-400 bg-white px-6 py-2 text-slate-gray-400"
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
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          Last Name
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isSubmitting}
                          className="h-[39px] w-full rounded-[10px] border-light-gray-400 bg-white px-6 py-2 text-slate-gray-400"
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
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          DoB
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={!isEditing || isSubmitting}
                          className="h-[39px] w-full rounded-[10px] border-light-gray-400 bg-white px-6 py-2 text-slate-gray-400"
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
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          Subscription Type
                        </Typography>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-[39px] w-full rounded-[10px] border-light-gray-400 bg-white px-6 py-2 text-slate-gray-400">
                            <SelectValue placeholder="Select subscription type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subscriptionTypeOptions.map((option) => (
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
              </div>

              <div className="space-y-5">
                {/* Region */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          Region
                        </Typography>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!isEditing || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="h-[39px] w-full rounded-[10px] border-light-gray-400 bg-white px-6 py-2 text-slate-gray-400">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regionOptions.map((option) => (
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
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          Token Usage
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          className="text-slate-gray-400"
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
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          Storage Usage
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={true}
                          className="text-slate-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Footer with Logout Button */}
          <div className="flex justify-end">
            <LogoutButton variant="destructive" />
          </div>
        </form>
      </Form>
    </div>
  );
}
