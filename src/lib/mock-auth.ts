// Mock user types
export interface MockUser {
  id: string;
  email: string;
  role: 'user' | 'verifier';
}

// Mock authentication functions
export const mockAuth = {
  login: (email: string, password: string): Promise<MockUser> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const user = {
          id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
          email,
          role: email.includes('verifier') ? 'verifier' : 'user'
        };
        localStorage.setItem('mockUser', JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  },

  signup: (email: string, password: string, role: string): Promise<MockUser> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
          email,
          role: role as 'user' | 'verifier'
        };
        localStorage.setItem('mockUser', JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem('mockUser');
      resolve();
    });
  },

  getCurrentUser: (): MockUser | null => {
    const userStr = localStorage.getItem('mockUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
