import Cookies from 'js-cookie';

const AUTH_COOKIE_NAME = 'band_manager_auth';
const USER_COOKIE_NAME = 'band_manager_user';

export interface SessionUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export const sessionService = {
  // Set authentication session
  setSession: (user: SessionUser, rememberMe: boolean = true) => {
    const cookieOptions = {
      expires: rememberMe ? 30 : undefined, // 30 days or session cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    // Store minimal user data in cookies
    Cookies.set(AUTH_COOKIE_NAME, 'authenticated', cookieOptions);
    Cookies.set(USER_COOKIE_NAME, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }), cookieOptions);
  },

  // Get current session
  getSession: (): { isAuthenticated: boolean; user: SessionUser | null } => {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const userCookie = Cookies.get(USER_COOKIE_NAME);

    if (!authCookie || !userCookie) {
      return { isAuthenticated: false, user: null };
    }

    try {
      const user = JSON.parse(userCookie);
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return { isAuthenticated: false, user: null };
    }
  },

  // Clear session
  clearSession: () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    Cookies.remove(USER_COOKIE_NAME);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!Cookies.get(AUTH_COOKIE_NAME);
  },

  // Get user from session
  getUser: (): SessionUser | null => {
    const userCookie = Cookies.get(USER_COOKIE_NAME);
    if (!userCookie) return null;

    try {
      return JSON.parse(userCookie);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return null;
    }
  },
};
