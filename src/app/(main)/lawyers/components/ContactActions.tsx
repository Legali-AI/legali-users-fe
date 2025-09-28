import { Calendar, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactActionsProps {
  lawyerName: string;
  selectedPackage: string | null;
  onBookingClick: () => void;
}

export function ContactActions({
  lawyerName,
  selectedPackage,
  onBookingClick,
}: ContactActionsProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-gray-900 text-base sm:text-lg">
          Contact {lawyerName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
        <Button
          className="w-full h-12 sm:h-10"
          size="lg"
          disabled={!selectedPackage}
          onClick={onBookingClick}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Consultation
        </Button>
        <Button variant="outline" className="w-full h-12 sm:h-10">
          <MessageCircle className="h-4 w-4 mr-2" />
          Send Message
        </Button>
        <Button variant="outline" className="w-full h-12 sm:h-10">
          <Video className="h-4 w-4 mr-2" />
          Video Consultation
        </Button>
        {!selectedPackage && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Select a service package to book
          </p>
        )}
      </CardContent>
    </Card>
  );
}
