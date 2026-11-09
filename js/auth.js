/**
 * Authentication Module for Bible Study Website
 * Integrates Supabase Auth with complete Guest Mode and local testing fallback.
 */

(function (window) {
  'use strict';

  class AuthService {
    constructor() {
      this.currentUser = null;
      this.listeners = [];
      this.init();
    }

    async init() {
      // Check if Supabase client is available
      if (window.AppDB && window.AppDB.supabase) {
        try {
          const { data } = await window.AppDB.supabase.auth.getSession();
          if (data && data.session) {
            this.currentUser = data.session.user;
            window.AppDB.setCurrentUser(this.currentUser);
            this.notifyListeners();
          }

          window.AppDB.supabase.auth.onAuthStateChange((event, session) => {
            console.log('[Auth] State changed:', event);
            this.currentUser = session?.user || null;
            window.AppDB.setCurrentUser(this.currentUser);
            this.notifyListeners();
          });
        } catch (e) {
          console.warn('[Auth] Supabase session check error:', e);
        }
      } else {
        // Local Guest/Demo user support from localStorage
        const storedLocalUser = localStorage.getItem('bv_local_user');
        if (storedLocalUser) {
          try {
            this.currentUser = JSON.parse(storedLocalUser);
            window.AppDB.setCurrentUser(this.currentUser);
          } catch (e) {
            localStorage.removeItem('bv_local_user');
          }
        }
      }
    }

    onAuthStateChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
        // Immediate notification of initial state
        callback(this.currentUser);
      }
    }

    notifyListeners() {
      for (const listener of this.listeners) {
        try {
          listener(this.currentUser);
        } catch (e) {
          console.error('[Auth] Listener error:', e);
        }
      }
    }

    getUser() {
      return this.currentUser;
    }

    isLoggedIn() {
      return this.currentUser !== null;
    }

    /**
     * Sign Up with Email and Password
     */
    async signUp(email, password, displayName = '') {
      if (!email || !password) {
        throw new Error('Please fill in all required fields.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      // If Supabase is active
      if (window.AppDB && window.AppDB.supabase) {
        const { data, error } = await window.AppDB.supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName || email.split('@')[0] }
          }
        });
        if (error) throw error;

        this.currentUser = data.user;
        window.AppDB.setCurrentUser(this.currentUser);
        this.notifyListeners();

        // Migrate local guest data to new Supabase account
        if (data.user) {
          await window.AppDB.syncGuestDataToAccount(data.user.id);
        }
        return data;
      }

      // Local / Offline demo account creation
      const normEmail = email.toLowerCase().trim();
      let localAccounts = {};
      try {
        localAccounts = JSON.parse(localStorage.getItem('bv_local_accounts') || '{}');
      } catch (e) {
        localAccounts = {};
      }

      if (localAccounts[normEmail]) {
        throw new Error('User already registered');
      }

      // Store simple hashed representation (base64 mock) for offline testing
      localAccounts[normEmail] = {
        email: normEmail,
        fullName: displayName || email.split('@')[0],
        pwHash: btoa(password),
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('bv_local_accounts', JSON.stringify(localAccounts));

      const mockUser = {
        id: 'usr_' + Date.now(),
        email: normEmail,
        user_metadata: { full_name: displayName || email.split('@')[0] },
        created_at: new Date().toISOString()
      };
      this.currentUser = mockUser;
      localStorage.setItem('bv_local_user', JSON.stringify(mockUser));
      window.AppDB.setCurrentUser(mockUser);
      this.notifyListeners();
      return { user: mockUser };
    }

    /**
     * Sign In with Email and Password
     */
    async signIn(email, password) {
      if (!email || !password) {
        throw new Error('Please fill in all required fields.');
      }

      if (window.AppDB && window.AppDB.supabase) {
        const { data, error } = await window.AppDB.supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        this.currentUser = data.user;
        window.AppDB.setCurrentUser(this.currentUser);
        this.notifyListeners();
        return data;
      }

      // Local fallback verification
      const normEmail = email.toLowerCase().trim();
      let localAccounts = {};
      try {
        localAccounts = JSON.parse(localStorage.getItem('bv_local_accounts') || '{}');
      } catch (e) {
        localAccounts = {};
      }

      // If there are registered demo accounts, check credentials
      if (Object.keys(localAccounts).length > 0) {
        const acc = localAccounts[normEmail];
        if (!acc || acc.pwHash !== btoa(password)) {
          throw new Error('Invalid login credentials');
        }
        const mockUser = {
          id: 'usr_' + normEmail,
          email: normEmail,
          user_metadata: { full_name: acc.fullName || normEmail.split('@')[0] },
          created_at: acc.createdAt
        };
        this.currentUser = mockUser;
        localStorage.setItem('bv_local_user', JSON.stringify(mockUser));
        window.AppDB.setCurrentUser(mockUser);
        this.notifyListeners();
        return { user: mockUser };
      }

      // Default demo mock user if no accounts registered yet
      const mockUser = {
        id: 'usr_' + Date.now(),
        email: normEmail,
        user_metadata: { full_name: email.split('@')[0] },
        created_at: new Date().toISOString()
      };
      this.currentUser = mockUser;
      localStorage.setItem('bv_local_user', JSON.stringify(mockUser));
      window.AppDB.setCurrentUser(mockUser);
      this.notifyListeners();
      return { user: mockUser };
    }

    /**
     * Password Reset Request
     */
    async resetPassword(email) {
      if (!email) throw new Error('Please enter a valid email address.');
      if (window.AppDB && window.AppDB.supabase) {
        const { data, error } = await window.AppDB.supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return data;
      }
      return { message: 'Password recovery email sent (Simulation mode).' };
    }

    /**
     * Sign Out
     */
    async signOut() {
      if (window.AppDB && window.AppDB.supabase) {
        try {
          await window.AppDB.supabase.auth.signOut();
        } catch (e) {
          console.warn('[Auth] Supabase signOut error:', e);
        }
      }
      localStorage.removeItem('bv_local_user');
      this.currentUser = null;
      window.AppDB.setCurrentUser(null);
      this.notifyListeners();
    }
  }

  window.AuthService = new AuthService();

})(window);
