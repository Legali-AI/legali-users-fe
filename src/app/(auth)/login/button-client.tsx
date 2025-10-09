"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { googleAuthUrlApiAuthGoogleUrlPost } from "../../../sdk/out/sdk.gen";

const TOAST_MESSAGE = {
  error: {
    title: "Failed to get Google OAuth URL",
    description: "Please try again.",
  },
};

export default function ButtonClient() {
  const navigate = useRouter();
  const onClick = async () => {
    try {
      const response = await googleAuthUrlApiAuthGoogleUrlPost();
      if (!response.data?.data) {
        throw new Error(
          response?.error?.message ?? "Failed to get Google OAuth URL"
        );
      }
      const url = response.data?.data?.url;
      navigate.push(url ?? "");
    } catch (error) {
      toast.error(TOAST_MESSAGE.error.title, {
        description:
          error instanceof Error
            ? error.message
            : TOAST_MESSAGE.error.description,
      });
    }
  };
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* Google Button */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
        <Button
          variant={"black"}
          className="h-12 w-full gap-3 rounded-xl text-base font-medium"
          onClick={onClick}
        >
          <Image
            src={"/icons/google.svg"}
            width={16}
            height={16}
            alt="Logo Google"
            aria-hidden="true"
            sizes="16px"
          />
          Sign in with Google
        </Button>
      </div>

      {/* Facebook Button */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
        <Button
          variant={"black"}
          className="h-12 w-full gap-3 rounded-xl text-base font-medium"
          onClick={onClick}
        >
          <Image
            src={"/icons/fb.svg"}
            width={16}
            height={16}
            alt="Logo Facebook"
            aria-hidden="true"
            sizes="16px"
          />
          Sign in with Facebook
        </Button>
      </div>

      {/* Apple Button */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
        <Button
          variant="black"
          className="h-12 w-full gap-3 rounded-xl text-base font-medium"
          onClick={onClick}
        >
          <Image
            src={"/icons/apple.svg"}
            width={16}
            height={16}
            alt="Logo Apple"
            aria-hidden="true"
            sizes="16px"
          />
          Sign in with Apple
        </Button>
      </div>
    </div>
  );
}
