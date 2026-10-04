import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types/financial';

interface StoredUserAccount extends AuthUser {
  passwordHash: string; // simulated client-side hash
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'NPS_AUTH_CURRENT_USER';
const USERS_DB_KEY = 'NPS_AUTH_REGISTERED_USERS';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial demo user
const DEFAULT_DEMO_USER: StoredUserAccount = {
  id: 'demo-user-1',
  name: 'Shahid',
  email: 'msshahid.414@gmail.com',
  passwordHash: 'demo123',
  isDemo: true,
};

const stripLevelFromName = (name: string): string => {
  return name.replace(/\s*\(?Level\s*\d+\)?/gi, '').trim();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) parsed.name = stripLevelFromName(parsed.name);
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Ensure default demo user exists in storage and strip any legacy Level tags
  useEffect(() => {
    try {
      const usersStr = localStorage.getItem(USERS_DB_KEY);
      let users: StoredUserAccount[] = usersStr ? JSON.parse(usersStr) : [];
      let modified = false;

      users = users.map((u) => {
        const cleaned = stripLevelFromName(u.name);
        if (cleaned !== u.name) {
          modified = true;
          return { ...u, name: cleaned };
        }
        return u;
      });

      if (!users.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
        users.push(DEFAULT_DEMO_USER);
        modified = true;
      }
      if (modified) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }

      // Also clean currentUser if needed
      if (currentUser && currentUser.name.match(/Level/i)) {
        const cleanedUser = { ...currentUser, name: stripLevelFromName(currentUser.name) };
        setCurrentUser(cleanedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cleanedUser));
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    try {
      const usersStr = localStorage.getItem(USERS_DB_KEY);
      const users: StoredUserAccount[] = usersStr ? JSON.parse(usersStr) : [DEFAULT_DEMO_USER];

      const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        return { success: false, error: 'No account found with this email. Please register first.' };
      }

      if (found.passwordHash !== cleanPass && found.passwordHash !== 'demo123') {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const userSession: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        isDemo: found.isDemo,
      };

      setCurrentUser(userSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      return { success: false, error: 'Please fill in all fields (Name, Email, Password).' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const usersStr = localStorage.getItem(USERS_DB_KEY);
      const users: StoredUserAccount[] = usersStr ? JSON.parse(usersStr) : [];

      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      }

      const newUser: StoredUserAccount = {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        passwordHash: cleanPass,
        isDemo: false,
      };

      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

      const userSession: AuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isDemo: false,
      };

      setCurrentUser(userSession);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const loginAsDemo = () => {
    const demoSession: AuthUser = {
      id: DEFAULT_DEMO_USER.id,
      name: DEFAULT_DEMO_USER.name,
      email: DEFAULT_DEMO_USER.email,
      isDemo: true,
    };
    setCurrentUser(demoSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoSession));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
