import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type BodyUpdateProfileApiUserProfilePut,
  getClientProfileApiUserProfileClientGet,
  updateProfileApiUserProfilePut,
} from "../sdk/out";

export const PROFILE_QUERY_KEY = ["profile"] as const;

export const useProfileQuery = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await getClientProfileApiUserProfileClientGet({});

        if (!res.data?.success || res.error) {
          throw new Error(res.error?.message || "Failed to load profile");
        }
        return res.data;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load profile";
        toast.error(message);
        throw e;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: BodyUpdateProfileApiUserProfilePut) => {
      const res = await updateProfileApiUserProfilePut({
        body: data,
      });

      if (!res.data?.success || res.error) {
        throw new Error(res.error?.message || "Failed to update profile");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "Profile update failed";
      toast.error(message);
    },
  });

  const mutateWithToast = async (
    data: BodyUpdateProfileApiUserProfilePut,
    onSuccess?: () => void
  ) => {
    return await toast.promise(
      mutation.mutateAsync(data, {
        onSuccess: () => {
          onSuccess?.();
        },
      }),
      {
        loading: "Updating profile...",
        success: () => ({
          message: "Profile updated successfully",
          description: "Redirecting you to profile page...",
        }),
        error: (e: unknown) => ({
          message: "Profile update failed",
          description: e instanceof Error ? e.message : "Profile update failed",
        }),
      }
    );
  };

  return { mutateWithToast };
};
