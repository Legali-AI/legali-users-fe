"use client";

import { Calendar, Clock } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerName: string;
  selectedPackage: string | null;
}

interface BookingForm {
  date: string;
  timeSlot: string;
  fullName: string;
  email: string;
  phone: string;
  consultationType: "phone" | "video" | "in-person";
  caseDescription: string;
  duration: "30" | "60" | "90";
}

interface FormErrors {
  date?: string;
  timeSlot?: string;
  fullName?: string;
  email?: string;
  caseDescription?: string;
}

export function BookingModal({ isOpen, onClose, lawyerName, selectedPackage }: BookingModalProps) {
  const dateId = useId();
  const fullNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const caseDescriptionId = useId();

  const [currentStep, setCurrentStep] = useState<"datetime" | "details" | "confirmation">("datetime");
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    date: "",
    timeSlot: "",
    fullName: "",
    email: "",
    phone: "",
    consultationType: "video",
    caseDescription: "",
    duration: "60",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default operational hours: 9 AM - 5 PM, weekdays only
  const generateAvailableTimeSlots = (selectedDate: string): string[] => {
    if (!selectedDate) return [];

    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [];
    }

    // TODO: In future, fetch lawyer's custom operational hours
    const operationalHours = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

    return operationalHours;
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!bookingForm.date) {
      errors.date = "Please select a date";
    } else {
      const selectedDate = new Date(bookingForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.date = "Cannot book for past dates";
      }
    }

    if (!bookingForm.timeSlot) {
      errors.timeSlot = "Please select a time slot";
    }

    if (!bookingForm.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (bookingForm.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!bookingForm.email.trim()) {
      errors.email = "Email address is required";
    } else if (!validateEmail(bookingForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!bookingForm.caseDescription.trim()) {
      errors.caseDescription = "Case description is required";
    } else if (bookingForm.caseDescription.trim().length < 10) {
      errors.caseDescription = "Please provide at least 10 characters describing your case";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Mock available time slots - will be replaced with actual availability check
  const availableTimeSlots = generateAvailableTimeSlots(bookingForm.date);

  const handleDateChange = (date: string) => {
    setBookingForm(prev => ({ ...prev, date, timeSlot: "" })); // Reset time slot when date changes
    // Clear date-related errors
    if (formErrors.date) {
      setFormErrors(prev => {
        // biome-ignore lint/correctness/noUnusedVariables: needed for object destructuring
        const { date, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleTimeSlotSelect = (_timeSlot: string) => {
    setFormErrors(prev => {
      // biome-ignore lint/correctness/noUnusedVariables: needed for object destructuring
      const { timeSlot, ...rest } = prev;
      return rest;
    });
    // Clear time slot errors
    if (formErrors.timeSlot) {
      setFormErrors(prev => {
        // biome-ignore lint/correctness/noUnusedVariables: needed for object destructuring
        const { timeSlot, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    if (currentStep === "datetime") {
      const hasDateTimeErrors = !bookingForm.date || !bookingForm.timeSlot;
      if (hasDateTimeErrors) {
        const errors: FormErrors = {};
        if (!bookingForm.date) errors.date = "Please select a date";
        if (!bookingForm.timeSlot) errors.timeSlot = "Please select a time slot";
        setFormErrors(errors);
        return;
      }
      setCurrentStep("details");
    } else if (currentStep === "details") {
      if (validateForm()) {
        setCurrentStep("confirmation");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("datetime");
    } else if (currentStep === "confirmation") {
      setCurrentStep("details");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Integrate with Google Calendar API
      console.log("Booking submission:", bookingForm);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message or redirect
      alert("Consultation booked successfully!");
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book consultation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateTimeComplete = bookingForm.date && bookingForm.timeSlot;
  const isDetailsComplete = bookingForm.fullName && bookingForm.email && bookingForm.caseDescription;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-auto max-h-[90vh] max-w-lg overflow-y-auto border border-gray-200 bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            Book Consultation with {lawyerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
            <div
              className={`flex items-center gap-2 ${
                currentStep === "datetime" ? "font-medium text-blue-600" : "text-gray-500"
              }`}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  currentStep === "datetime" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                1
              </div>
              Date & Time
            </div>
            <div
              className={`flex items-center gap-2 ${
                currentStep === "details" ? "font-medium text-blue-600" : "text-gray-500"
              }`}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  currentStep === "details" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                2
              </div>
              Details
            </div>
            <div
              className={`flex items-center gap-2 ${
                currentStep === "confirmation" ? "font-medium text-blue-600" : "text-gray-500"
              }`}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  currentStep === "confirmation" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                3
              </div>
              Confirm
            </div>
          </div>

          {/* Selected package info */}
          {selectedPackage && (
            <Card className="border-blue-200 bg-blue-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Selected Package: {selectedPackage}</p>
                    <p className="mt-1 text-xs text-blue-700">
                      This consultation will be billed according to your selected package
                    </p>
                  </div>
                  <div className="rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    Selected
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Information */}
          <Card className="border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-900">Booking Information</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Available hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
                <p>• Time zone: Your local time zone</p>
                <p>• Booking confirmation will be sent to your email</p>
                <p>• You can reschedule up to 24 hours before the consultation</p>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Date & Time Selection */}
          {currentStep === "datetime" && (
            <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-4">
              <div>
                <Label htmlFor={dateId} className="font-medium text-gray-700">
                  Select Date
                </Label>
                <Input
                  id={dateId}
                  type="date"
                  value={bookingForm.date}
                  onChange={e => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`mt-1 border-gray-300 bg-white text-gray-900 ${
                    formErrors.date ? "border-red-500" : "focus:border-blue-500"
                  }`}
                />
                {formErrors.date && <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>}
              </div>

              <div>
                <Label className="font-medium text-gray-700">Duration</Label>
                <Select
                  value={bookingForm.duration}
                  onValueChange={(value: string) => handleInputChange("duration", value)}>
                  <SelectTrigger className="mt-1 border-gray-300 bg-white text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 bg-white">
                    <SelectItem value="30" className="text-gray-900 hover:bg-gray-50">
                      30 minutes
                    </SelectItem>
                    <SelectItem value="60" className="text-gray-900 hover:bg-gray-50">
                      1 hour
                    </SelectItem>
                    <SelectItem value="90" className="text-gray-900 hover:bg-gray-50">
                      1.5 hours
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bookingForm.date && (
                <div>
                  <Label className="font-medium text-gray-700">Available Time Slots</Label>
                  <p className="mb-2 text-xs text-gray-500">
                    Select your preferred consultation time. All times are in your local timezone.
                  </p>
                  {availableTimeSlots.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 py-6 text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">No available time slots for this date.</p>
                      <p className="mt-1 text-xs text-gray-400">Please select a weekday (Monday - Friday)</p>
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {availableTimeSlots.map(slot => (
                        <Button
                          key={slot}
                          variant="outline"
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`h-12 border-2 transition-all duration-200 ${
                            bookingForm.timeSlot === slot
                              ? "border-blue-600 bg-blue-600 text-white shadow-md hover:border-blue-700 hover:bg-blue-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                          }`}>
                          <Clock className="mr-2 h-4 w-4" />
                          <span className="font-medium">{slot}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                  {formErrors.timeSlot && <p className="mt-1 text-sm text-red-600">{formErrors.timeSlot}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === "details" && (
            <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-4">
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <h3 className="mb-1 text-sm font-medium text-blue-900">Contact Information</h3>
                <p className="text-xs text-blue-700">
                  Please provide accurate contact details. We&apos;ll use this information to send booking confirmations
                  and consultation links.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor={fullNameId} className="font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id={fullNameId}
                    value={bookingForm.fullName}
                    onChange={e => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className={`mt-1 border-gray-300 bg-white text-gray-900 ${
                      formErrors.fullName ? "border-red-500" : "focus:border-blue-500"
                    }`}
                  />
                  {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor={emailId} className="font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id={emailId}
                    type="email"
                    value={bookingForm.email}
                    onChange={e => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className={`mt-1 border-gray-300 bg-white text-gray-900 ${
                      formErrors.email ? "border-red-500" : "focus:border-blue-500"
                    }`}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor={phoneId} className="font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id={phoneId}
                    type="tel"
                    value={bookingForm.phone}
                    onChange={e => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1 border-gray-300 bg-white text-gray-900 focus:border-blue-500"
                  />
                </div>

                <div>
                  <Label className="font-medium text-gray-700">Consultation Type</Label>
                  <Select
                    value={bookingForm.consultationType}
                    onValueChange={(value: "phone" | "video" | "in-person") =>
                      handleInputChange("consultationType", value)
                    }>
                    <SelectTrigger className="mt-1 border-gray-300 bg-white text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200 bg-white">
                      <SelectItem value="video" className="text-gray-900 hover:bg-gray-50">
                        Video Call
                      </SelectItem>
                      <SelectItem value="phone" className="text-gray-900 hover:bg-gray-50">
                        Phone Call
                      </SelectItem>
                      <SelectItem value="in-person" className="text-gray-900 hover:bg-gray-50">
                        In-Person
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="caseDescription" className="font-medium text-gray-700">
                    Case Description *
                  </Label>
                  <p className="mt-1 mb-2 text-xs text-gray-500">
                    Provide a brief overview of your legal matter. This helps the lawyer prepare for your consultation.
                    (Minimum 10 characters)
                  </p>
                  <Textarea
                    id={caseDescriptionId}
                    value={bookingForm.caseDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange("caseDescription", e.target.value)
                    }
                    placeholder="Example: I need help with a contract review for a business partnership agreement. The contract involves profit sharing and liability terms that I want to ensure are fair and legally sound."
                    rows={4}
                    className={`mt-1 border-gray-300 bg-white text-gray-900 ${
                      formErrors.caseDescription ? "border-red-500" : "focus:border-blue-500"
                    }`}
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {formErrors.caseDescription && <p className="text-sm text-red-600">{formErrors.caseDescription}</p>}
                    <p className="ml-auto text-xs text-gray-400">{bookingForm.caseDescription.length}/500 characters</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === "confirmation" && (
            <div className="space-y-4">
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg text-gray-900">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 bg-white p-6">
                  <div className="flex justify-between border-b border-gray-50 py-2">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{new Date(bookingForm.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-2">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">{bookingForm.timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-2">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{bookingForm.duration} minutes</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-2">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {bookingForm.consultationType.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-2">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium text-gray-900">{bookingForm.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{bookingForm.email}</span>
                  </div>
                  {selectedPackage && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium text-gray-900">{selectedPackage}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 border-t border-gray-100 pt-4">
            {currentStep !== "datetime" && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Back
              </Button>
            )}

            {currentStep === "confirmation" ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === "datetime" && !isDateTimeComplete) ||
                  (currentStep === "details" && !isDetailsComplete)
                }
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
