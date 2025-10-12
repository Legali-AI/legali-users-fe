"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../hooks/use-auth";
import {
  useSubscriptionMutation,
  useUserSubscriptionQuery,
} from "../../../hooks/use-subscription";
import { QueryProvider } from "../../../lib/query-client";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
  planPrice: string;
}

function SubscribeButtonInner({
  planId,
  planName,
  planPrice,
}: SubscribeButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: subscriptionData } = useUserSubscriptionQuery();
  const { upgradeWithToast, createWithToast, isUpgrading, isCreating } =
    useSubscriptionMutation();

  // Parse prices for comparison
  const currentPrice = subscriptionData?.data?.current_price
    ? parseFloat(subscriptionData.data.current_price)
    : null;
  const targetPrice = parseFloat(planPrice);

  // Determine button state
  const isCurrentPlan = subscriptionData?.data?.plan_id === planId;
  const isActive = subscriptionData?.data?.status === "active";
  const isUpgrade = currentPrice ? targetPrice > currentPrice : false;
  const isDowngrade = currentPrice ? targetPrice < currentPrice : false;

  const onSubscribe = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Don't allow action on current plan
    if (isCurrentPlan && isActive) {
      toast.info("This is your current plan");
      return;
    }

    // Don't allow downgrades
    if (isDowngrade) {
      toast.error("Downgrades are not allowed. Please contact support.");
      return;
    }

    const subscriptionId = subscriptionData?.data?.subscription_id;

    if (isUpgrade && subscriptionId) {
      await upgradeWithToast({
        subscriptionId: subscriptionId,
        newPlanId: planId,
      });
    } else {
      const res = await createWithToast(planId);
    }
  };

  const getButtonContent = () => {
    if (isUpgrading || isCreating) return "Processing...";

    if (isCurrentPlan && isActive) {
      return "Current Plan";
    }

    if (isDowngrade) {
      return "Downgrade Not Available";
    }

    if (isUpgrade) {
      return `Upgrade to ${planName}`;
    }

    return `Get ${planName}`;
  };

  return (
    <Button
      type="button"
      variant={isCurrentPlan && isActive ? "outline" : "gradient-blue"}
      onClick={onSubscribe}
      disabled={
        isUpgrading || isCreating || (isCurrentPlan && isActive) || isDowngrade
      }
    >
      {getButtonContent()}
    </Button>
  );
}

export function SubscribeButton(props: SubscribeButtonProps) {
  return (
    <QueryProvider ignoreDevtools>
      <SubscribeButtonInner {...props} />
    </QueryProvider>
  );
}
