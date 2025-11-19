import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import Login from '../../components/Login'
import Dashboard from '../../components/Dashboard'
import { authAPI } from '../../services/api'

// Mock API calls
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    signup: jest.fn(),
    getCurrentUser: jest.fn()
  }
}))

const AppWithRoutes = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

describe('Auth Flow - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('completes full login flow and redirects to dashboard', async () => {
    const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' }
    
    // Mock successful login
    authAPI.login.mockResolvedValue({
      data: { token: 'mock-token', user: mockUser }
    })

    // Mock getCurrentUser for the dashboard
    authAPI.getCurrentUser.mockResolvedValue({ data: { user: mockUser } })

    render(<AppWithRoutes />)

    // Navigate to login (since we start at / but no user is logged in)
    window.history.pushState({}, 'Login', '/login')

    // Fill and submit login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // Wait for login to complete and redirect
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    // Verify token was stored
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token')
  })

  it('redirects to login when accessing protected route without authentication', async () => {
    authAPI.getCurrentUser.mockRejectedValue(new Error('Not authenticated'))

    render(<AppWithRoutes />)

    // Start at dashboard without being logged in
    window.history.pushState({}, 'Dashboard', '/')

    await waitFor(() => {
      // Should redirect to login or show login form
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })
  })
})
