"use client";

import { Sparkles } from "lucide-react";
import { P, Span } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface FileViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  aiSummary?: string | null;
  processing?: boolean;
  onViewPDF?: () => void;
}

export function FileViewDialog({
  isOpen,
  onClose,
  fileName,
  aiSummary,
  processing = false,
  onViewPDF,
}: FileViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={true}
        className="max-w-[90vw] sm:max-w-[600px] lg:max-w-[700px]"
      >
        <DialogHeader className="space-y-3 lg:space-y-5">
          {/* File Name */}
          <DialogTitle>
            <Span level="h5" weight="semibold" className="break-words">
              {fileName}
            </Span>
          </DialogTitle>

          {/* View PDF Button */}
          <Button
            variant="outline"
            onClick={onViewPDF}
            className="h-[39px] w-full rounded-[100px] border border-white-400 bg-white px-5 sm:w-[113px]"
          >
            <P level="body" className="text-slate-gray">
              View PDF
            </P>
          </Button>
        </DialogHeader>

        {/* AI Summary Section */}
        <div className="space-y-2 lg:space-y-[10px]">
          {/* AI Summary Header */}
          <div className="flex items-center gap-2 lg:gap-[10px]">
            <Sparkles size={18} className="text-deep-navy lg:h-5 lg:w-5" />
            <P level="body" weight="semibold">
              AI Summary
            </P>
          </div>

          {/* AI Summary Content */}
          <div className="rounded-[10px] border border-white-400 bg-white p-4 lg:p-6">
            {processing ? (
              <P
                level="body"
                weight="semibold"
                className="text-slate-gray break-words"
              >
                Processing summary... please check back shortly.
              </P>
            ) : aiSummary ? (
              <P
                level="body"
                weight="semibold"
                className="text-slate-gray break-words"
              >
                {aiSummary}
              </P>
            ) : (
              <P
                level="body"
                weight="semibold"
                className="text-slate-gray break-words"
              >
                No summary yet.
              </P>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
