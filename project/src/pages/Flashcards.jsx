import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { FLASHCARD_DATA } from '../data/learningData'
import { RotateCcw, CheckCircle, XCircle, Brain } from 'lucide-react'

const Flashcards = () => {
  const { userProfile } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })

  const currentDayCards = FLASHCARD_DATA.filter(
    card => userProfile && card.day <= userProfile.current_day
  ).slice(0, 30)

  const currentCard = currentDayCards[currentIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (isCorrect) => {
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1)
    }))

    setTimeout(() => {
      if (currentIndex < currentDayCards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
      } else {
        setCurrentIndex(0)
        setIsFlipped(false)
      }
    }, 500)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setStats({ correct: 0, incorrect: 0 })
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            لا توجد بطاقات متاحة حالياً
          </h2>
        </div>
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
          <p className="text-xl text-gray-600 dark:text-gray-300">
            أتقن المفردات من خلال المراجعة المتباعدة
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {currentIndex + 1} / {currentDayCards.length}
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
                  <div className="text-xl text-gray-300 text-center mb-8" dir="ltr">
                    "{currentCard.example}"
                  </div>
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
