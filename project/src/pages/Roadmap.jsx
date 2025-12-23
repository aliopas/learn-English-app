import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import RoadmapNode from '../components/RoadmapNode'
import { LEVELS, COURSE_INFO } from '../data/learningData'
import { useNavigate } from 'react-router-dom'
import { Map, CheckCircle2, Clock, Sparkles, Calendar, Lock } from 'lucide-react'
import { useInitialAppData } from '../hooks/useInitialAppData'

const Roadmap = () => {
  const { userProfile } = useApp()
  const navigate = useNavigate()

  // 🚀 Use cached data instead of N+1 queries!
  const { data: initialData, isLoading } = useInitialAppData()

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const currentDay = userProfile.current_day

  // Extract data from cache
  const availableDays = initialData?.availableDays || []
  const lessons = initialData?.lessons || []

  // Create a quick lookup map for titles
  const lessonTitles = {}
  lessons.forEach(lesson => {
    lessonTitles[lesson.day] = lesson.title
  })

  // Calculate overall stats
  const totalLessons = COURSE_INFO.totalDays
  const availableCount = availableDays.length
  const completedCount = availableDays.filter(d => d < currentDay).length
  const comingSoonCount = totalLessons - availableCount

  const handleNodeClick = (day) => {
    const hasContent = availableDays.includes(day)
    if (day <= currentDay && hasContent) {
      navigate(`/lesson/${day}`)
    }
  }

  // Generate lesson data for display
  const generateLessonData = (day, levelKey) => {
    const hasContent = availableDays.includes(day)
    const title = lessonTitles[day] || (hasContent ? `درس اليوم ${day}` : 'قيد التطوير')
    const level = LEVELS[levelKey]

    return {
      day: day,
      title: title,
      description: hasContent ? 'انقر للبدء' : 'سيتم إضافة هذا الدرس قريباً',
      level: levelKey,
      levelName: level.name,
      estimatedTime: hasContent ? '60 دقيقة' : '~ دقيقة',
      skillFocus: hasContent ? 'متنوع' : 'قريباً'
    }
  }

  // Determine which days to show
  const getDisplayDays = () => {
    // Always show first week (Days 1-7) of A1
    const firstWeek = Array.from({ length: 7 }, (_, i) => i + 1)

    // Add 3-4 upcoming days after the last available day
    const maxAvailableDay = Math.max(...availableDays, 0)
    const upcomingDays = Array.from({ length: 4 }, (_, i) => maxAvailableDay + i + 1)
      .filter(day => day <= 120 && day > 7) // Don't duplicate first week

    return {
      firstWeek,
      upcoming: upcomingDays.slice(0, 4) // Max 4 days
    }
  }

  const { firstWeek, upcoming } = getDisplayDays()

  // Calculate stats per level
  const getLevelStats = (levelKey) => {
    const level = LEVELS[levelKey]
    const levelDays = level.days
    const levelAvailable = availableDays.filter(d => levelDays.includes(d)).length
    const levelCompleted = availableDays.filter(d => levelDays.includes(d) && d < currentDay).length

    return {
      total: levelDays.length,
      available: levelAvailable,
      completed: levelCompleted,
      progress: levelDays.length > 0 ? (levelCompleted / levelDays.length) * 100 : 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-3 xs:p-4 sm:p-5 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 mb-4 xs:mb-6 sm:mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 xs:gap-3 mb-3 xs:mb-4">
            <Map className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-purple-600" />
            <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              خارطة الطريق إلى B2
            </h1>
          </div>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
            رحلة 120 يوماً منظمة من المبتدئ إلى المتقدم
          </p>
          <p className="text-xs xs:text-sm text-purple-600 dark:text-purple-400">
            4 مستويات • كل مستوى 30 يوم
          </p>

          {/* Overall Progress Bar */}
          <div className="max-w-2xl mx-auto mt-4 xs:mt-5 sm:mt-6">
            <div className="flex justify-between text-xs xs:text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>التقدم الإجمالي</span>
              <span>{completedCount} من {totalLessons} درس</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalLessons) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Content Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 mb-4 xs:mb-6 sm:mb-8"
        >
          <h3 className="text-base xs:text-lg font-bold text-gray-800 dark:text-white mb-3 xs:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 xs:w-5 xs:h-5 text-purple-600" />
            ملخص المحتوى المتاح
          </h3>
          <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
            <div className="text-center p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-green-600 mb-1">{availableCount}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-700 dark:text-green-400 flex items-center justify-center gap-0.5 xs:gap-1">
                <CheckCircle2 className="w-3 h-3 xs:w-4 xs:h-4" />
                متاح الآن
              </div>
            </div>
            <div className="text-center p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{completedCount}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-blue-700 dark:text-blue-400 flex items-center justify-center gap-0.5 xs:gap-1">
                <Sparkles className="w-3 h-3 xs:w-4 xs:h-4" />
                مكتمل
              </div>
            </div>
            <div className="text-center p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-amber-600 mb-1">{comingSoonCount}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-amber-700 dark:text-amber-400 flex items-center justify-center gap-0.5 xs:gap-1">
                <Clock className="w-3 h-3 xs:w-4 xs:h-4" />
                قيد التطوير
              </div>
            </div>
          </div>
          <p className="text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-3 xs:mt-4">
            💡 نضيف دروساً جديدة باستمرار - راقب هذه الصفحة للتحديثات
          </p>
        </motion.div>

        {/* A1 Level - First Week (Detailed View) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Level Header */}
          <div className="glass rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 mb-4 xs:mb-5 sm:mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-16 rounded-full bg-green-500" />
              <div className="flex-1">
                <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {LEVELS.A1.name}
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  30 يوم • الأيام 1 - 30
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {LEVELS.A1.description}
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{getLevelStats('A1').available}</div>
                <div className="text-xs text-gray-500">درس متاح من {getLevelStats('A1').total}</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>تقدمك في {LEVELS.A1.name}</span>
                <span>{Math.round(getLevelStats('A1').progress)}% مكتمل</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelStats('A1').progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full bg-green-500"
                />
              </div>
            </div>
          </div>

          {/* First Week Lessons */}
          <div className="pr-8 border-r-4 border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4 mr-[-2rem]"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg bg-green-500">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  الأسبوع الأول
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  الأيام 1-7 • {availableDays.filter(d => d >= 1 && d <= 7).length} من 7 متاح
                </p>
              </div>
            </motion.div>

            {firstWeek.map((day) => {
              const hasContent = availableDays.includes(day)
              const isLocked = day > currentDay || !hasContent
              const isCompleted = day < currentDay && hasContent
              const isCurrent = day === currentDay && hasContent
              const isComingSoon = !hasContent
              const dayData = generateLessonData(day, 'A1')

              return (
                <RoadmapNode
                  key={day}
                  day={dayData}
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isComingSoon={isComingSoon}
                  onClick={() => handleNodeClick(day)}
                  levelColor={LEVELS.A1.color}
                />
              )
            })}
          </div>
        </motion.div>

        {/* Upcoming Days Preview (if any) */}
        {upcoming.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    دروس قادمة قريباً
                  </h3>
                  <p className="text-sm text-gray-500">سيتم فتحها بعد إكمال الدروس المتاحة</p>
                </div>
              </div>
            </div>

            <div className="pr-8 border-r-4 border-amber-300 dark:border-amber-700">
              {upcoming.map((day) => {
                // Determine which level this day belongs to
                const levelKey = day <= 30 ? 'A1' : day <= 60 ? 'A2' : day <= 90 ? 'B1' : 'B2'
                const dayData = generateLessonData(day, levelKey)
                return (
                  <RoadmapNode
                    key={day}
                    day={dayData}
                    isLocked={true}
                    isCompleted={false}
                    isCurrent={false}
                    isComingSoon={true}
                    onClick={() => { }}
                    levelColor={LEVELS[levelKey].color}
                  />
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Remaining Levels Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 xs:mb-4">المستويات القادمة</h3>

          {['A2', 'B1', 'B2'].map((levelKey, index) => {
            const level = LEVELS[levelKey]
            const stats = getLevelStats(levelKey)

            return (
              <motion.div
                key={levelKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-3 h-20 rounded-full"
                    style={{ backgroundColor: level.color }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {level.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {level.days.length} يوم • الأيام {level.dayRange.start} - {level.dayRange.end}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {level.description}
                    </p>

                    {/* Progress in this level */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>{stats.available} من {stats.total} متاح</span>
                        <span>{Math.round(stats.progress)}% مكتمل</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: level.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {stats.available === 0 && (
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">مقفل</span>
                    </div>
                  )}

                  {stats.available > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                      <div className="text-xs text-gray-500">متاح</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Final Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 text-center"
        >
          <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">🏆</div>
          <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
            وجهتك النهائية
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            بعد 120 يوماً (4 أشهر)، ستصل إلى مستوى B2 وتتقن الإنجليزية بثقة!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>📚 {COURSE_INFO.totalLevels} مستويات</span>
            <span>•</span>
            <span>📅 {COURSE_INFO.totalDays} يوم</span>
            <span>•</span>
            <span>⏱️ ~{COURSE_INFO.totalDays * 60} دقيقة تعلم</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Roadmap
