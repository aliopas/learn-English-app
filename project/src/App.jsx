import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import LessonView from './pages/LessonView'
import AITutor from './pages/AITutor'
import Flashcards from './pages/Flashcards'
import Auth from './pages/Auth'
import ChangePassword from './pages/ChangePassword'
import VocabularyGame from './pages/VocabularyGame'

const ProtectedRoute = ({ children }) => {
  const { user, loading, needsPasswordChange } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" />
  }

  // Redirect to change password if needed
  if (needsPasswordChange && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" />
  }

  return children
}

const AppRoutes = () => {
  const { user, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/change-password" element={user ? <ChangePassword /> : <Navigate to="/auth" />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/lesson/:dayId" element={<LessonView />} />
                <Route path="/ai-tutor" element={<AITutor />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/game" element={<VocabularyGame />} />
              </Routes>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  )
}

export default App
