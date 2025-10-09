"use client";

import { LogoutButton } from "@/components/elements/logout-button";
import { ProfileUpload } from "@/components/elements/profile-upload";
import { Typography } from "@/components/elements/typography";
import { StateDropdown } from "@/components/modules/state-dropdown";
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
import { useAuth } from "@/hooks/use-auth";
import { useProfileMutation } from "@/hooks/use-profile";
import { type ProfileFormData, profileFormSchema } from "@/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const formId = useId();

  const { user } = useAuth();
  const { mutateWithToast } = useProfileMutation();

  const VALUES = useMemo(
    () => ({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      profileImage: user?.profile_picture_url || null,
      dateOfBirth: user?.date_of_birth || "",
      subscriptionType: user?.plan_name || "",
      storageUsage: user?.storage_used ? String(user.storage_used) : "",
      stateId: user?.state_id ? String(user.state_id) : "",
      tokenUsage: user?.token_used ? Number(user.token_used) : 0,
    }),
    [user]
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...VALUES,
    },
  });
  useEffect(() => {
    form.reset(VALUES);
  }, [VALUES, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    await mutateWithToast(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        state_id: data.stateId ? Number(data.stateId) : null,
        date_of_birth: data.dateOfBirth ? data.dateOfBirth : null,
        profile_picture:
          data.profileImage instanceof File ? data.profileImage : null,
      },
      () => setIsEditing(false)
    );
  };

  const { isSubmitting: stateSubmitting, isLoading, isDirty } = form.formState;
  const isSubmitting = stateSubmitting || isLoading;
  return (
    <main className="flex w-full flex-1 flex-col gap-6 lg:gap-10">
      {/* Header with Action Buttons */}
      <div className="flex items-center gap-3">
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            disabled={isSubmitting}
            className="rounded-md"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting || !isDirty}
              className="rounded-md"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isSubmitting}
              className="rounded-md"
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
          className="mx-auto flex w-full flex-1 flex-col space-y-4 max-lg:max-w-2xl lg:space-y-5"
        >
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-10">
            {/* Left Column - Profile Avatar */}
            <div className="flex flex-col gap-5 px-4 lg:px-10">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ProfileUpload
                        variant="gray"
                        value={field.value}
                        onChange={field.onChange}
                        defaultValue={user?.profile_picture_url || null}
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
            <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Form Fields */}
              <div className="space-y-4 lg:space-y-5">
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
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          readOnly
                          className="text-slate-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 lg:space-y-5">
                {/* State via reusable StateDropdown */}
                <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Typography
                          level="body"
                          weight="semibold"
                          className="text-deep-navy"
                        >
                          State
                        </Typography>
                      </FormLabel>
                      <FormControl>
                        <StateDropdown
                          countryId={233}
                          value={field.value}
                          onChange={val => field.onChange(val)}
                          disabled={!isEditing || isSubmitting}
                        />
                      </FormControl>
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
                          disabled
                          readOnly
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
                          disabled
                          readOnly
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
            <LogoutButton variant="destructive" className="rounded-md" />
          </div>
        </form>
      </Form>
    </main>
  );
}
