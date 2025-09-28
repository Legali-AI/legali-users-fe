"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Header } from "@/components/header";
import { useLawyerDetails, useLawyerReviews } from "@/hooks/use-lawyers";
import { BookingModal } from "../components/BookingModal";
import { ContactActions } from "../components/ContactActions";
import { LawyerAbout } from "../components/LawyerAbout";
import { LawyerCaseResults } from "../components/LawyerCaseResults";
import { LawyerCredentials } from "../components/LawyerCredentials";
import { LawyerHeader } from "../components/LawyerHeader";
import { LawyerReviews } from "../components/LawyerReviews";
import { QuickInfo } from "../components/QuickInfo";
import { ServicePackages } from "../components/ServicePackages";

interface LawyerProfileClientProps {
  id: string;
}

export default function LawyerProfileClient({ id }: LawyerProfileClientProps) {
  const { data: lawyer, isLoading: lawyerLoading } = useLawyerDetails(id);
  const { data: reviews, isLoading: reviewsLoading } = useLawyerReviews(id);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (lawyerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-6 h-64 rounded bg-gray-200"></div>
                <div className="h-32 rounded bg-gray-200"></div>
              </div>
              <div className="h-96 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Lawyer Not Found</h1>
          <p className="mb-4 text-gray-600">The lawyer profile you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/lawyers">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-safe-bottom min-h-screen bg-gray-50">
      {/* <Header /> */}

      <div className="mx-auto max-w-7xl px-4 py-4 pb-8 sm:px-6 sm:py-8 sm:pb-12 lg:px-8">
        {/* Back Button */}
        <Link href="/lawyers" className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-700 sm:mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search Results
        </Link>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="order-1 space-y-6 lg:col-span-2 lg:space-y-8">
            {/* Lawyer Header */}
            <LawyerHeader lawyer={lawyer} />

            {/* About */}
            <LawyerAbout lawyer={lawyer} />

            {/* Credentials & Experience */}
            <LawyerCredentials lawyer={lawyer} />

            {/* Case Results */}
            <LawyerCaseResults lawyer={lawyer} />

            {/* Reviews */}
            <LawyerReviews reviews={reviews} isLoading={reviewsLoading} />
          </div>

          {/* Sidebar */}
          <div className="order-2 space-y-4 pb-6 lg:order-none lg:space-y-6 lg:pb-0">
            {/* Pricing Packages */}
            <ServicePackages lawyer={lawyer} selectedPackage={selectedPackage} onPackageSelect={setSelectedPackage} />

            {/* Contact Actions */}
            <ContactActions
              lawyerName={lawyer.name}
              selectedPackage={selectedPackage}
              onBookingClick={() => setIsBookingModalOpen(true)}
            />

            {/* Quick Info */}
            <QuickInfo lawyer={lawyer} />
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          lawyerName={lawyer.name}
          selectedPackage={selectedPackage}
        />
      </div>
    </div>
  );
}
