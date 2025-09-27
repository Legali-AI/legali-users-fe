"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { H5, Span } from "../typography";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "This action can't be undone. Delete anyway?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Span level="h5" weight="semibold">
              {title}
            </Span>
          </AlertDialogTitle>
          {description && (
            <div className="mt-2">
              <Span level="body" className="text-slate-gray-400">
                {description}
              </Span>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full flex-row items-center justify-between gap-5 p-0">
          <AlertDialogCancel>
            <H5 level="body" weight="semibold" className="text-slate-gray-400">
              {cancelText}
            </H5>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            <H5 level="body" weight="semibold" className="text-white">
              {confirmText}
            </H5>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
