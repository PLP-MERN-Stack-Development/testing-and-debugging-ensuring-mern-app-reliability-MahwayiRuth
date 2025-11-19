import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { authAPI } from '../../services/api'

// Mock the API
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    signup: jest.fn(),
    getCurrentUser: jest.fn()
  }
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, error, login, signup, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Yes' : 'No'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup('user', 'test@example.com', 'password')}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('provides initial state correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent('No user')
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('No')
  })

  it('handles successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' }
    authAPI.login.mockResolvedValue({
      data: { token: 'mock-token', user: mockUser }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
    })
  })

  it('handles login failure', async () => {
    authAPI.login.mockRejectedValue({
      response: { data: { message: 'Login failed' } }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Login failed')
    })
  })

  it('handles logout correctly', async () => {
    localStorage.setItem('token', 'existing-token')
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })
})
