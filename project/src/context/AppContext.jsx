import { createContext, useContext, useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authAPI, lessonAPI } from '../lib/api'
import { generateLearningPath } from '../data/learningData'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [learningPath] = useState(generateLearningPath())
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false)

  const queryClient = useQueryClient()

  // Theme Initialization
  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (localTheme) {
      const isDark = localTheme === 'dark'
      setDarkMode(isDark)
      if (isDark) document.documentElement.classList.add('dark')
    } else {
      // Check system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(systemDark)
      if (systemDark) document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const data = await authAPI.getMe()
      if (data.success && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          terms_accepted: data.user.terms_accepted
        })

        setUserProfile({
          current_level: data.user.current_level || 'A1',
          current_day: data.user.current_day || 1,
          listening_score: data.user.listening_score || 0,
          reading_score: data.user.reading_score || 0,
          speaking_score: data.user.speaking_score || 0,
          grammar_score: data.user.grammar_score || 0,
          streak_days: data.user.streak_days || 0,
          total_study_minutes: data.user.total_study_minutes || 0
        })

        // Check if user needs to change password
        setNeedsPasswordChange(!data.user.password_changed)

        // 🚀 Prefetch all initial data in background (cache warming)
        queryClient.prefetchQuery({
          queryKey: ['initialAppData'],
          queryFn: async () => {
            const response = await lessonAPI.getBulkInitialData()
            return response.data
          },
          staleTime: Infinity
        })
      }
    } catch (error) {
      console.log('Not authenticated')
      localStorage.removeItem('token')
      setUser(null)
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('token', data.token)
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name
        })

        // Check if user needs to change password
        setNeedsPasswordChange(!data.user.password_changed)

        // Reload user profile
        await checkUser()

        return data
      }
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email, password, full_name, terms_accepted = false) => {
    try {
      const data = await authAPI.register(email, password, full_name, terms_accepted)
      if (data.success && data.user) {
        if (data.token) localStorage.setItem('token', data.token)
        setUser({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          terms_accepted: data.user.terms_accepted
        })

        setNeedsPasswordChange(false) // They set their own password

        // Reload user profile
        await checkUser()

        return data
      }
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      setUserProfile(null)
      setNeedsPasswordChange(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const data = await authAPI.changePassword(currentPassword, newPassword)
      if (data.success) {
        setNeedsPasswordChange(false)
        return data
      }
    } catch (error) {
      throw error
    }
  }

  const acceptTerms = async () => {
    try {
      const data = await authAPI.acceptTerms()
      if (data.success) {
        if (user) {
          setUser({ ...user, terms_accepted: true })
        }
        return data
      }
    } catch (error) {
      throw error
    }
  }

  const updateUserProgress = async (updates) => {
    // TODO: Implement API call to update user progress
    console.log('Update user progress:', updates)

    // For now, update locally
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates })
    }

    return { data: updates, error: null }
  }

  const completeLesson = async (dayNumber, lessonId, score) => {
    // TODO: Implement API call to complete lesson
    console.log('Complete lesson:', { dayNumber, lessonId, score })

    // For now, update locally
    await updateUserProgress({
      current_day: Math.min(dayNumber + 1, 30),
      total_study_minutes: (userProfile?.total_study_minutes || 0) + 30
    })

    return { error: null }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    darkMode,
    learningPath,
    needsPasswordChange,
    signIn,
    signUp,
    signOut,
    changePassword,
    acceptTerms,
    updateUserProgress,
    completeLesson,
    toggleDarkMode,
    refreshProfile: checkUser
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
