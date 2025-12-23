import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import ProgressCircle from '../components/ProgressCircle'
import { Flame, Clock, Target, TrendingUp, BookOpen, Mic, Headphones, FileText, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LEVELS, COURSE_INFO } from '../data/learningData'
import { useInitialAppData } from '../hooks/useInitialAppData'
import { useSmartLessons } from '../hooks/useSmartLessons'

const Dashboard = () => {
  const { userProfile } = useApp()
  const navigate = useNavigate()

  // 1. Get Global App Data (Cached from Roadmap)
  const { data: initialData } = useInitialAppData()
  const availableDays = initialData?.availableDays || []

  // 2. Smart Fetch Current + Next Lessons (Hydrates Cache)
  const { lessons: smartLessons } = useSmartLessons(userProfile?.current_day)

  if (!userProfile) return null

  const currentDay = userProfile.current_day

  // Get current lesson title from Smart Cache or Fallback to Initial Metadata
  const currentLessonSmart = smartLessons.find(l => l.day === currentDay);
  const currentLessonMeta = initialData?.lessons?.find(l => l.day === currentDay);

  const lessonTitle = currentLessonSmart?.title || currentLessonMeta?.title || '';



  // Determine current level and next level based on day
  const getCurrentLevelInfo = () => {
    let currentLevel, nextLevel, levelStart, levelEnd, dayInLevel, daysInLevel

    if (currentDay <= 30) {
      currentLevel = 'A1'
      nextLevel = 'A2'
      levelStart = 1
      levelEnd = 30
      daysInLevel = 30
      dayInLevel = currentDay
    } else if (currentDay <= 60) {
      currentLevel = 'A2'
      nextLevel = 'B1'
      levelStart = 31
      levelEnd = 60
      daysInLevel = 30
      dayInLevel = currentDay - 30
    } else if (currentDay <= 90) {
      currentLevel = 'B1'
      nextLevel = 'B2'
      levelStart = 61
      levelEnd = 90
      daysInLevel = 30
      dayInLevel = currentDay - 60
    } else {
      currentLevel = 'B2'
      nextLevel = 'إتقان'
      levelStart = 91
      levelEnd = 120
      daysInLevel = 30
      dayInLevel = currentDay - 90
    }

    const daysRemaining = levelEnd - currentDay + 1
    const levelProgress = (dayInLevel / daysInLevel) * 100

    return {
      currentLevel: LEVELS[currentLevel].name,
      nextLevel,
      levelStart,
      levelEnd,
      dayInLevel,
      daysInLevel,
      daysRemaining,
      levelProgress
    }
  }

  const levelInfo = getCurrentLevelInfo()

  // Check if current day has content
  const currentDayHasContent = availableDays.length === 0 || availableDays.includes(currentDay)

  // Navigate to lesson with content check
  const navigateToLesson = (day) => {
    const hasContent = availableDays.length === 0 || availableDays.includes(day)
    if (hasContent) {
      navigate(`/lesson/${day}`)
    } else {
      // Show message or redirect to roadmap
      navigate('/roadmap')
    }
  }

  // Check if user has completed at least one lesson
  const hasCompletedLesson = currentDay > 1 && availableDays.filter(d => d < currentDay).length > 0

  const dailyTasks = [
    {
      id: 1,
      icon: BookOpen,
      title: `ابدأ الدرس ${currentDay}`,
      description: currentDayHasContent
        ? (lessonTitle || `درس اليوم ${currentDay}`)
        : 'هذا الدرس قيد الإعداد',
      completed: false,
      action: () => navigateToLesson(currentDay),
      disabled: !currentDayHasContent,
      lockIcon: !currentDayHasContent
    },
    {
      id: 2,
      icon: FileText,
      title: 'راجع كلماتك',
      description: hasCompletedLesson
        ? `لديك ${availableDays.filter(d => d < currentDay).length * 10} كلمة للمراجعة`
        : 'أكمل الدرس الأول لتبدأ المراجعة',
      completed: false,
      action: () => navigate('/flashcards'),
      disabled: !hasCompletedLesson,
      lockIcon: !hasCompletedLesson
    },
    {
      id: 3,
      icon: Mic,
      title: 'المعلم الذكي',
      description: 'قريباً جداً',
      completed: false,
      action: () => { },
      disabled: true,
      lockIcon: false,
      blur: true // Special blur effect
    },
    {
      id: 4,
      icon: Headphones,
      title: 'تمرين الاستماع',
      description: currentDayHasContent
        ? 'استمع وتعلم من الدرس'
        : 'سيتوفر مع الدرس',
      completed: false,
      action: () => {
        if (currentDayHasContent) {
          navigate(`/lesson/${currentDay}#listening`)
        }
      },
      disabled: !currentDayHasContent,
      lockIcon: !currentDayHasContent
    }
  ]

  // Get emoji based on current level
  const getLevelEmoji = () => {
    if (currentDay <= 30) return '🌱' // A1
    if (currentDay <= 60) return '🌿' // A2
    if (currentDay <= 90) return '🌳' // B1
    return '🏆' // B2
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-3 xs:p-4 sm:p-5 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 mb-4 xs:mb-6 sm:mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2"
                >
                  مرحباً بك في رحلتك! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300"
                >
                  مستواك الحالي: <span className="font-bold text-purple-600 dark:text-purple-400">{levelInfo.currentLevel}</span>
                </motion.p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-lg"
              >
                <Flame className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                <span>{userProfile.streak_days} يوم متتالي</span>
              </motion.div>
            </div>

            {/* Level Progress Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 mt-4 xs:mt-5 sm:mt-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-2">
                    بقي لديك {levelInfo.daysRemaining} يوم للوصول إلى {levelInfo.nextLevel}
                  </h2>
                  <p className="text-xs xs:text-sm sm:text-base text-purple-100">
                    أنت في اليوم {levelInfo.dayInLevel} من {levelInfo.daysInLevel} • {levelInfo.currentLevel}
                  </p>
                  <p className="text-purple-200 text-[10px] xs:text-xs sm:text-sm mt-1">
                    اليوم {currentDay} من {COURSE_INFO.totalDays} إجمالي
                  </p>
                </div>
                <div className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl flex-shrink-0">{getLevelEmoji()}</div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.levelProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <div className="mt-2 text-right text-purple-100 text-xs xs:text-sm">
                {Math.round(levelInfo.levelProgress)}% مكتمل في {levelInfo.currentLevel}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-4 xs:mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6">
              <Target className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-purple-600" />
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">مهام اليوم 📝</h2>
            </div>

            <div className="space-y-4">
              {dailyTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={task.disabled ? undefined : task.action}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 transition-all ${task.blur
                    ? 'opacity-60 cursor-not-allowed border-2 border-purple-200 dark:border-purple-800'
                    : task.disabled
                      ? 'opacity-70 cursor-not-allowed border-2 border-dashed border-gray-300 dark:border-gray-600'
                      : 'hover:shadow-lg cursor-pointer group border-2 border-transparent hover:border-purple-200'
                    }`}
                  whileHover={task.disabled || task.blur ? {} : { x: -5 }}
                  style={task.blur ? { filter: 'blur(0.3px)', backdropFilter: 'blur(2px)' } : {}}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.blur
                    ? 'bg-purple-100 text-purple-400 dark:bg-purple-900/30 dark:text-purple-500'
                    : task.disabled
                      ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                      : task.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform'
                    }`}>
                    <task.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      {task.title}
                      {task.lockIcon && (
                        <Lock className="w-4 h-4 text-amber-500" />
                      )}
                      {task.blur && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 rounded-full">
                          قريباً
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${task.blur
                    ? 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
                    : task.lockIcon
                      ? 'bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
                      : task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                    {task.blur ? (
                      <span className="text-purple-600 dark:text-purple-400 text-sm">⏳</span>
                    ) : task.lockIcon ? (
                      <Lock className="w-4 h-4 text-amber-600" />
                    ) : task.completed ? (
                      <span className="text-white text-xs">✓</span>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8"
          >
            <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6">
              <TrendingUp className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-purple-600" />
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">إحصائيات</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">إجمالي الدراسة</span>
                </div>
                <span className="font-bold text-xl text-gray-800 dark:text-white">{userProfile.total_study_minutes} دقيقة</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">الدروس المكتملة</span>
                </div>
                <span className="font-bold text-xl text-gray-800 dark:text-white">{currentDay - 1} / {COURSE_INFO.totalDays}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">الكلمات المتقنة</span>
                </div>
                <span className="font-bold text-xl text-gray-800 dark:text-white">{availableDays.filter(d => d < currentDay).length * 10}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8"
        >
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 xs:mb-6 sm:mb-8 text-center">
            إتقان المهارات الأربع 🎯
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
            <ProgressCircle skill="الاستماع" score={userProfile.listening_score} color="#3b82f6" />
            <ProgressCircle skill="القراءة" score={userProfile.reading_score} color="#10b981" />
            <ProgressCircle skill="التحدث" score={userProfile.speaking_score} color="#f59e0b" />
            <ProgressCircle skill="القواعد" score={userProfile.grammar_score} color="#8b5cf6" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
