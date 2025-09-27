"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { googleAuthUrlApiAuthGoogleUrlPost } from "../../../sdk/sdk.gen";

export default function ButtonClient() {
  const navigate = useRouter();
  const onClick = async () => {
    try {
      const response = await googleAuthUrlApiAuthGoogleUrlPost();
      const url = response.data?.data?.url;
      navigate.push(url ?? "");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
      {/* Google Button */}
      <Button
        variant={"black"}
        className="w-full gap-3 rounded-md px-20 text-lg"
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

      {/* Facebook Button */}
      <Button
        variant={"black"}
        className="w-full gap-3 rounded-md px-20 text-lg"
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
      {/* Apple Button */}
      <Button
        variant={"black"}
        className="w-full gap-3 rounded-md px-20 text-lg"
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
  );
}
