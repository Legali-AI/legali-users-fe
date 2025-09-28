// Hardcoded user data for testing
export interface HardcodedUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "lawyer" | "user";
  profile_picture_url?: string;
  city_id?: number;
}

export const HARDCODED_USERS: HardcodedUser[] = [
  {
    id: "lawyer-1",
    email: "lawyers@legali.io",
    password: "lawyer321",
    first_name: "Legal",
    last_name: "Expert",
    role: "lawyer",
    city_id: 1,
  },
  {
    id: "user-1",
    email: "user@legali.io",
    password: "user321",
    first_name: "John",
    last_name: "Doe",
    role: "user",
    city_id: 1,
  },
];

export function authenticateUser(email: string, password: string): HardcodedUser | null {
  const user = HARDCODED_USERS.find(u => u.email === email && u.password === password);
  return user || null;
}

// Generate a mock JWT token for testing
export function generateMockToken(user: HardcodedUser): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // In a real app, this would be a proper JWT
  return btoa(JSON.stringify(payload));
}
