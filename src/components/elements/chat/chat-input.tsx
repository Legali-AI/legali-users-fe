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
import { FileUploadMenu } from "./file-upload-menu";

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, placeholder = "Type your message...", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [completedFiles, setCompletedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() || completedFiles.length > 0) {
      onSendMessage(message.trim(), completedFiles);
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

  const handleFilesSelected = (selectedFiles: File[]) => {
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
              setCompletedFiles(completedPrev => [...completedPrev, file]);
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
            {/* File Upload Menu */}
            <FileUploadMenu onFilesSelected={handleFilesSelected} disabled={disabled} />

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
      </div>
    </div>
  );
}
