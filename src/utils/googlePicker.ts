/**
 * Google Picker Utility
 * Handles loading and initializing Google Picker API for file selection
 */

// Type definitions for Google Picker API
declare global {
  interface Window {
    google?: {
      picker: {
        api: {
          load: (callback: () => void) => void;
          setVisible: (visible: boolean) => void;
        };
        Action: {
          PICKED: string;
          CANCEL: string;
        };
        DocsView: new (viewId?: string) => any;
        DocsUploadView: new () => any;
        PickerBuilder: new () => any;
        ViewId: {
          DOCS: string;
          DOCUMENTS: string;
          SPREADSHEETS: string;
          PRESENTATIONS: string;
          FORMS: string;
          FOLDERS: string;
          PDFS: string;
          PHOTOS: string;
          DOCS_IMAGES: string;
          DOCS_VIDEOS: string;
        };
        Feature: {
          MULTISELECT_ENABLED: string;
          NAV_HIDDEN: string;
          MINE_ONLY: string;
        };
      };
    };
    gapi?: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        authorize: (
          params: {
            client_id: string;
            scope: string;
            immediate: boolean;
          },
          callback: (response: any) => void
        ) => void;
      };
    };
  }
}

export interface SelectedFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  iconUrl: string;
  thumbnailUrl?: string;
  sizeBytes?: number;
}

export interface GooglePickerOptions {
  accessToken: string;
  apiKey: string;
  clientId: string;
  multiSelect?: boolean;
  viewId?: string;
  title?: string;
  locale?: string;
  onPicked: (files: SelectedFile[]) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

let pickerApiLoaded = false;
let gapiLoaded = false;

/**
 * Load Google Picker API script
 */
export const loadGooglePickerScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (pickerApiLoaded && window.google?.picker) {
      resolve();
      return;
    }

    // Load Google API script
    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        gapiLoaded = true;
        loadPickerApi(resolve, reject);
      };
      script.onerror = () => reject(new Error("Failed to load Google API script"));
      document.body.appendChild(script);
    } else {
      gapiLoaded = true;
      loadPickerApi(resolve, reject);
    }
  });
};

/**
 * Load Picker API using gapi
 */
const loadPickerApi = (resolve: () => void, reject: (error: Error) => void) => {
  if (!window.gapi) {
    reject(new Error("Google API not available"));
    return;
  }

  window.gapi.load("picker", {
    callback: () => {
      pickerApiLoaded = true;
      resolve();
    },
    onerror: () => reject(new Error("Failed to load Picker API")),
    timeout: 5000,
    ontimeout: () => reject(new Error("Picker API load timeout")),
  });
};

/**
 * Create and display Google Picker
 */
export const createGooglePicker = (options: GooglePickerOptions): void => {
  const {
    accessToken,
    apiKey,
    clientId,
    multiSelect = true,
    viewId,
    title = "Select files from Google Drive",
    locale = "en",
    onPicked,
    onCancel,
    onError,
  } = options;

  if (!window.google?.picker) {
    const error = new Error("Google Picker API not loaded");
    onError?.(error);
    return;
  }

  try {
    // Create view
    let view: any;
    if (viewId) {
      view = new window.google.picker.DocsView(viewId);
    } else {
      // Default view showing all Drive files
      view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS);
    }

    view.setIncludeFolders(true);
    view.setMode(window.google.picker.DocsView.GRID);

    // Build picker with branding
    const pickerBuilder = new window.google.picker.PickerBuilder()
      .setAppId(clientId.split('-')[0]) // Extract app ID from client ID
      .setOAuthToken(accessToken)
      .setDeveloperKey(apiKey)
      .setCallback(pickerCallback)
      .addView(view)
      .setTitle(title)
      .setLocale(locale)
      .setSize(1051, 650); // Optimal size for picker modal

    // Enable multi-select if requested
    if (multiSelect) {
      pickerBuilder.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
    }

    const picker = pickerBuilder.build();
    picker.setVisible(true);

    // Picker callback handler
    function pickerCallback(data: any) {
      if (data.action === window.google!.picker.Action.PICKED) {
        const files: SelectedFile[] = data.docs.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          mimeType: doc.mimeType,
          url: doc.url,
          iconUrl: doc.iconUrl,
          thumbnailUrl: doc.thumbnailUrl,
          sizeBytes: doc.sizeBytes ? parseInt(doc.sizeBytes) : undefined,
        }));
        onPicked(files);
      } else if (data.action === window.google!.picker.Action.CANCEL) {
        onCancel?.();
      }
    }
  } catch (error) {
    const pickerError = error instanceof Error ? error : new Error("Failed to create picker");
    onError?.(pickerError);
  }
};

/**
 * Open Google Picker (combines loading and creating)
 * @param options GooglePickerOptions
 * @returns Promise that resolves when picker is closed
 */
export const openGooglePicker = async (
  options: GooglePickerOptions
): Promise<void> => {
  try {
    // Load the picker API if not already loaded
    await loadGooglePickerScript();

    // Create and show the picker
    createGooglePicker(options);
  } catch (error) {
    const pickerError = error instanceof Error ? error : new Error("Failed to open picker");
    options.onError?.(pickerError);
    throw pickerError;
  }
};

/**
 * Check if Google Picker API is loaded
 */
export const isPickerApiLoaded = (): boolean => {
  return pickerApiLoaded && !!window.google?.picker;
};

/**
 * Unload Google Picker (cleanup)
 */
export const unloadGooglePicker = (): void => {
  pickerApiLoaded = false;
  gapiLoaded = false;
  // Note: We don't remove the scripts as they might be used elsewhere
};
