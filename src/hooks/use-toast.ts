type ToastVariant = "default" | "destructive";

interface Toast {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const toast = (toast: Toast) => {
    // Simple alert implementation - in a real app you'd use a proper toast library
    const message = `${toast.title}${toast.description ? `\n${toast.description}` : ""}`;
    if (toast.variant === "destructive") {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  };

  return { toast };
}
