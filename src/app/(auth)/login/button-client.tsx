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
    <Button className="w-full cursor-pointer gap-3 rounded-md px-8 py-2 text-base" onClick={onClick}>
      <Image src={"/google.svg"} width={16} height={16} alt="" aria-hidden="true" sizes="16px" />
      Sign in with Google
    </Button>
  );
}
