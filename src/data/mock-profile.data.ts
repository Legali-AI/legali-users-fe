import { getAccessToken, setAccessToken } from "@/lib/auth";
import { generateMockToken, HARDCODED_USERS, type HardcodedUser } from "./auth.data";

// Mock profile API responses
export interface MockProfileUpdateData {
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
}

export interface MockProfileResponse {
  data: {
    data: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_picture_url?: string | null;
      city_id?: number | null;
    };
  };
}

// Runtime store for user updates (separate from the original hardcoded data)
const userUpdates: Record<string, Partial<HardcodedUser>> = {};

// Get user from mock token
function getUserFromToken(): HardcodedUser | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token));
    const baseUser = HARDCODED_USERS.find(user => user.id === payload.userId);
    if (!baseUser) return null;

    // Apply any runtime updates
    const updates = userUpdates[baseUser.id] || {};
    return { ...baseUser, ...updates };
  } catch (error) {
    console.error("Error parsing mock token:", error);
    return null;
  }
}

// Mock profile update function
export async function mockUpdateProfile(
  updateData: MockProfileUpdateData
): Promise<MockProfileResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const currentUser = getUserFromToken();
  if (!currentUser) {
    throw new Error("User not found");
  }

  // Store updates in runtime store
  const updates: Partial<HardcodedUser> = {
    ...userUpdates[currentUser.id],
    first_name: updateData.first_name,
    last_name: updateData.last_name,
  };

  if (updateData.profile_picture_url) {
    updates.profile_picture_url = updateData.profile_picture_url;
  }

  userUpdates[currentUser.id] = updates;

  // Get updated user data
  const updatedUser = getUserFromToken();
  if (!updatedUser) {
    throw new Error("Failed to get updated user");
  }

  // Generate new token with updated data
  const newToken = generateMockToken(updatedUser);
  setAccessToken(newToken);

  return {
    data: {
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_picture_url: updatedUser.profile_picture_url || null,
        city_id: updatedUser.city_id || null,
      },
    },
  };
}

// Check if we're using mock authentication (for conditional API calls)
export function isMockAuthentication(): boolean {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token));
    return payload.userId && HARDCODED_USERS.some(user => user.id === payload.userId);
  } catch (error) {
    return false;
  }
}
