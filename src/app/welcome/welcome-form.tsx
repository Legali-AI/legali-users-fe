"use client";

import { StateDropdown } from "@/components/modules/state-dropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProfileUpload } from "../../components/elements/profile-upload";
import { H1 } from "../../components/elements/typography";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/use-auth";
import { useProfileMutation } from "../../hooks/use-profile";
import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  MAX_PROFILE_IMAGE_SIZE,
  type WelcomeFormData,
  welcomeFormSchema,
} from "../../schema/welcome";

export function WelcomeForm() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

  const { mutateWithToast } = useProfileMutation();

  const form = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeFormSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      stateId: user?.state_id ? String(user.state_id) : "",
      profileImage: null,
    },
  });

  useEffect(() => {
    if (user?.first_name || user?.last_name || user?.state_id) {
      form.setValue("firstName", user.first_name || "");
      form.setValue("lastName", user.last_name || "");
      form.setValue("stateId", user.state_id ? String(user.state_id) : "");
    }
  }, [user, form]);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      redirect("/login");
    } else if (!isLoadingAuth && isAuthenticated && user?.state_id) {
      redirect("/profile");
    }
  }, [isLoadingAuth, isAuthenticated, user?.state_id]);

  const handleSubmit = async (data: WelcomeFormData) => {
    await mutateWithToast(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        state_id: Number(data.stateId),
        profile_picture:
          data.profileImage instanceof File ? data.profileImage : null,
      },
      () => {
        router.push("/profile");
      }
    );
  };

  const {
    formState: { isLoading: isLoadingState, isDirty, isSubmitting },
  } = form;

  const isLoading = isLoadingState || isSubmitting;

  return (
    <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 px-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/logo.png" width={80} height={50} alt="Logo" />
        <H1 level="h3" weight="semibold">
          Fill your credentials
        </H1>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="m-auto flex w-full flex-1 items-center gap-6 self-center max-md:flex-col md:items-start md:gap-8 lg:gap-10 xl:gap-12"
        >
          {/* Profile Image Upload */}
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProfileUpload
                    value={field.value}
                    defaultValue={user?.profile_picture_url || null}
                    onChange={field.onChange}
                    disabled={isLoading}
                    maxSize={MAX_PROFILE_IMAGE_SIZE}
                    accept={ALLOWED_PROFILE_IMAGE_TYPES.join(", ")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-3 xl:gap-4">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-0.5 md:space-y-1">
                  <FormLabel className="font-semibold">First Name</FormLabel>
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
                <FormItem className="space-y-0.5 md:space-y-1">
                  <FormLabel className="font-semibold">Last Name</FormLabel>
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

            {/* State via DropdownMenu */}
            <FormField
              control={form.control}
              name="stateId"
              render={({ field }) => (
                <FormItem className="space-y-0.5 md:space-y-1">
                  <FormLabel className="font-semibold">State</FormLabel>
                  <FormControl>
                    <StateDropdown
                      countryId={233}
                      value={field.value}
                      onChange={val => {
                        field.onChange(val);
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => form.reset()}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="gradient-blue"
                disabled={isLoading || !isDirty}
              >
                {form.formState.isLoading ? "Updating Profile..." : "Finish"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
