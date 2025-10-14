import { mockLawyers, mockReviews } from "@/data/mock-data";
import { api } from "@/lib/api-client";
import { API_CONFIG, APP_CONFIG } from "@/lib/config";
import type { Booking, Lawyer, MarketplaceLawyer, Review, SearchParams } from "@/types";

// Simulate API delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MARKETPLACE_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

let cachedMarketplaceLawyers: MarketplaceLawyer[] | null = null;
let lastMarketplaceFetch = 0;

// Response types for API
interface MarketplaceLawyerApi {
  id: string;
  name: string;
  practice_area: string[];
  min_price: number;
  max_price: number;
  about: string;
  city: string;
  avg_rating: string;
  total_review: number;
}

interface MarketplaceLawyerApiResponse {
  success: boolean;
  message?: string;
  data: MarketplaceLawyerApi[];
}

export interface LawyerSearchResponse {
  lawyers: MarketplaceLawyer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BookingResponse {
  booking: Booking;
  message?: string;
}

const normalizeMarketplaceLawyer = (lawyer: MarketplaceLawyerApi): MarketplaceLawyer => ({
  id: lawyer.id,
  name: lawyer.name,
  practiceAreas: Array.isArray(lawyer.practice_area) ? lawyer.practice_area : [],
  minPrice: Number.isFinite(lawyer.min_price) ? lawyer.min_price : 0,
  maxPrice: Number.isFinite(lawyer.max_price)
    ? lawyer.max_price
    : Number.isFinite(lawyer.min_price)
      ? lawyer.min_price
      : 0,
  about: lawyer.about ?? "",
  city: lawyer.city ?? "",
  avgRating: Number.parseFloat(lawyer.avg_rating ?? "0") || 0,
  totalReview: typeof lawyer.total_review === "number" ? lawyer.total_review : 0,
});

const mapMockLawyerToMarketplace = (lawyer: Lawyer): MarketplaceLawyer => ({
  id: lawyer.id,
  name: lawyer.name,
  practiceAreas: lawyer.specialties,
  minPrice: lawyer.hourlyRate,
  maxPrice: lawyer.hourlyRate,
  about: lawyer.bio,
  city: lawyer.jurisdiction[0] ?? "Unknown",
  avgRating: lawyer.rating,
  totalReview: lawyer.reviewCount,
});

async function fetchMarketplaceLawyers(): Promise<MarketplaceLawyer[]> {
  const now = Date.now();

  if (cachedMarketplaceLawyers && now - lastMarketplaceFetch < MARKETPLACE_CACHE_TTL) {
    return cachedMarketplaceLawyers;
  }

  const response = await api.get<MarketplaceLawyerApiResponse>(
    API_CONFIG.ENDPOINTS.MARKETPLACE_LAWYERS
  );

  if (!response.success) {
    throw new Error(response.message ?? "Failed to fetch marketplace lawyers");
  }

  if (!Array.isArray(response.data)) {
    throw new Error("Marketplace lawyers response is invalid");
  }

  const normalized = response.data.map(normalizeMarketplaceLawyer);

  cachedMarketplaceLawyers = normalized;
  lastMarketplaceFetch = now;

  return normalized;
}

function applyMarketplaceFilters(
  lawyers: MarketplaceLawyer[],
  params: SearchParams
): MarketplaceLawyer[] {
  const query = params.query?.toLowerCase().trim();
  const caseType = params.caseType?.toLowerCase().trim();
  const location = params.location?.toLowerCase().trim();
  const minimumRating =
    typeof params.rating === "number" && params.rating > 0 ? params.rating : undefined;
  const budgetMin =
    typeof params.budget?.min === "number" && params.budget?.min > 0
      ? params.budget.min
      : undefined;
  const budgetMax =
    typeof params.budget?.max === "number" && params.budget?.max > 0
      ? params.budget.max
      : undefined;

  return lawyers.filter(lawyer => {
    if (query) {
      const matchesQuery =
        lawyer.name.toLowerCase().includes(query) ||
        lawyer.about.toLowerCase().includes(query) ||
        lawyer.practiceAreas.some(area => area.toLowerCase().includes(query));

      if (!matchesQuery) {
        return false;
      }
    }

    if (caseType) {
      const matchesCaseType = lawyer.practiceAreas.some(area =>
        area.toLowerCase().includes(caseType)
      );
      if (!matchesCaseType) {
        return false;
      }
    }

    if (location) {
      const matchesLocation = lawyer.city.toLowerCase().includes(location);
      if (!matchesLocation) {
        return false;
      }
    }

    if (minimumRating !== undefined && lawyer.avgRating < minimumRating) {
      return false;
    }

    if (budgetMin !== undefined || budgetMax !== undefined) {
      const rangeMin = Number.isFinite(lawyer.minPrice) ? lawyer.minPrice : 0;
      const rangeMax =
        Number.isFinite(lawyer.maxPrice) && lawyer.maxPrice > 0 ? lawyer.maxPrice : rangeMin;

      if (budgetMin !== undefined && rangeMax < budgetMin) {
        return false;
      }

      if (budgetMax !== undefined && rangeMin > budgetMax) {
        return false;
      }
    }

    return true;
  });
}

function sortMarketplaceLawyers(
  lawyers: MarketplaceLawyer[],
  params: SearchParams
): MarketplaceLawyer[] {
  if (!params.sortBy) {
    return [...lawyers];
  }

  const direction = params.sortOrder === "asc" ? 1 : -1;
  const sorted = [...lawyers];

  sorted.sort((a, b) => {
    let aValue = 0;
    let bValue = 0;

    switch (params.sortBy) {
      case "rating":
        aValue = a.avgRating;
        bValue = b.avgRating;
        break;
      case "price":
        aValue = a.minPrice;
        bValue = b.minPrice;
        break;
      case "reviews":
        aValue = a.totalReview;
        bValue = b.totalReview;
        break;
      default:
        return a.name.localeCompare(b.name);
    }

    const diff = (aValue - bValue) * direction;

    if (diff > 0) {
      return 1;
    }

    if (diff < 0) {
      return -1;
    }

    return a.name.localeCompare(b.name);
  });

  return sorted;
}

function buildSearchResponse(
  lawyers: MarketplaceLawyer[],
  params: SearchParams
): LawyerSearchResponse {
  const filtered = applyMarketplaceFilters(lawyers, params);
  const sorted = sortMarketplaceLawyers(filtered, params);
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? APP_CONFIG.DEFAULT_PAGE_SIZE);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLawyers = sorted.slice(startIndex, endIndex);

  return {
    lawyers: paginatedLawyers,
    total: filtered.length,
    page,
    limit,
    totalPages: filtered.length === 0 ? 0 : Math.ceil(filtered.length / limit),
  };
}

export async function searchLawyers(params: SearchParams): Promise<LawyerSearchResponse> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    const dataset = mockLawyers.map(mapMockLawyerToMarketplace);
    return buildSearchResponse(dataset, params);
  }

  try {
    const dataset = await fetchMarketplaceLawyers();
    return buildSearchResponse(dataset, params);
  } catch (error) {
    console.error("Failed to fetch marketplace lawyers:", error);
    const fallbackDataset = mockLawyers.map(mapMockLawyerToMarketplace);
    return buildSearchResponse(fallbackDataset, params);
  }
}

export async function getLawyerById(id: string): Promise<Lawyer | null> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(500);
    return mockLawyers.find(lawyer => lawyer.id === id) || null;
  } else {
    try {
      const lawyer = await api.get<Lawyer>(API_CONFIG.ENDPOINTS.LAWYER_BY_ID(id));
      return lawyer;
    } catch (error) {
      console.error("Error fetching lawyer:", error);
      return null;
    }
  }
}

export async function getLawyerReviews(lawyerId: string): Promise<Review[]> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    return mockReviews.filter(review => review.lawyerId === lawyerId);
  } else {
    try {
      const reviews = await api.get<Review[]>(API_CONFIG.ENDPOINTS.LAWYER_REVIEWS(lawyerId));
      return reviews;
    } catch (error) {
      console.error("Error fetching lawyer reviews:", error);
      return [];
    }
  }
}

export async function getFeaturedLawyers(): Promise<Lawyer[]> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(600);
    return mockLawyers
      .filter(lawyer => lawyer.rating >= 4.7)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  } else {
    try {
      const lawyers = await api.get<Lawyer[]>(API_CONFIG.ENDPOINTS.FEATURED_LAWYERS);
      return lawyers;
    } catch (error) {
      console.error("Error fetching featured lawyers:", error);
      return [];
    }
  }
}

export async function createBooking(bookingData: Partial<Booking>): Promise<Booking> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    // Mock implementation
    await delay(1000);

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      lawyerId: bookingData.lawyerId ?? "",
      clientId: bookingData.clientId ?? "",
      packageId: bookingData.packageId ?? "",
      status: "pending",
      scheduledDate: bookingData.scheduledDate ?? "",
      scheduledTime: bookingData.scheduledTime ?? "",
      duration: bookingData.duration || APP_CONFIG.DEFAULT_BOOKING_DURATION,
      totalAmount: bookingData.totalAmount ?? 0,
      paymentStatus: "pending",
      notes: bookingData.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return booking;
  } else {
    // Real API implementation
    const response = await api.post<BookingResponse>(
      API_CONFIG.ENDPOINTS.CREATE_BOOKING,
      bookingData
    );
    return response.booking;
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(500);
    // Mock implementation - in real app this would fetch from database
    return null;
  } else {
    try {
      const booking = await api.get<Booking>(API_CONFIG.ENDPOINTS.BOOKING_BY_ID(id));
      return booking;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }
}

export async function getUserBookings(
  userId: string,
  page = 1,
  limit = 10
): Promise<{
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(800);
    // Mock implementation - return empty for now
    return {
      bookings: [],
      total: 0,
      page,
      totalPages: 0,
    };
  } else {
    const response = await api.get<{
      bookings: Booking[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${API_CONFIG.ENDPOINTS.BOOKINGS}?clientId=${userId}&page=${page}&limit=${limit}`);
    return response;
  }
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(1000);
    // Mock implementation
    const mockBooking: Booking = {
      id: bookingId,
      lawyerId: "lawyer-1",
      clientId: "client-1",
      packageId: "package-1",
      status: "cancelled",
      scheduledDate: new Date().toISOString(),
      scheduledTime: "10:00",
      duration: 60,
      totalAmount: 100000,
      paymentStatus: "refunded",
      notes: reason || "Cancelled by user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return mockBooking;
  } else {
    const response = await api.patch<BookingResponse>(
      API_CONFIG.ENDPOINTS.BOOKING_BY_ID(bookingId),
      { status: "cancelled", notes: reason }
    );
    return response.booking;
  }
}
