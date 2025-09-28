import { mockLawyers, mockReviews } from "@/data/mock-data";
import { api } from "@/lib/api-client";
import { API_CONFIG, APP_CONFIG } from "@/lib/config";
import type { Booking, Lawyer, Review, SearchParams } from "@/types";

// Simulate API delay for mock data
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Response types for API
interface LawyerSearchResponse {
  lawyers: Lawyer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BookingResponse {
  booking: Booking;
  message?: string;
}

export async function searchLawyers(params: SearchParams): Promise<LawyerSearchResponse> {
  if (APP_CONFIG.USE_MOCK_DATA) {
    await delay(800);

    let filteredLawyers = [...mockLawyers];

    // Apply search query filter
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredLawyers = filteredLawyers.filter(
        lawyer =>
          lawyer.name.toLowerCase().includes(query) ||
          lawyer.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
          lawyer.bio.toLowerCase().includes(query)
      );
    }

    // Apply case type filter
    if (params.caseType) {
      filteredLawyers = filteredLawyers.filter(lawyer =>
        lawyer.specialties.some(specialty =>
          specialty.toLowerCase().includes(params.caseType?.toLowerCase() ?? "")
        )
      );
    }

    // Apply location filter
    if (params.location) {
      filteredLawyers = filteredLawyers.filter(lawyer =>
        lawyer.jurisdiction.some(jurisdiction =>
          jurisdiction.toLowerCase().includes(params.location?.toLowerCase() || "")
        )
      );
    }

    // Apply budget filter
    if (params.budget) {
      filteredLawyers = filteredLawyers.filter(
        lawyer =>
          lawyer.hourlyRate >= (params.budget?.min || 0) &&
          lawyer.hourlyRate <= (params.budget?.max || 0)
      );
    }

    // Apply rating filter
    if (params.rating) {
      filteredLawyers = filteredLawyers.filter(lawyer => lawyer.rating >= (params.rating ?? 0));
    }

    // Apply experience filter
    if (params.experience) {
      filteredLawyers = filteredLawyers.filter(
        lawyer => lawyer.experience >= (params.experience ?? 0)
      );
    }

    // Apply language filter
    if (params.language) {
      filteredLawyers = filteredLawyers.filter(lawyer =>
        lawyer.languages.some(lang =>
          lang.toLowerCase().includes((params.language || "").toLowerCase())
        )
      );
    }

    // Apply availability filter
    if (params.availability) {
      filteredLawyers = filteredLawyers.filter(
        lawyer => lawyer.availability === params.availability
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredLawyers.sort((a, b) => {
        let aValue: number;
        let bValue: number;

        switch (params.sortBy) {
          case "rating":
            aValue = a.rating;
            bValue = b.rating;
            break;
          case "price":
            aValue = a.hourlyRate;
            bValue = b.hourlyRate;
            break;
          case "experience":
            aValue = a.experience;
            bValue = b.experience;
            break;
          case "reviews":
            aValue = a.reviewCount;
            bValue = b.reviewCount;
            break;
          default:
            return 0;
        }

        return params.sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedLawyers = filteredLawyers.slice(startIndex, endIndex);

    return {
      lawyers: paginatedLawyers,
      total: filteredLawyers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLawyers.length / limit),
    };
  } else {
    // Real API implementation
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append("query", params.query);
    if (params.caseType) queryParams.append("caseType", params.caseType);
    if (params.location) queryParams.append("location", params.location);
    if (params.rating) queryParams.append("rating", params.rating.toString());
    if (params.experience) queryParams.append("experience", params.experience.toString());
    if (params.language) queryParams.append("language", params.language);
    if (params.availability) queryParams.append("availability", params.availability);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.budget) {
      queryParams.append("minPrice", params.budget.min.toString());
      queryParams.append("maxPrice", params.budget.max.toString());
    }

    const page = params.page || 1;
    const limit = params.limit || APP_CONFIG.DEFAULT_PAGE_SIZE;
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const response = await api.get<LawyerSearchResponse>(
      `${API_CONFIG.ENDPOINTS.LAWYERS}?${queryParams.toString()}`
    );

    return response;
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
