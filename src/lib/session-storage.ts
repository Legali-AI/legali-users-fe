/**
 * Helper functions to store and retrieve message payload with files in sessionStorage
 */

export interface StoredMessagePayload {
  text: string;
  files: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    content: string; // base64 encoded
  }[];
  audioBlob?: {
    type: string;
    size: number;
    content: string; // base64 encoded
  } | null;
  audioUrl?: string | null;
}

const PENDING_MESSAGE_KEY = 'legali_pending_message';

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert Blob to base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert base64 string back to File
 */
function base64ToFile(base64: string, name: string, type: string, lastModified: number): File {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type });
  return new File([blob], name, { type, lastModified });
}

/**
 * Convert base64 string back to Blob
 */
function base64ToBlob(base64: string, type: string): Blob {
  const byteString = atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type });
}

/**
 * Store message payload with files in sessionStorage
 */
export async function storePendingMessage(payload: {
  text: string;
  files: File[];
  audioBlob?: Blob | null;
  audioUrl?: string | null;
}): Promise<void> {
  try {
    // Serialize files
    const serializedFiles = await Promise.all(
      payload.files.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        content: await fileToBase64(file),
      }))
    );

    // Serialize audio blob if present
    let serializedAudioBlob = null;
    if (payload.audioBlob) {
      serializedAudioBlob = {
        type: payload.audioBlob.type,
        size: payload.audioBlob.size,
        content: await blobToBase64(payload.audioBlob),
      };
    }

    const storedPayload: StoredMessagePayload = {
      text: payload.text,
      files: serializedFiles,
      audioBlob: serializedAudioBlob,
      audioUrl: payload.audioUrl,
    };

    sessionStorage.setItem(PENDING_MESSAGE_KEY, JSON.stringify(storedPayload));
  } catch (error) {
    console.error('Failed to store pending message:', error);
    throw error;
  }
}

/**
 * Retrieve and reconstruct message payload from sessionStorage
 */
export function getPendingMessage(): {
  text: string;
  files: File[];
  audioBlob?: Blob | null;
  audioUrl?: string | null;
} | null {
  try {
    const stored = sessionStorage.getItem(PENDING_MESSAGE_KEY);
    if (!stored) {
      return null;
    }

    const payload: StoredMessagePayload = JSON.parse(stored);

    // Reconstruct File objects
    const files = payload.files.map((fileData) =>
      base64ToFile(fileData.content, fileData.name, fileData.type, fileData.lastModified)
    );

    // Reconstruct audio blob if present
    let audioBlob = null;
    if (payload.audioBlob) {
      audioBlob = base64ToBlob(payload.audioBlob.content, payload.audioBlob.type);
    }

    return {
      text: payload.text,
      files,
      audioBlob,
      audioUrl: payload.audioUrl,
    };
  } catch (error) {
    console.error('Failed to retrieve pending message:', error);
    return null;
  }
}

/**
 * Clear pending message from sessionStorage
 */
export function clearPendingMessage(): void {
  try {
    sessionStorage.removeItem(PENDING_MESSAGE_KEY);
  } catch (error) {
    console.error('Failed to clear pending message:', error);
  }
}
