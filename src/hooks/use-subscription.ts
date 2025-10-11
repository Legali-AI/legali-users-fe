import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelSubscriptionApiUserSubscriptionsSessionIdDelete,
  createSubscriptionApiUserSubscriptionsPost,
  getUserSubscriptionApiUserSubscriptionsGet,
  upgradeSubscriptionApiUserSubscriptionsSubscriptionIdUpgradePut,
} from "../sdk/out/sdk.gen";

export function useUserSubscriptionQuery() {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const res = await getUserSubscriptionApiUserSubscriptionsGet();

      if (!res.data?.success) {
        throw new Error(
          res.error?.message || "Failed to fetch user subscription"
        );
      }

      return res.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSubscriptionMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  const cancelWithToast = async (sessionId: string) => {
    const cancelPromise = cancelSubscriptionApiUserSubscriptionsSessionIdDelete(
      {
        path: { session_id: sessionId },
      }
    )
      .then(async res => {
        if (!res.data?.success) {
          throw new Error(
            res.data?.message ||
              res.error?.message ||
              "Failed to cancel subscription"
          );
        }
        options?.onSuccess?.();
        return res.data;
      })
      .catch(error => {
        throw new Error(error.message || "Failed to cancel subscription");
      });

    return toast.promise(cancelPromise, {
      loading: "Cancelling subscription...",
      success: "Subscription cancelled successfully",
      error: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to cancel subscription";
        return {
          message: "Failed to cancel subscription",
          description: message,
        };
      },
    });
  };

  const cancelMutation = useMutation({
    mutationFn: cancelWithToast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
    onError: error => {
      options?.onError?.(error);
    },
  });

  const upgradeWithToast = async (
    subscriptionId: string,
    newPlanId: string
  ) => {
    const upgradePromise =
      upgradeSubscriptionApiUserSubscriptionsSubscriptionIdUpgradePut({
        path: { subscription_id: subscriptionId },
        body: { new_plan_id: newPlanId },
      })
        .then(async res => {
          if (!res.data?.success) {
            throw new Error(
              res.data?.message ||
                res.error?.message ||
                "Failed to upgrade subscription"
            );
          }
          return res.data;
        })
        .catch(error => {
          throw new Error(error.message || "Failed to upgrade subscription");
        });

    return toast.promise(upgradePromise, {
      loading: "Upgrading subscription...",
      success: "Subscription upgraded successfully",
      error: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to upgrade subscription";
        return {
          message: "Failed to upgrade subscription",
          description: message,
        };
      },
    });
  };

  const upgradeMutation = useMutation({
    mutationFn: async (params: {
      subscriptionId: string;
      newPlanId: string;
    }) => {
      return upgradeWithToast(params.subscriptionId, params.newPlanId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      options?.onSuccess?.();
    },
    onError: error => {
      options?.onError?.(error);
    },
  });

  const createWithToast = async (planId: string) => {
    const createPromise = createSubscriptionApiUserSubscriptionsPost({
      body: { plan_id: planId },
    })
      .then(async res => {
        if (!res.data?.success) {
          throw new Error(
            res.data?.message ||
              res.error?.message ||
              "Failed to create subscription"
          );
        }
        return res.data;
      })
      .catch(error => {
        throw new Error(error.message || "Failed to create subscription");
      });

    return toast.promise(createPromise, {
      loading: "Creating subscription...",
      success: "Subscription created successfully",
      error: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create subscription";
        return {
          message: "Failed to create subscription",
          description: message,
        };
      },
    });
  };

  const createMutation = useMutation({
    mutationFn: async (planId: string) => {
      return createWithToast(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      options?.onSuccess?.();
    },
    onError: error => {
      options?.onError?.(error);
    },
  });

  return {
    cancelWithToast: cancelMutation.mutateAsync,
    upgradeWithToast: upgradeMutation.mutateAsync,
    createWithToast: createMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
    isUpgrading: upgradeMutation.isPending,
    isCreating: createMutation.isPending,
  };
}
