import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { lessonAPI } from '../lib/api'
import { useLesson } from '../hooks/useLesson'
import { RotateCcw, CheckCircle, XCircle, Brain, Trophy, Keyboard, Zap } from 'lucide-react'

// Card States for Spaced Repetition
const CARD_STATE = {
  NEW: 'new',           // Never seen
  LEARNING: 'learning', // Seen 1-2 times
  MASTERED: 'mastered'  // Seen 3+ times correctly
}

const Flashcards = () => {
  const { userProfile, user } = useApp()
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })
  const [allCards, setAllCards] = useState([]) // Original cards from DB
  const [cardQueue, setCardQueue] = useState([]) // Current learning queue
  const [currentCard, setCurrentCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cardProgress, setCardProgress] = useState({}) // Track each card's progress
  const [isCompleted, setIsCompleted] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null) // For animation

  // Get storage key for this user and day
  const getStorageKey = () => {
    if (!user || !userProfile) return null
    return `flashcards_srs_${user.id}_${userProfile.current_day}`
  }

  // Shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
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
  const saveProgress = useCallback((newStats, newCardProgress, newQueue, currentCardData) => {
    const key = getStorageKey()
    if (!key) return

    try {
      localStorage.setItem(key, JSON.stringify({
        stats: newStats,
        cardProgress: newCardProgress,
        queue: newQueue,
        currentCard: currentCardData,
        lastUpdated: new Date().toISOString()
      }))
    } catch (e) {
      console.error('Failed to save flashcard progress:', e)
    }
  }, [getStorageKey])

  // Initialize card progress tracking
  const initializeCardProgress = (cards) => {
    const progress = {}
    cards.forEach(card => {
      progress[card.id] = {
        correctCount: 0,
        incorrectCount: 0,
        state: CARD_STATE.NEW,
        lastSeen: null,
        reviewCount: 0
      }
    })
    return progress
  }

  // Get card state based on progress
  const getCardState = (cardId) => {
    const progress = cardProgress[cardId]
    if (!progress) return CARD_STATE.NEW

    if (progress.correctCount >= 3) return CARD_STATE.MASTERED
    if (progress.reviewCount > 0) return CARD_STATE.LEARNING
    return CARD_STATE.NEW
  }

  // React Query Hooks for Data Fetching (Leverages Cache)
  const { data: currentLessonData, isLoading: isLoadingCurrent } = useLesson(userProfile?.current_day);
  const { data: prevLessonData, isLoading: isLoadingPrev } = useLesson(
    userProfile?.current_day > 1 ? userProfile?.current_day - 1 : null,
    { enabled: !!userProfile?.current_day && userProfile.current_day > 1 }
  );

  useEffect(() => {
    // Logic to select which cards to show
    const loadCards = () => {
      if (!userProfile?.current_day) return;

      let flashcardsData = null;
      let foundDay = null;

      // 1. Try current day
      if (currentLessonData?.flashcards?.length > 0) {
        flashcardsData = currentLessonData;
        foundDay = userProfile.current_day;
      }
      // 2. Fallback to previous day
      else if (prevLessonData?.flashcards?.length > 0) {
        flashcardsData = prevLessonData;
        foundDay = userProfile.current_day - 1;
        console.log(`Using flashcards from previous day ${foundDay}`);
      }

      if (flashcardsData) {
        // ... (Existing internal processing logic)
        const mappedCards = flashcardsData.flashcards.map((card, index) => ({
          id: card.id || `card_${index + 1}`,
          word: card.front || card.word,
          translation: card.back || card.translation,
          example: card.example || '',
          day: foundDay,
          level: flashcardsData.level || 'A1'
        }));

        const savedProgress = loadProgress();

        if (savedProgress && savedProgress.queue && savedProgress.queue.length > 0) {
          setAllCards(mappedCards);
          setCardProgress(savedProgress.cardProgress || initializeCardProgress(mappedCards));
          setStats(savedProgress.stats || { correct: 0, incorrect: 0 });
          setCardQueue(savedProgress.queue);
          setCurrentCard(savedProgress.currentCard || savedProgress.queue[0]);
        } else {
          const shuffled = shuffleArray(mappedCards);
          setAllCards(mappedCards);
          setCardProgress(initializeCardProgress(mappedCards));
          setCardQueue(shuffled);
          setCurrentCard(shuffled[0]);
        }
        setIsLoading(false);
      } else {
        // Only stop loading if both requests finished and found nothing
        if (!isLoadingCurrent && (!isLoadingPrev || userProfile.current_day <= 1)) {
          setAllCards([]);
          setIsLoading(false);
        }
      }
    };

    loadCards();
  }, [currentLessonData, prevLessonData, userProfile, isLoadingCurrent, isLoadingPrev]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      // Space bar - flip card
      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      }

      // Only allow answers when card is flipped
      if (isFlipped) {
        // Arrow Left or X - Don't know
        if (e.code === 'ArrowLeft' || e.code === 'KeyX') {
          e.preventDefault()
          handleAnswer(false)
        }
        // Arrow Right or C - Know
        if (e.code === 'ArrowRight' || e.code === 'KeyC') {
          e.preventDefault()
          handleAnswer(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, currentCard])

  // Calculate stats
  const newCardsCount = Object.values(cardProgress).filter(p => p.state === CARD_STATE.NEW).length
  const learningCardsCount = Object.values(cardProgress).filter(p => p.state === CARD_STATE.LEARNING).length
  const masteredCardsCount = Object.values(cardProgress).filter(p => p.state === CARD_STATE.MASTERED).length
  const totalAnswered = stats.correct + stats.incorrect
  const progressPercentage = allCards.length > 0 ? Math.round((totalAnswered / allCards.length) * 100) : 0

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (isCorrect) => {
    if (!currentCard) return

    // Update stats
    const newStats = {
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1)
    }
    setStats(newStats)

    // Update card progress
    const newCardProgress = { ...cardProgress }
    const cardId = currentCard.id

    if (!newCardProgress[cardId]) {
      newCardProgress[cardId] = {
        correctCount: 0,
        incorrectCount: 0,
        state: CARD_STATE.NEW,
        lastSeen: null,
        reviewCount: 0
      }
    }

    newCardProgress[cardId].correctCount += isCorrect ? 1 : 0
    newCardProgress[cardId].incorrectCount += isCorrect ? 0 : 1
    newCardProgress[cardId].reviewCount += 1
    newCardProgress[cardId].lastSeen = new Date().toISOString()

    // Update state based on correct count
    if (newCardProgress[cardId].correctCount >= 3) {
      newCardProgress[cardId].state = CARD_STATE.MASTERED
    } else if (newCardProgress[cardId].reviewCount > 0) {
      newCardProgress[cardId].state = CARD_STATE.LEARNING
    }

    setCardProgress(newCardProgress)

    // Set swipe animation
    setSwipeDirection(isCorrect ? 'right' : 'left')

    setTimeout(() => {
      // Spaced Repetition Logic
      let newQueue = [...cardQueue.slice(1)] // Remove current card

      // If incorrect, add card back to queue (sooner)
      if (!isCorrect) {
        const insertPosition = Math.min(3, Math.floor(newQueue.length / 3)) // Add back after 3 cards or 1/3 of queue
        newQueue.splice(insertPosition, 0, currentCard)
      } else if (newCardProgress[cardId].correctCount < 3) {
        // If correct but not mastered, add back later in queue
        const insertPosition = Math.min(newQueue.length, Math.floor(newQueue.length * 0.7)) // Add to last 30%
        newQueue.splice(insertPosition, 0, currentCard)
      }
      // If mastered (3+ correct), don't add back to queue

      setCardQueue(newQueue)

      // Check if completed
      if (newQueue.length === 0) {
        setIsCompleted(true)
        setIsFlipped(false)
        setSwipeDirection(null)
        saveProgress(newStats, newCardProgress, [], null)
      } else {
        const nextCard = newQueue[0]
        setCurrentCard(nextCard)
        setIsFlipped(false)
        setSwipeDirection(null)
        saveProgress(newStats, newCardProgress, newQueue, nextCard)
      }
    }, 500)
  }

  const handleReset = () => {
    const shuffled = shuffleArray(allCards)
    setCardQueue(shuffled)
    setCurrentCard(shuffled[0])
    setIsFlipped(false)
    setStats({ correct: 0, incorrect: 0 })
    setCardProgress(initializeCardProgress(allCards))
    setIsCompleted(false)
    setSwipeDirection(null)

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
  if (!currentCard && allCards.length === 0) {
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
    const accuracy = stats.correct + stats.incorrect > 0
      ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
      : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 text-center max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-8xl mb-6"
          >
            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🎉' : '💪'}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {accuracy >= 80 ? 'ممتاز! إتقان رائع!' : accuracy >= 60 ? 'أحسنت! واصل التقدم' : 'جيد! استمر في التعلم'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            أكملت جميع البطاقات في هذه الجلسة
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-blue-600" dir="ltr">
                <span>🆕</span>
                <span>{newCardsCount}</span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-400">جديدة</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-yellow-600" dir="ltr">
                <span>📚</span>
                <span>{learningCardsCount}</span>
              </div>
              <div className="text-xs text-yellow-700 dark:text-yellow-400">قيد التعلم</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-green-600" dir="ltr">
                <span>✅</span>
                <span>{masteredCardsCount}</span>
              </div>
              <div className="text-xs text-green-700 dark:text-green-400">متقنة</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-green-700 dark:text-green-400">إجابات صحيحة</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-red-600">{stats.incorrect}</div>
              <div className="text-sm text-red-700 dark:text-red-400">للمراجعة</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              نسبة الدقة: {accuracy}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className={`h-full rounded-full ${accuracy >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  accuracy >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
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
            جلسة مراجعة جديدة
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-3 xs:p-4 sm:p-5 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 mb-4 xs:mb-6 sm:mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 xs:gap-3 mb-3 xs:mb-4">
            <Brain className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-purple-600" />
            <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              نظام المراجعة الذكي
            </h1>
            <Zap className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-yellow-500" />
          </div>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 xs:mb-5 sm:mb-6">
            نظام تكرار متباعد لإتقان أسرع وأفضل
          </p>

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden sm:flex items-center justify-center gap-3 xs:gap-4 text-xs xs:text-sm text-gray-500 dark:text-gray-400 mb-4 xs:mb-5 sm:mb-6">
            <div className="flex items-center gap-1">
              <Keyboard className="w-4 h-4" />
              <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Space</span>
              <span>للقلب</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">←</span>
              <span>لا أعرف</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">→</span>
              <span>أعرف</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>التقدم في الجلسة</span>
              <span>{totalAnswered} / {allCards.length} إجابة</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-purple-100 dark:border-white/10 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 text-center shadow-lg">
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-0.5 xs:mb-1">
              {cardQueue.length}
            </div>
            <div className="text-[10px] xs:text-xs text-gray-600 dark:text-gray-300">متبقية</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-blue-50 dark:bg-blue-900/20 backdrop-blur-xl border border-blue-100 dark:border-blue-500/20 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 text-lg xs:text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-0.5 xs:mb-1" dir="ltr">
              <span>🆕</span>
              <span>{newCardsCount}</span>
            </div>
            <div className="text-[10px] xs:text-xs text-blue-700 dark:text-blue-300">جديدة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 backdrop-blur-xl border border-yellow-100 dark:border-yellow-500/20 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 text-lg xs:text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-0.5 xs:mb-1" dir="ltr">
              <span>📚</span>
              <span>{learningCardsCount}</span>
            </div>
            <div className="text-[10px] xs:text-xs text-yellow-700 dark:text-yellow-300">قيد التعلم</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-green-50 dark:bg-green-900/20 backdrop-blur-xl border border-green-100 dark:border-green-500/20 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 text-lg xs:text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 mb-0.5 xs:mb-1" dir="ltr">
              <span>✅</span>
              <span>{masteredCardsCount}</span>
            </div>
            <div className="text-[10px] xs:text-xs text-green-700 dark:text-green-300">متقنة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 xs:col-span-1 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-xl border border-purple-200 dark:border-purple-500/20 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 text-center shadow-lg">
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-0.5 xs:mb-1">
              {stats.correct > 0 ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) : 0}%
            </div>
            <div className="text-[10px] xs:text-xs text-purple-700 dark:text-purple-300">دقة</div>
          </motion.div>
        </div>

        {/* Flashcard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="perspective-1000 mb-4 xs:mb-6 sm:mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id}
              initial={{
                opacity: 0,
                x: swipeDirection === 'right' ? -100 : swipeDirection === 'left' ? 100 : 0,
                scale: 0.9
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
                rotate: swipeDirection === 'right' ? 20 : swipeDirection === 'left' ? -20 : 0,
                scale: 0.8
              }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-[300px] xs:h-[350px] sm:h-[400px] cursor-pointer"
              onClick={handleFlip}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-full"
              >
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-white dark:bg-gradient-to-br dark:from-indigo-900 dark:to-purple-900 rounded-3xl p-12 flex flex-col items-center justify-center backface-hidden shadow-2xl border-2 border-purple-50 dark:border-white/10"
                    >
                      <div className="flex gap-2 mb-4">
                        <div className="text-sm text-purple-600 dark:text-purple-300 font-medium bg-purple-50 dark:bg-white/10 px-4 py-1 rounded-full border border-purple-100 dark:border-transparent">
                          {currentCard?.level} • Day {currentCard?.day}
                        </div>
                        <div className={`text-sm font-medium px-4 py-1 rounded-full border ${getCardState(currentCard?.id) === CARD_STATE.MASTERED
                          ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-400' :
                          getCardState(currentCard?.id) === CARD_STATE.LEARNING
                            ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                          {getCardState(currentCard?.id) === CARD_STATE.MASTERED ? '✅ متقنة' :
                            getCardState(currentCard?.id) === CARD_STATE.LEARNING ? '📚 قيد التعلم' :
                              '🆕 جديدة'}
                        </div>
                      </div>
                      <div className="text-4xl xs:text-5xl sm:text-6xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-5 sm:mb-6 tracking-wide" dir="ltr">
                        {currentCard?.word}
                      </div>
                      <div className="text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-2 text-sm">
                        <RotateCcw className="w-4 h-4" />
                        اضغط أو Space للترجمة
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-black/40 dark:to-purple-900/40 backdrop-blur-3xl rounded-3xl p-12 flex flex-col items-center justify-center backface-hidden shadow-2xl border-2 border-purple-100 dark:border-white/10"
                    >
                      <div className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-5 sm:mb-6">
                        {currentCard?.translation}
                      </div>
                      {currentCard?.example && (
                        <div className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8 italic max-w-lg" dir="ltr">
                          "{currentCard.example}"
                        </div>
                      )}
                      <div className="text-gray-400 text-sm">
                        هل تعرف هذه الكلمة؟
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Answer Buttons */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(false)}
              className="flex items-center gap-2 xs:gap-3 px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl xs:rounded-2xl font-bold text-sm xs:text-base sm:text-lg hover:shadow-2xl transition-all">
              <XCircle className="w-7 h-7" />
              <div>
                <div>لا أعرف</div>
                <div className="text-xs opacity-80">← أو X</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(true)}
              className="flex items-center gap-2 xs:gap-3 px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl xs:rounded-2xl font-bold text-sm xs:text-base sm:text-lg hover:shadow-2xl transition-all">
              <div>
                <div>أعرف</div>
                <div className="text-xs opacity-80">→ أو C</div>
              </div>
              <CheckCircle className="w-7 h-7" />
            </motion.button>
          </motion.div>
        )}

        {/* Reset Button */}
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
            إعادة خلط البطاقات
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Flashcards
