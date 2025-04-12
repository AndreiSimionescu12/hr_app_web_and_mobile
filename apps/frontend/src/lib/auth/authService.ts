import apiClient from '../api/client';

export interface User {
  id: string;
  email: string;
  role: string;
  companyId?: string;
  employeeId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Utilizatori de test pentru dezvoltare
const mockUsers = [
  {
    id: '1',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    companyId: '1'
  },
  {
    id: '2',
    email: 'company@test.com',
    password: 'company123',
    role: 'COMPANY_ADMIN',
    companyId: '1'
  },
  {
    id: '3',
    email: 'manager@test.com',
    password: 'manager123',
    role: 'MANAGER',
    companyId: '1'
  },
  {
    id: '4',
    email: 'employee@test.com',
    password: 'employee123',
    role: 'EMPLOYEE',
    companyId: '1'
  }
];

/**
 * Serviciu pentru autentificare și gestiunea sesiunii utilizatorilor
 */
const authService = {
  /**
   * Realizează autentificarea utilizatorului
   * @param credentials Credențialele utilizatorului
   * @returns Obiect cu utilizatorul și token-ul
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Verificăm credențialele cu utilizatorii de test
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      // Simulăm o eroare de autentificare
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('Credențiale invalide');
    }

    // Simulăm un apel API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Creăm un obiect utilizator fără parolă
    const userResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    };

    // Stocăm utilizatorul în localStorage
    localStorage.setItem('user', JSON.stringify(userResponse));

    return {
      user: userResponse,
      token: `mock_token_${user.id}`,
    };
  },

  /**
   * Delogarea utilizatorului
   */
  logout(): void {
    localStorage.removeItem('user');
  },

  /**
   * Obține utilizatorul curent
   * @returns Utilizatorul curent sau null dacă nu există
   */
  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      this.logout();
      return null;
    }
  },

  /**
   * Verifică dacă utilizatorul are un anumit rol sau unul dintre rolurile specificate
   * @param roles Un rol sau o listă de roluri
   * @returns true dacă utilizatorul are rolul sau unul dintre rolurile specificate
   */
  hasRole(roles: string | string[]): boolean {
    const user = this.getUser();
    if (!user) return false;

    if (typeof roles === 'string') {
      return user.role === roles;
    }

    return roles.includes(user.role);
  },
};

export default authService; 