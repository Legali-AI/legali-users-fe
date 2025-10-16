"use client";

import { ChevronDown, Cloud, HardDrive, Loader2, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { googleDocsService } from "@/services/google-docs.service";
import { getAccessToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { openGooglePicker, type SelectedFile } from "@/utils/googlePicker";

interface FileUploadMenuProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  variant?: "icon" | "button";
  buttonText?: string;
}

export function FileUploadMenu({
  onFilesSelected,
  disabled = false,
  className,
  variant = "icon",
  buttonText = "Add photos and files",
}: FileUploadMenuProps) {
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGoogleDriveSelect = async () => {
    setError(null);
    setIsLoadingDrive(true);

    try {
      // Check if user is authenticated with Legali
      const accessToken = getAccessToken();
      if (!accessToken) {
        setError("Please sign in to access Google Drive");
        setIsLoadingDrive(false);
        return;
      }

      // Check Google auth status
      const authStatus = await googleDocsService.getAuthStatus();

      if (!authStatus.isAuthenticated) {
        // Redirect to Google OAuth
        console.log("🔐 Redirecting to Google OAuth...");
        const authUrl = await googleDocsService.initiateAuth();
        window.location.href = authUrl;
        return;
      }

      // Get Google config (API key and Google OAuth token)
      const config = await googleDocsService.getGoogleConfig();

      if (!config.googleAccessToken) {
        setError("Google authentication required. Redirecting...");
        // Redirect to Google OAuth after a short delay
        setTimeout(async () => {
          const authUrl = await googleDocsService.initiateAuth();
          window.location.href = authUrl;
        }, 1500);
        return;
      }

      // Get OAuth client ID from env
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error("Google Client ID not configured");
      }

      // Open Google Picker
      await openGooglePicker({
        accessToken: config.googleAccessToken,
        apiKey: config.googleApiKey,
        clientId,
        multiSelect: true,
        title: "Select files from Google Drive",
        onPicked: async (selectedFiles: SelectedFile[]) => {
          setIsLoadingDrive(true);
          try {
            // Download selected files
            const downloadedFiles = await Promise.all(
              selectedFiles.map(async file => {
                return await googleDocsService.downloadDriveFileAsFile(file.id, file.name, file.mimeType);
              })
            );

            onFilesSelected(downloadedFiles);
          } catch (downloadError) {
            console.error("Failed to download files:", downloadError);
            setError("Failed to download files from Google Drive");
          } finally {
            setIsLoadingDrive(false);
          }
        },
        onCancel: () => {
          setIsLoadingDrive(false);
        },
        onError: error => {
          console.error("Google Picker error:", error);
          setError(error.message || "Failed to open Google Drive picker");
          setIsLoadingDrive(false);
        },
      });
    } catch (err) {
      console.error("Google Drive error:", err);
      setError(err instanceof Error ? err.message : "Failed to access Google Drive");
      setIsLoadingDrive(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {variant === "icon" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 rounded-xl hover:bg-neutral-100"
              disabled={disabled || isLoadingDrive}
              aria-label="Add files">
              {isLoadingDrive ? (
                <Loader2 className="size-5 animate-spin text-slate-gray-500" />
              ) : (
                <Paperclip className="size-5 text-slate-gray-500" />
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-2"
              disabled={disabled || isLoadingDrive}
              aria-label="Add files">
              {isLoadingDrive ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Paperclip className="size-5" />
              )}
              <span className="text-black">{buttonText}</span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer gap-3 py-3"
            disabled={disabled}>
            <HardDrive className="size-5 text-slate-gray-600" />
            <div className="flex flex-col">
              <span className="font-medium">From Computer</span>
              <span className="text-xs text-slate-gray-500">Upload local files</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleGoogleDriveSelect}
            className="cursor-pointer gap-3 py-3"
            disabled={disabled || isLoadingDrive}>
            <Cloud className="size-5 text-sky-blue-600" />
            <div className="flex flex-col">
              <span className="font-medium">From Google Drive</span>
              <span className="text-xs text-slate-gray-500">Select from your Drive</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden File Input for Local Files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.doc,.docx,.txt"
        onChange={handleLocalFileSelect}
        className="hidden"
      />

      {/* Error Toast */}
      {error && (
        <div className="absolute bottom-full left-0 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold hover:text-red-900">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
