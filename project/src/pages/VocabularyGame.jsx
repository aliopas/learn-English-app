import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useQuery } from '@tanstack/react-query'
import { lessonAPI } from '../lib/api'
import { useLesson } from '../hooks/useLesson'
import { Trophy, Star, ArrowRight, RotateCcw, Volume2, CheckCircle, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'



const VocabularyGame = () => {
    const { userProfile, updateUserProgress } = useApp()
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [userInput, setUserInput] = useState('')
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const [gameState, setGameState] = useState('playing') // playing, correct, incorrect, finished

    // Use useLesson to get data INSTANTLY from cache (hydrated by Dashboard)
    const { data: lessonData, isLoading: loading } = useLesson(userProfile?.current_day)

    // Extract words from the lesson data
    const words = lessonData?.vocabulary?.map((v, i) => ({
        id: i + 1,
        arabic: v.translation,
        english: v.word,
        level: lessonData.level || 'A1'
    })) || []

    // If loading or no words after loading
    if (loading || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    const currentWord = words[currentWordIndex]

    const handleCheck = () => {
        if (!userInput.trim()) return

        const isCorrect = userInput.toLowerCase().trim() === currentWord.english.toLowerCase()

        if (isCorrect) {
            setGameState('correct')
            setScore(prev => prev + 10)
            setStreak(prev => prev + 1)
            playSound('success')
            if (streak > 2) triggerConfetti()
        } else {
            setGameState('incorrect')
            setStreak(0)
            playSound('error')
        }
    }

    const handleNext = () => {
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(prev => prev + 1)
            setUserInput('')
            setGameState('playing')
        } else {
            setGameState('finished')
            updateProgress()
        }
    }

    const updateProgress = async () => {
        await updateUserProgress({
            total_study_minutes: (userProfile?.total_study_minutes || 0) + 5
        })
    }

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const playSound = (type) => {
        // يمكن إضافة مؤثرات صوتية هنا لاحقاً
    }

    const speakWord = (text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
    }

    if (words.length === 0) return <div>Loading...</div>

    if (gameState === 'finished') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 p-6 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass rounded-3xl p-8 max-w-md w-full text-center"
                >
                    <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">انتهى التحدي!</h2>
                    <div className="text-6xl font-bold text-purple-600 mb-6">{score}</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">نقاط ممتازة! استمر في التدريب للوصول إلى مستوى أعلى.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        لعب مرة أخرى
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 p-6 flex flex-col items-center pt-20">

            {/* Header Stats */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-12">
                <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span className="font-bold text-xl text-gray-800 dark:text-white">{score}</span>
                </div>
                <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
                    <Star className="w-6 h-6 text-orange-500" />
                    <span className="font-bold text-xl text-gray-800 dark:text-white">Streak: {streak}</span>
                </div>
            </div>

            {/* Game Card */}
            <div className="relative w-full max-w-md">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentWordIndex}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="glass rounded-3xl p-8 w-full relative overflow-hidden"
                    >
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 dark:bg-gray-700">
                            <motion.div
                                className="h-full bg-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
                            />
                        </div>

                        <div className="text-center mt-6 mb-8">
                            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">ترجم الكلمة</h3>
                            <div className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
                                {currentWord.arabic}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && gameState === 'playing' && handleCheck()}
                                placeholder="اكتب المعنى بالإنجليزية..."
                                disabled={gameState !== 'playing'}
                                className={`w-full p-4 text-center text-xl rounded-xl border-2 outline-none transition-all ${gameState === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                    gameState === 'incorrect' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                        'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                                    }`}
                                dir="ltr"
                                autoFocus
                            />

                            {gameState === 'playing' ? (
                                <button
                                    onClick={handleCheck}
                                    className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-purple-500/30"
                                >
                                    تحقق
                                </button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <div className={`p-4 rounded-xl flex items-center gap-3 ${gameState === 'correct' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                        }`}>
                                        {gameState === 'correct' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                        <div>
                                            <div className="font-bold text-lg">{gameState === 'correct' ? 'إجابة صحيحة!' : 'إجابة خاطئة'}</div>
                                            {gameState === 'incorrect' && (
                                                <div className="text-sm opacity-90">الإجابة الصحيحة: <strong>{currentWord.english}</strong></div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => speakWord(currentWord.english)}
                                            className="mr-auto p-2 hover:bg-black/5 rounded-full"
                                        >
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className={`w-full py-4 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 ${gameState === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-900'
                                            }`}
                                    >
                                        <span>{currentWordIndex < words.length - 1 ? 'التالي' : 'إنهاء'}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default VocabularyGame
