"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp, Mic, Paperclip, StopCircle } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message.trim(), files);
      setMessage("");
      setFiles([]);

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
    setFiles(prev => [...prev, ...selectedFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
      {/* File Attachments Preview */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-sky-blue-50 flex items-center gap-2 rounded-lg border border-sky-blue-200 px-3 py-2 text-sm"
            >
              <Paperclip className="size-4 text-sky-blue-600" />
              <span className="max-w-32 truncate text-slate-gray-700">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-gray-400 transition-colors hover:text-slate-gray-600"
              >
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
              disabled={disabled}
            >
              <Paperclip className="size-5 text-slate-gray-500" />
            </Button>

            {/* Voice Recording Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-10 rounded-xl",
                isRecording
                  ? "bg-brand-rose text-white hover:bg-brand-rose/90"
                  : "hover:bg-neutral-100"
              )}
              onClick={toggleRecording}
              disabled={disabled}
            >
              {isRecording ? (
                <StopCircle className="size-5" />
              ) : (
                <Mic className="size-5 text-slate-gray-500" />
              )}
            </Button>

            {/* Send Button */}
            <Button
              type="button"
              size="icon"
              className={cn(
                "size-10 rounded-full shadow-sm transition-all",
                message.trim() || files.length > 0
                  ? "bg-deep-navy text-white hover:bg-deep-navy/90"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400 hover:bg-neutral-200"
              )}
              onClick={handleSubmit}
              disabled={disabled || (!message.trim() && files.length === 0)}
            >
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
        />
      </div>
    </div>
  );
}
