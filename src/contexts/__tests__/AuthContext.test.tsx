import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock supabase client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: any[]) => mockSignInWithPassword(...args),
      signUp: (...args: any[]) => mockSignUp(...args),
      signOut: (...args: any[]) => mockSignOut(...args),
      getSession: (...args: any[]) => mockGetSession(...args),
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
    },
    from: (...args: any[]) => mockFrom(...args),
  },
}));

import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    mockGetSession.mockResolvedValue({ data: { session: null } });
  });

  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });

  it('starts in loading state and resolves to unauthenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // After getSession resolves with null, should be not authenticated
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it('login calls signInWithPassword', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    let loginResult: { error: string | null };
    await act(async () => {
      loginResult = await result.current.login('test@test.com', 'password');
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    });
    expect(loginResult!.error).toBeNull();
  });

  it('login returns error message on failure', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    let loginResult: { error: string | null };
    await act(async () => {
      loginResult = await result.current.login('bad@test.com', 'wrong');
    });

    expect(loginResult!.error).toBe('Invalid credentials');
  });

  it('signup calls supabase signUp with metadata', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signup('test@test.com', 'pass123', 'John Doe', 'designer', 'Design Studio');
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pass123',
      options: {
        data: { full_name: 'John Doe', role: 'designer', department: 'Design Studio' },
      },
    });
  });

  it('logout calls signOut and clears profile', async () => {
    mockSignOut.mockResolvedValue({});
    const { result } = renderHook(() => useAuth(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(result.current.profile).toBeNull();
  });
});
