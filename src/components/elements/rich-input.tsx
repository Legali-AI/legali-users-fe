"use client";

import { Mic, Paperclip, Send, StopCircle } from "lucide-react";
import * as React from "react";
import {
  createUploadingFile,
  FileUploadProgress,
  simulateFileUpload,
  type UploadingFile,
} from "@/components/elements/chat/file-upload-progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "./typography";

export interface RichInputPayload {
  text: string;
  files: File[];
  audioBlob?: Blob | null;
  audioUrl?: string | null;
}

export interface RichInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: (payload: RichInputPayload) => void;
  droppedFiles?: File[];
  onClearDroppedFiles?: () => void;
}

export default function RichInput({
  placeholder = "Describe your legal issues. Legali listens, organizes, and asks the right questions to build your strongest case.",
  disabled = false,
  onSubmit,
  droppedFiles = [],
  onClearDroppedFiles,
}: RichInputProps) {
  const [text, setText] = React.useState("");
  const [uploadingFiles, setUploadingFiles] = React.useState<UploadingFile[]>([]);
  const [completedFiles, setCompletedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [recordMs, setRecordMs] = React.useState<number>(0);
  const timerRef = React.useRef<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const preferredMimeTypeRef = React.useRef<string | undefined>(undefined);

  const latestUrlRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    latestUrlRef.current = audioUrl;
  }, [audioUrl]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (latestUrlRef.current) URL.revokeObjectURL(latestUrlRef.current);
    };
  }, []);

  // Handle dropped files from drag and drop
  React.useEffect(() => {
    if (droppedFiles.length > 0) {
      // Process dropped files through upload simulation
      const newUploadingFiles = droppedFiles.map(file => {
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
                setCompletedFiles(completedPrev => {
                  const fileExists = completedPrev.some(
                    f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                  );
                  if (!fileExists) {
                    return [...completedPrev, file];
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

      // Clear dropped files from parent
      if (onClearDroppedFiles) {
        onClearDroppedFiles();
      }
    }
  }, [droppedFiles, onClearDroppedFiles]);

  const handlePickFiles = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFilesSelected: React.ChangeEventHandler<HTMLInputElement> = e => {
    const list = e.target.files;
    if (!list) return;
    const selectedFiles = Array.from(list);

    // Process files through upload simulation
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
              setCompletedFiles(completedPrev => {
                const fileExists = completedPrev.some(
                  f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
                );
                if (!fileExists) {
                  return [...completedPrev, file];
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

    // reset input to allow re-selecting the same file
    e.currentTarget.value = "";
  };

  const startRecording = async () => {
    if (disabled || isRecording) return;
    try {
      // Request microphone access with basic constraints
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true },
      });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      // Choose a supported mime type for better playback compatibility
      const candidates = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/webm"];
      let chosen: string | undefined;
      for (const t of candidates) {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) {
          chosen = t;
          break;
        }
      }
      preferredMimeTypeRef.current = chosen;

      const mediaRecorder = new MediaRecorder(stream, chosen ? { mimeType: chosen } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: preferredMimeTypeRef.current ?? "audio/webm",
        });
        setAudioBlob(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        chunksRef.current = [];
        // Stop all tracks
        if (mediaStreamRef.current) {
          for (const track of mediaStreamRef.current.getTracks()) {
            track.stop();
          }
        }
        mediaStreamRef.current = null;
      };

      setRecordMs(0);
      setIsRecording(true);
      mediaRecorder.start();
      timerRef.current = window.setInterval(() => {
        setRecordMs(prev => prev + 1000);
      }, 1000);
    } catch {
      // Permission denied or unsupported
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const clearRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordMs(0);
  };

  const removeUploadingFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const removeCompletedFile = (index: number) => {
    setCompletedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (disabled) return;
    const payload: RichInputPayload = {
      text: text.trim(),
      files: completedFiles,
      audioBlob,
      audioUrl,
    };
    onSubmit?.(payload);
    // reset
    setText("");
    setCompletedFiles([]);
    setUploadingFiles([]);
    clearRecording();
  };

  const formatMs = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(total % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex w-full flex-col items-start justify-between gap-4 rounded-[20px] bg-white p-4 shadow-xl">
      {/* Text input */}
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="focus-visible:outline-non min-h-20 resize-y border-none shadow-none placeholder:text-[14px] placeholder:text-slate-gray-300 focus-visible:border-none focus-visible:ring-0 lg:placeholder:text-base"
      />

      {/* Footer row */}
      <div className="flex w-full items-start justify-between gap-4 md:gap-8 lg:gap-12 xl:gap-16">
        {/* Add files */}
        <div>
          <Button type="button" size={"lg"} variant="outline" onClick={handlePickFiles} disabled={disabled}>
            <span className="flex items-center gap-2">
              <Typography level="body" className="text-black">
                Add photos and files
              </Typography>
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
        </div>

        {/* Right controls */}
        <div className="flex items-center justify-end gap-2">
          {/* Record / Stop */}
          {!isRecording ? (
            <Button
              type="button"
              onClick={startRecording}
              disabled={disabled}
              variant={"ghost"}
              size={"icon"}
              className="h-10 w-10 rounded-full"
              aria-label="Start recording">
              <Mic className="h-10 w-10 text-deep-navy" size={52} />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={stopRecording}
              aria-label="Stop recording"
              size={"icon"}
              className="h-10 w-10 rounded-full"
              variant={"destructive"}>
              <StopCircle className="h-10 w-10 text-white" />
            </Button>
          )}

          {/* Submit */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || (!text.trim() && completedFiles.length === 0 && !audioBlob)}
            className="h-10 w-10 rounded-full"
            aria-label="Send">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* File Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mt-2">
          <FileUploadProgress files={uploadingFiles} onRemoveFile={removeUploadingFile} />
        </div>
      )}

      {/* Completed File Attachments Preview - Only show when no uploading files */}
      {completedFiles.length > 0 && uploadingFiles.length === 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
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

      {/* Recording status or playback */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-3 rounded-md border border-input px-3 py-2">
          <div className="flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <Typography level="label" className="text-muted-foreground">
            Recording... {formatMs(recordMs)}
          </Typography>
        </div>
      )}

      {!!audioBlob && audioUrl && (
        <div className="mt-2 flex w-full items-center gap-3 rounded-md border border-input px-3 py-2">
          {/* Visible audio element for playback */}
          <audio ref={audioRef} src={audioUrl} controls className="max-w-full" aria-label="Recorded audio preview">
            <track kind="captions" />
          </audio>
        </div>
      )}
    </div>
  );
}
