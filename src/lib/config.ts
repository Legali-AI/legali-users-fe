// API Configuration and Constants

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.legali.io",
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      SIGNIN: "/api/auth/signin",
      SIGNOUT: "/api/auth/signout",
      REFRESH: "/api/auth/refresh",
    },

    // Lawyer endpoints
    LAWYERS: "/lawyers",
    LAWYER_BY_ID: (id: string) => `/lawyers/${id}`,
    LAWYER_REVIEWS: (id: string) => `/lawyers/${id}/reviews`,
    FEATURED_LAWYERS: "/lawyers/featured",

    // Booking endpoints
    BOOKINGS: "/bookings",
    BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
    CREATE_BOOKING: "/bookings",

    // Client endpoints
    CLIENTS: "/clients",
    CLIENT_BY_ID: (id: string) => `/clients/${id}`,

    // Marketplace endpoints
    MARKETPLACE_LAWYERS: "/api/marketplaces/lawyers",
  },
  TIMEOUT: 120000, // 2 minutes timeout for chat API calls
};

export const APP_CONFIG = {
  // Development flags
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK === "true", // Enable by setting NEXT_PUBLIC_USE_MOCK="true"

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  // Other app constants
  SUPPORTED_LANGUAGES: ["English", "Indonesian", "Javanese"],
  DEFAULT_BOOKING_DURATION: 60, // minutes
};

export const QUERY_KEYS = {
  // Lawyer query keys
  LAWYERS: "lawyers",
  LAWYER_SEARCH: "lawyer-search",
  LAWYER_DETAILS: "lawyer-details",
  LAWYER_REVIEWS: "lawyer-reviews",
  FEATURED_LAWYERS: "featured-lawyers",

  // Booking query keys
  BOOKINGS: "bookings",
  BOOKING_DETAILS: "booking-details",
  USER_BOOKINGS: "user-bookings",
} as const;
