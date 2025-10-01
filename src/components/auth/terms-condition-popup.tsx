"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsConditionsPopupProps {
  // children: React.ReactNode;
  onAccept: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TermsConditionsPopup({
  // children,
  onAccept,
  open,
  onOpenChange,
}: TermsConditionsPopupProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleAccept = () => {
    if (isConfirmed) {
      onAccept();
      setIsOpen(false);
      setIsConfirmed(false); // Reset for next time
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsConfirmed(false); // Reset for next time
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent className="max-h-[90vh] max-w-4xl gap-0 overflow-hidden p-0" showCloseButton={false}>
        <div className="flex h-[90vh] flex-col">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <DialogTitle className="mb-3 text-3xl font-bold text-gray-900">Legali Terms of Service</DialogTitle>
            <p className="text-base text-gray-600">Effective Date: September 28, 2025</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-8 pb-4">
              <div className="pr-4">
                {" "}
                {/* Extra padding for scrollbar */}
                <div className="space-y-6 text-gray-700">
                  <p className="text-base leading-relaxed">
                    Welcome to Legali. Please read these Terms of Service carefully before using our platform.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-4 text-lg font-semibold text-gray-900">1. Agreement to Terms</h2>
                      <div className="space-y-4 text-base leading-relaxed">
                        <p>
                          By accessing or using our website, mobile application, or any related services (collectively,
                          the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you disagree
                          with any part of these Terms, you may not access or use the Services.
                        </p>
                        <p>
                          <span className="font-semibold">Important:</span> These Terms contain a binding arbitration
                          clause and class action waiver in Section 14, which affect your legal rights. Please review
                          them carefully.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="mb-4 text-lg font-semibold text-gray-900">2. Description of Services</h2>
                      <div className="space-y-4 text-base leading-relaxed">
                        <p>Legali provides an online platform offering:</p>
                        <ul className="ml-6 space-y-3">
                          <li className="flex items-start">
                            <span className="mt-2.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600"></span>
                            <span>Automated legal document generation and templates</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mt-2.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600"></span>
                            <span>Legal information and educational resources</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mt-2.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600"></span>
                            <span>Document analysis and red-flag identification tools</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mt-2.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600"></span>
                            <span>Legal research and analytic capabilities</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mt-2.5 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600"></span>
                            <span>Access to a network of licensed attorneys (where applicable)</span>
                          </li>
                        </ul>
                        <p>
                          Legali is a technology platform, not a law firm. We do not provide legal advice, opinions, or
                          recommendations. The information and documents provided through our Services are for
                          informational purposes only and should not be considered legal advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-8 py-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms-confirmation"
                  checked={isConfirmed}
                  onCheckedChange={checked => setIsConfirmed(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:border-gray-600 data-[state=checked]:bg-gray-600"
                />
                <label
                  htmlFor="terms-confirmation"
                  className="cursor-pointer text-sm leading-relaxed font-medium text-gray-900">
                  I confirm that I have read and accept the terms and conditions and privacy policy.
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-shrink-0 gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 px-8 py-2 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
                <Button
                  variant="black"
                  onClick={handleAccept}
                  disabled={!isConfirmed}
                  className={`px-8 py-2 font-medium text-white ${isConfirmed ? "" : "cursor-not-allowed"}`}>
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
