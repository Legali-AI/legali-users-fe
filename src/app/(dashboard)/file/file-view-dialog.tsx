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
      <DialogContent showCloseButton={true}>
        <DialogHeader className="space-y-5">
          {/* File Name */}
          <DialogTitle>
            <Span level="h5" weight="semibold">
              {fileName}
            </Span>
          </DialogTitle>

          {/* View PDF Button */}
          <Button
            variant="outline"
            onClick={onViewPDF}
            className="h-[39px] w-[113px] rounded-[100px] border border-white-400 bg-white px-5"
          >
            <P level="body" className="text-slate-gray">
              View PDF
            </P>
          </Button>
        </DialogHeader>

        {/* AI Summary Section */}
        <div className="space-y-[10px]">
          {/* AI Summary Header */}
          <div className="flex items-center gap-[10px]">
            <Sparkles size={20} className="text-deep-navy" />
            <P level="body" weight="semibold">
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
