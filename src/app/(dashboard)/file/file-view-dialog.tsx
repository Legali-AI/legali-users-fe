"use client";

import { X } from "lucide-react";
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
  aiSummary: string;
  onViewPDF?: () => void;
}

export function FileViewDialog({
  isOpen,
  onClose,
  fileName,
  aiSummary,
  onViewPDF,
}: FileViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[793px] rounded-[10px] border border-white-400 bg-white p-5"
        showCloseButton={true}
      >
        <DialogHeader className="space-y-5">
          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-[14px] w-[14px] p-0"
            >
              <X className="text-slate-gray h-[14px] w-[14px]" />
            </Button>
          </div>

          {/* File Name */}
          <DialogTitle className="flex items-center justify-center">
            <Span level="h5" weight="semibold" className="text-deep-navy">
              {fileName}
            </Span>
          </DialogTitle>

          {/* View PDF Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onViewPDF}
              className="h-[39px] w-[113px] rounded-[100px] border border-white-400 bg-white px-5"
            >
              <P level="body" className="text-slate-gray">
                View PDF
              </P>
            </Button>
          </div>
        </DialogHeader>

        {/* AI Summary Section */}
        <div className="space-y-[10px]">
          {/* AI Summary Header */}
          <div className="flex items-center gap-[10px]">
            <div className="h-[20px] w-[18px] rounded bg-deep-navy" />
            <P level="body" weight="semibold" className="text-deep-navy">
              AI Summary
            </P>
          </div>

          {/* AI Summary Content */}
          <div className="rounded-[10px] border border-white-400 bg-white p-6">
            <P level="body" weight="semibold" className="text-slate-gray">
              {aiSummary}
            </P>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
