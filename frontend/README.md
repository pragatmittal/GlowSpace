# GlowSpace Frontend

A modern React application for mental health tracking and wellbeing.

## Authentication System

The application uses a comprehensive authentication system with the following features:

### Authentication Context

The `AuthContext` provides:

- User information (`user`)
- Authentication status (`isAuthenticated`)
- Loading state (`loading`)
- Error handling (`error`)
- Authentication methods:
  - `login(email, password)`: Authenticate with credentials
  - `logout()`: End the current session
  - `checkAuthStatus()`: Verify authentication status with backend

### Protected Routes

Routes that require authentication are protected using the `ProtectedRoute` component:

```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

This component:
- Checks if the user is authenticated
- Shows a loader while checking auth status
- Redirects to the login page if not authenticated
- Renders the protected content if authenticated

### Authentication Flow

1. User navigates to `/auth/sign-in`
2. User enters credentials and submits the login form
3. Backend validates credentials and creates a session
4. Frontend refreshes auth state with `checkAuthStatus()`
5. User is redirected to the homepage with `navigateWithLoading("/")`
6. Protected routes become accessible

### Implementation Details

- Uses cookie-based authentication with `withCredentials: true`
- Centralized authentication state management with React Context
- Smooth transitions with LoadingContext
- Error handling for failed authentication attempts

## Development Setup

1. Install dependencies:
```
npm install
```

2. Start development server:
```
npm start
```

3. Build for production:
```
npm run build
``` 