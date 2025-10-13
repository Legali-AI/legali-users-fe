# Authentication System Optimization Guide

## Overview

The authentication system has been optimized to avoid unnecessary API calls to the profile endpoint, which is still in development. The system now provides multiple hooks for different use cases.

## Available Authentication Hooks

### 1. `useAuthStatus()` - Lightweight Authentication Check

**Use Case**: Components that only need to know if user is logged in
**Performance**: ✅ No API calls, just token validation
**Examples**: Navbar, route guards, conditional rendering

```tsx
import { useAuthStatus } from "@/hooks/use-auth-status";

function Navbar() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  return <div>{isAuthenticated ? "Welcome!" : "Please log in"}</div>;
}
```

### 2. `useAuth()` - Basic Authentication Operations

**Use Case**: Login/logout functionality, basic auth management
**Performance**: ✅ No profile API calls
**Returns**: `{ isAuthenticated, login, logout, refreshToken, isLoading, user: null }`

```tsx
import { useAuth } from "@/hooks/use-auth";

function LoginComponent() {
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = credentials => {
    login({ access_token: "...", refresh_token: "..." });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={() => logout(() => router.push("/login"))}>
          Logout
        </button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 3. `useAuthWithProfile()` - Full Authentication + Profile Data

**Use Case**: Components that need user profile information
**Performance**: ⚠️ Makes profile API calls when authenticated
**Returns**: `{ isAuthenticated, user, login, logout, refreshToken, isLoading }`

```tsx
import { useAuthWithProfile } from "@/hooks/use-auth";

function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuthWithProfile();

  if (!isAuthenticated) return <div>Please log in</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome {user?.first_name}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### 4. `useProfile()` - Direct Profile Data Access

**Use Case**: Components that specifically need profile data
**Performance**: ✅ Can be disabled with options
**Features**: React Query caching, error handling, retry logic

```tsx
import { useProfile } from "@/hooks/use-profile";

function UserAvatar() {
  const { data: user, isLoading, error } = useProfile();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return <img src={user?.profile_picture_url} alt="Avatar" />;
}

// Disable automatic fetching
function ConditionalProfile() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data: user } = useProfile({ enabled: shouldFetch });

  return (
    <div>
      <button onClick={() => setShouldFetch(true)}>Load Profile</button>
      {user && <div>{user.first_name}</div>}
    </div>
  );
}
```

## Current Usage in Components

### ✅ Optimized Components (No Profile API Calls)

- `src/components/elements/navbar.tsx` - Uses `useAuthStatus()` + `useAuth()`
- `src/components/auth/auth-guard.tsx` - Uses `useAuthStatus()`
- `src/components/elements/logout-button.tsx` - Uses `useAuth()`
- `src/app/google/page.tsx` - Uses `useAuth()`

### 🔄 Profile-Required Components (Makes API Calls Only When Needed)

- `src/app/(dashboard)/profile/page.tsx` - Uses `useAuthWithProfile()`
- `src/components/elements/dynamic-header.tsx` - Uses `useAuthWithProfile()`
- `src/app/welcome/welcome-form.tsx` - Uses `useAuthWithProfile()`

## Migration Benefits

1. **Performance**: Main pages no longer make unnecessary profile API calls
2. **Flexibility**: Choose the right hook for your use case
3. **Future-Ready**: Easy to switch when profile endpoint is ready
4. **Maintained UX**: All existing functionality preserved

## When Profile Endpoint is Ready

When the profile endpoint is fully implemented, you can:

1. Remove the mock data from `useProfile()` hook
2. Update the API call in `fetchProfile()` function
3. Optionally migrate some `useAuthStatus()` usage to `useAuth()` if needed
4. The component interfaces remain the same

## Best Practices

- Use `useAuthStatus()` for simple authentication checks
- Use `useAuth()` for login/logout operations
- Use `useAuthWithProfile()` only when you need user data
- Use `useProfile({ enabled: false })` for conditional profile loading
- Always handle loading and error states in profile components
