/**
 * Utilități pentru lucrul cu autentificarea în aplicație
 */

/**
 * Funcție pentru efectuarea requesturilor HTTP autentificate
 * @param url URL-ul către care se face requestul
 * @param options Opțiuni pentru request
 * @returns Promise cu răspunsul HTTP
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Obținem token-ul din local storage
  const user = localStorage.getItem('user');
  let token = '';
  
  if (user) {
    try {
      // În implementarea reală, token-ul ar trebui stocat separat
      // Această implementare este doar pentru test
      token = `Bearer mock_token_${JSON.parse(user).id}`;
    } catch (err) {
      console.error('Eroare la parsarea datelor utilizatorului:', err);
    }
  }

  // Adăugăm header-ul de autorizare dacă avem token
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.append('Authorization', token);
  }
  
  // Adăugăm header-ul Content-Type dacă nu există și avem body
  if (options.body && !headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }

  // Facem request-ul cu header-ele actualizate
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Verificăm dacă avem eroare de autentificare
  if (response.status === 401) {
    // Token expirat sau invalid, delogăm utilizatorul
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sesiune expirată. Vă rugăm să vă autentificați din nou.');
  }

  return response;
} 