import { apiClient, endpoints } from '../config/api';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthResponse {
  user: User;
  authenticated: boolean;
}

export interface LoginResponse {
  loginUrl: string;
}

class AuthService {
  // Check if user is authenticated
  async checkAuthStatus(): Promise<AuthResponse> {
    try {
      const response = await apiClient.get(endpoints.auth.status);
      return response.data;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return { user: null as any, authenticated: false };
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get(endpoints.auth.me);
      return response.data.user;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  // Initiate login (redirects to Keycloak)
  async login(): Promise<LoginResponse> {
    try {
      const response = await apiClient.get(endpoints.auth.login);
      return response.data;
    } catch (error) {
      console.error('Login initiation failed:', error);
      throw new Error('Failed to initiate login');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post(endpoints.auth.logout);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local storage anyway
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Refresh access token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await apiClient.post(endpoints.auth.refresh, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Handle Keycloak callback (for SPA flow)
  handleCallback(token: string, refreshToken?: string): void {
    localStorage.setItem('accessToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Check if user has specific role
  hasRole(user: User | null, role: string): boolean {
    return user?.roles?.includes(role) || false;
  }

  // Get stored access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Check if user is authenticated (client-side)
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();