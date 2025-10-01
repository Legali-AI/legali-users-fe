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
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* Google Button */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
        <Button variant={"black"} className="h-12 w-full gap-3 rounded-xl text-base font-medium" onClick={onClick}>
          <Image src={"/icons/google.svg"} width={16} height={16} alt="Logo Google" aria-hidden="true" sizes="16px" />
          Sign in with Google
        </Button>
      </div>

      {/* Facebook Button */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
        <Button variant={"black"} className="h-12 w-full gap-3 rounded-xl text-base font-medium" onClick={onClick}>
          <Image src={"/icons/fb.svg"} width={16} height={16} alt="Logo Facebook" aria-hidden="true" sizes="16px" />
          Sign in with Facebook
        </Button>
      </div>

      {/* Apple Button */}
      <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
        <Button variant="black" className="h-12 w-full gap-3 rounded-xl text-base font-medium" onClick={onClick}>
          <Image src={"/icons/apple.svg"} width={16} height={16} alt="Logo Apple" aria-hidden="true" sizes="16px" />
          Sign in with Apple
        </Button>
      </div>
    </div>
  );
}
