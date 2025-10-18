import type {
  ApiLawyer,
  LawyerDetailApi,
  LawyerDetailApiResponse,
  LawyersApiResponse,
} from "@/types";

const API_BASE_URL = "https://api.legali.io/api";

export class LawyerService {
  private static async getAuthToken(): Promise<string | null> {
    // Get token from localStorage or session storage
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    }
    return null;
  }

  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const token = await LawyerService.getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getLawyers(): Promise<ApiLawyer[]> {
    try {
      const response = await LawyerService.makeRequest<LawyersApiResponse>("/marketplaces/lawyers");

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch lawyers");
      }

      // Add languages to each lawyer (simulated data since API doesn't provide it)
      const lawyersWithLanguages = response.data.map(lawyer => ({
        ...lawyer,
        languages: LawyerService.generateRandomLanguages(),
      }));

      return lawyersWithLanguages;
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      throw error;
    }
  }

  private static generateRandomLanguages(): string[] {
    const allLanguages = [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Chinese",
      "Japanese",
    ];
    const numLanguages = Math.floor(Math.random() * 3) + 1; // 1-3 languages
    const shuffled = allLanguages.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numLanguages);
  }

  static async getLawyerById(id: string): Promise<ApiLawyer | null> {
    try {
      const lawyers = await LawyerService.getLawyers();
      return lawyers.find(lawyer => lawyer.id === id) || null;
    } catch (error) {
      console.error("Error fetching lawyer by ID:", error);
      return null;
    }
  }

  static async getLawyerDetail(id: string): Promise<LawyerDetailApi | null> {
    try {
      const response = await LawyerService.makeRequest<LawyerDetailApiResponse>(
        `/marketplaces/lawyers/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch lawyer detail");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching lawyer detail:", error);
      return null;
    }
  }

  static async searchLawyers(query: string): Promise<ApiLawyer[]> {
    try {
      const lawyers = await LawyerService.getLawyers();

      if (!query.trim()) {
        return lawyers;
      }

      const searchTerm = query.toLowerCase();
      return lawyers.filter(
        lawyer =>
          lawyer.name.toLowerCase().includes(searchTerm) ||
          lawyer.about.toLowerCase().includes(searchTerm) ||
          lawyer.city.toLowerCase().includes(searchTerm) ||
          lawyer.practice_area.some(area => area.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching lawyers:", error);
      throw error;
    }
  }

  static async filterLawyersByPracticeArea(practiceArea: string): Promise<ApiLawyer[]> {
    try {
      const lawyers = await LawyerService.getLawyers();

      if (!practiceArea.trim()) {
        return lawyers;
      }

      return lawyers.filter(lawyer =>
        lawyer.practice_area.some(area => area.toLowerCase().includes(practiceArea.toLowerCase()))
      );
    } catch (error) {
      console.error("Error filtering lawyers by practice area:", error);
      throw error;
    }
  }

  static async filterLawyersByPriceRange(minPrice: number, maxPrice: number): Promise<ApiLawyer[]> {
    try {
      const lawyers = await LawyerService.getLawyers();

      return lawyers.filter(lawyer => lawyer.min_price >= minPrice && lawyer.max_price <= maxPrice);
    } catch (error) {
      console.error("Error filtering lawyers by price range:", error);
      throw error;
    }
  }

  static async filterLawyersByRating(minRating: number): Promise<ApiLawyer[]> {
    try {
      const lawyers = await LawyerService.getLawyers();

      return lawyers.filter(lawyer => parseFloat(lawyer.avg_rating) >= minRating);
    } catch (error) {
      console.error("Error filtering lawyers by rating:", error);
      throw error;
    }
  }
}
