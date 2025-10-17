"use client";

import { ArrowUp, Mic, Paperclip, StopCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createUploadingFile,
  FileUploadProgress,
  simulateFileUpload,
  type UploadingFile,
} from "./file-upload-progress";

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, placeholder = "Type your message...", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [completedFiles, setCompletedFiles] = useState<File[]>([]);

  // Debug logging for state changes
  console.log("🔍 ChatInput state:", {
    uploadingFilesCount: uploadingFiles.length,
    completedFilesCount: completedFiles.length,
    completedFiles: completedFiles.map(f => ({ name: f.name, size: f.size })),
  });
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() || completedFiles.length > 0) {
      // Validate files before sending
      const validFiles = completedFiles.filter(file => file instanceof File && file.size > 0 && file.name.length > 0);

      console.log("📎 Files being sent from ChatInput:", {
        originalCount: completedFiles.length,
        validCount: validFiles.length,
        files: validFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });

      if (validFiles.length !== completedFiles.length) {
        console.warn("⚠️ Some files were filtered out due to validation");
      }

      onSendMessage(message.trim(), validFiles);
      setMessage("");
      setCompletedFiles([]);
      setUploadingFiles([]);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    console.log(
      "📁 Files selected:",
      selectedFiles.map(f => ({ name: f.name, size: f.size }))
    );

    // Validate file sizes before processing
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(", ");
      const fileSizes = oversizedFiles.map(f => `${(f.size / (1024 * 1024)).toFixed(2)}MB`).join(", ");
      alert(`File(s) too large: ${fileNames} (${fileSizes}). Please choose files smaller than 5MB.`);
      return;
    }

    // Create uploading file objects and start upload simulation
    const newUploadingFiles = selectedFiles.map(file => {
      const uploadingFile = createUploadingFile(file);

      // Start upload simulation
      simulateFileUpload(
        uploadingFile,
        updatedFile => {
          setUploadingFiles(prev => prev.map(f => (f.id === updatedFile.id ? updatedFile : f)));
        },
        fileId => {
          // Move to completed files when upload is done
          setUploadingFiles(prev => {
            const file = prev.find(f => f.id === fileId)?.file;
            if (file) {
              // Check if file already exists in completedFiles to prevent duplicates
              setCompletedFiles(completedPrev => {
                const fileExists = completedPrev.some(
                  f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                );
                console.log("📁 Moving file to completed:", {
                  fileName: file.name,
                  fileSize: file.size,
                  lastModified: file.lastModified,
                  fileExists,
                  currentCompletedCount: completedPrev.length,
                });
                if (!fileExists) {
                  return [...completedPrev, file];
                } else {
                  console.warn("⚠️ File already exists in completedFiles, skipping duplicate");
                }
                return completedPrev;
              });
            }
            return prev;
          });

          // Remove from uploading files after a delay to show completion
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
          }, 2000);
        }
      );

      return uploadingFile;
    });

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Reset file input to prevent duplicate selections
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    console.log(
      "📁 Uploading files updated:",
      newUploadingFiles.map(f => ({
        id: f.id,
        name: f.file.name,
        size: f.file.size,
      }))
    );
  };

  const removeUploadingFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const removeCompletedFile = (index: number) => {
    setCompletedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  return (
    <div className="space-y-3">
      {/* File Upload Progress */}
      {uploadingFiles.length > 0 && <FileUploadProgress files={uploadingFiles} onRemoveFile={removeUploadingFile} />}

      {/* Completed File Attachments Preview - Only show when no uploading files */}
      {completedFiles.length > 0 && uploadingFiles.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {completedFiles.map((file, index) => (
            <div
              key={index}
              className="bg-sky-blue-50 flex items-center gap-2 rounded-lg border border-sky-blue-200 px-3 py-2 text-sm">
              <Paperclip className="size-4 text-sky-blue-600" />
              <span className="max-w-32 truncate text-slate-gray-700">{file.name}</span>
              <button
                type="button"
                onClick={() => removeCompletedFile(index)}
                className="text-slate-gray-400 transition-colors hover:text-slate-gray-600">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="relative rounded-3xl border border-neutral-100 bg-white shadow-lg transition-all focus-within:shadow-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Text Input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="max-h-[120px] min-h-[24px] flex-1 resize-none border-0 bg-transparent p-0 leading-6 text-slate-gray-800 placeholder:text-slate-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />

          {/* Action Buttons Container */}
          <div className="flex shrink-0 items-center gap-2">
            {/* File Upload Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 rounded-xl hover:bg-neutral-100"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}>
              <Paperclip className="size-5 text-slate-gray-500" />
            </Button>

            {/* Voice Recording Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-10 rounded-xl",
                isRecording ? "bg-brand-rose text-white hover:bg-brand-rose/90" : "hover:bg-neutral-100"
              )}
              onClick={toggleRecording}
              disabled={disabled}>
              {isRecording ? <StopCircle className="size-5" /> : <Mic className="size-5 text-slate-gray-500" />}
            </Button>

            {/* Send Button */}
            <Button
              type="button"
              size="icon"
              className={cn(
                "size-10 rounded-full shadow-sm transition-all",
                message.trim() || completedFiles.length > 0
                  ? "bg-deep-navy text-white hover:bg-deep-navy/90"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400 hover:bg-neutral-200"
              )}
              onClick={handleSubmit}
              disabled={disabled || (!message.trim() && completedFiles.length === 0)}>
              <ArrowUp className="size-5" />
            </Button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
          title="Upload files (max 5MB each)"
        />
      </div>
    </div>
  );
}
