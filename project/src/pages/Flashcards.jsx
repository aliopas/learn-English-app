import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { lessonAPI } from '../lib/api'
import { RotateCcw, CheckCircle, XCircle, Brain, Trophy } from 'lucide-react'

const Flashcards = () => {
  const { userProfile, user } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })
  const [flashcards, setFlashcards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [masteredCards, setMasteredCards] = useState([]) // Cards the user knows
  const [isCompleted, setIsCompleted] = useState(false)

  // Get storage key for this user and day
  const getStorageKey = () => {
    if (!user || !userProfile) return null
    return `flashcards_progress_${user.id}_${userProfile.current_day}`
  }

  // Load saved progress from localStorage
  const loadProgress = () => {
    const key = getStorageKey()
    if (!key) return null

    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load flashcard progress:', e)
    }
    return null
  }

  // Save progress to localStorage
  const saveProgress = (newStats, newMastered, newIndex) => {
    const key = getStorageKey()
    if (!key) return

    try {
      localStorage.setItem(key, JSON.stringify({
        stats: newStats,
        masteredCards: newMastered,
        currentIndex: newIndex,
        lastUpdated: new Date().toISOString()
      }))
    } catch (e) {
      console.error('Failed to save flashcard progress:', e)
    }
  }

  // Fetch flashcards from database based on user's current day
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!userProfile?.current_day) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        // Fetch lesson data for current day
        const { data } = await lessonAPI.getLesson(userProfile.current_day)

        if (data.flashcards && Array.isArray(data.flashcards)) {
          // Map flashcards to expected format
          const mappedCards = data.flashcards.map((card, index) => ({
            id: card.id || index + 1,
            word: card.front || card.word,
            translation: card.back || card.translation,
            example: card.example || '',
            day: userProfile.current_day,
            level: data.level || 'A1'
          }))
          setFlashcards(mappedCards)

          // Load saved progress after flashcards are loaded
          const savedProgress = loadProgress()
          if (savedProgress) {
            setStats(savedProgress.stats || { correct: 0, incorrect: 0 })
            setMasteredCards(savedProgress.masteredCards || [])
            // Don't restore index, start fresh but keep stats
          }
        } else {
          setFlashcards([])
        }
      } catch (err) {
        console.error('Error fetching flashcards:', err)
        setError(err.message || 'Failed to load flashcards')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashcards()
  }, [userProfile?.current_day])

  const currentCard = flashcards[currentIndex]

  // Calculate progress percentage
  const totalAnswered = stats.correct + stats.incorrect
  const progressPercentage = flashcards.length > 0
    ? Math.round((totalAnswered / flashcards.length) * 100)
    : 0

  // Mastery percentage (cards marked as "known")
  const masteryPercentage = flashcards.length > 0
    ? Math.round((masteredCards.length / flashcards.length) * 100)
    : 0

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (isCorrect) => {
    const newStats = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1)
    }
    setStats(newStats)

    // Track mastered cards
    let newMastered = [...masteredCards]
    if (isCorrect && currentCard && !masteredCards.includes(currentCard.id)) {
      newMastered = [...masteredCards, currentCard.id]
      setMasteredCards(newMastered)
    }

    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        const newIndex = currentIndex + 1
        setCurrentIndex(newIndex)
        setIsFlipped(false)
        saveProgress(newStats, newMastered, newIndex)
      } else {
        // Completed all cards
        setIsCompleted(true)
        setIsFlipped(false)
        saveProgress(newStats, newMastered, 0)
      }
    }, 500)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setStats({ correct: 0, incorrect: 0 })
    setMasteredCards([])
    setIsCompleted(false)

    // Clear saved progress
    const key = getStorageKey()
    if (key) {
      localStorage.removeItem(key)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل البطاقات...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            حدث خطأ في تحميل البطاقات
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  // No cards available
  if (!currentCard || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            لا توجد بطاقات متاحة حالياً
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            أكمل دروسك لفتح المزيد من البطاقات التعليمية
          </p>
        </div>
      </div>
    )
  }

  // Completion screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 text-center max-w-lg"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            أحسنت! أكملت جميع البطاقات
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-green-700 dark:text-green-400">صحيحة</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-red-600">{stats.incorrect}</div>
              <div className="text-sm text-red-700 dark:text-red-400">خاطئة</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              نسبة الإتقان: {Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة المراجعة
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              نظام المراجعة الذكي
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            أتقن المفردات من خلال المراجعة المتباعدة
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>التقدم</span>
              <span>{totalAnswered} / {flashcards.length} بطاقة</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className="text-green-600">✓ {stats.correct} صحيحة</span>
              <span className="text-red-600">✗ {stats.incorrect} خاطئة</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {currentIndex + 1} / {flashcards.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">البطاقة الحالية</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.correct}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">إجابات صحيحة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold text-red-600 mb-2">{stats.incorrect}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">إجابات خاطئة</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="perspective-1000 mb-8"
        >
          <motion.div
            className="relative w-full h-[400px] cursor-pointer"
            onClick={handleFlip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {!isFlipped ? (
                <motion.div
                  key="front"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 glass rounded-3xl p-12 flex flex-col items-center justify-center backface-hidden"
                >
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-4">
                    المستوى {currentCard.level} • اليوم {currentCard.day}
                  </div>
                  <div className="text-6xl font-bold text-gray-800 dark:text-white mb-6" dir="ltr">
                    {currentCard.word}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    اضغط للترجمة 🔄
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: -90 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 glass-dark rounded-3xl p-12 flex flex-col items-center justify-center backface-hidden"
                >
                  <div className="text-5xl font-bold text-white mb-6">
                    {currentCard.translation}
                  </div>
                  {currentCard.example && (
                    <div className="text-xl text-gray-300 text-center mb-8" dir="ltr">
                      "{currentCard.example}"
                    </div>
                  )}
                  <div className="text-gray-400">
                    هل تعرف هذه الكلمة؟
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
            >
              <XCircle className="w-6 h-6" />
              لا أعرف
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-3 px-8 py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
            >
              <CheckCircle className="w-6 h-6" />
              أعرف
            </motion.button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto px-6 py-3 glass rounded-xl text-gray-700 dark:text-gray-300 hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة البدء
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Flashcards
