import LawyerProfileClient from "./LawyerProfileClient";

interface LawyerProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we need to pre-generate some lawyer IDs
  // In a real app, you'd fetch these from your API
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const { id } = await params;
  return <LawyerProfileClient id={id} />;
}
