import apiClient from '../api/client';

export interface User {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private tokenKey = 'token';
  private userKey = 'user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { accessToken, user } = response.data;
      
      // Salvăm token-ul și informațiile utilizatorului
      this.setToken(accessToken);
      this.setUser(user);
      
      return response.data;
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    // Redirecționare la pagina de login se va face în componenta care apelează logout
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (e) {
      console.error('Eroare la parsarea utilizatorului:', e);
      return null;
    }
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Metodă pentru verificarea rolurilor utilizatorului
  hasRole(roles: string | string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    
    return roles === userRole;
  }
}

// Singleton pentru a asigura o singură instanță în aplicație
const authService = new AuthService();
export default authService; 