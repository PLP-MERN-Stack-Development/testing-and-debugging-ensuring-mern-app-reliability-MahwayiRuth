import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCurrentUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async (token) => {
    try {
      const userData = await authAPI.getCurrentUser(token)
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('token')
      console.error('Failed to fetch current user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError('')
      setLoading(true)
      const response = await authAPI.login(email, password)
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (username, email, password) => {
    try {
      setError('')
      setLoading(true)
      const response = await authAPI.signup(username, email, password)
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError('')
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
