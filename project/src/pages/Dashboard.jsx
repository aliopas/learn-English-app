import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import ProgressCircle from '../components/ProgressCircle'
import { Flame, Clock, Target, TrendingUp, BookOpen, Mic, Headphones, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { userProfile, learningPath } = useApp()
  const navigate = useNavigate()

  if (!userProfile) return null

  const currentDay = userProfile.current_day
  const daysRemaining = 30 - currentDay + 1
  const todayLesson = learningPath.find(l => l.day === currentDay)

  const dailyTasks = [
    {
      id: 1,
      icon: BookOpen,
      title: `ابدأ الدرس ${currentDay}`,
      description: todayLesson?.title || 'تعلم أساسيات جديدة',
      completed: false,
      action: () => navigate(`/lesson/${currentDay}`)
    },
    {
      id: 2,
      icon: FileText,
      title: 'راجع كلماتك',
      description: `لديك ${userProfile.current_day * 5} كلمة للمراجعة`,
      completed: false,
      action: () => navigate('/flashcards')
    },
    {
      id: 3,
      icon: Mic,
      title: 'محادثة سريعة',
      description: 'تحدث مع المعلم الذكي',
      completed: false,
      action: () => navigate('/ai-tutor')
    },
    {
      id: 4,
      icon: Headphones,
      title: 'تمرين استماع',
      description: 'حسن مهارة الاستماع',
      completed: false,
      action: () => navigate(`/lesson/${currentDay}`)
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8 relative overflow-hidden"
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
                  className="text-4xl font-bold text-gray-800 dark:text-white mb-2"
                >
                  مرحباً بك في رحلتك! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-gray-600 dark:text-gray-300"
                >
                  مستواك الحالي: <span className="font-bold text-purple-600 dark:text-purple-400">{userProfile.current_level}</span>
                </motion.p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-lg shadow-lg"
              >
                <Flame className="w-6 h-6" />
                <span>{userProfile.streak_days} يوم متتالي</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mt-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">بقي لديك {daysRemaining} يوماً للوصول إلى B2</h2>
                  <p className="text-purple-100">أنت في اليوم {currentDay} من 30</p>
                </div>
                <div className="text-6xl">{currentDay <= 7 ? '🌱' : currentDay <= 14 ? '🌿' : currentDay <= 22 ? '🌳' : '🏆'}</div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentDay / 30) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">مهام اليوم 📝</h2>
            </div>

            <div className="space-y-4">
              {dailyTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={task.action}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all cursor-pointer group"
                  whileHover={{ x: -5 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                    } group-hover:scale-110 transition-transform`}>
                    <task.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                    {task.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إحصائيات</h2>
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
                <span className="font-bold text-xl text-gray-800 dark:text-white">{currentDay - 1} / 30</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">الكلمات المتقنة</span>
                </div>
                <span className="font-bold text-xl text-gray-800 dark:text-white">{(currentDay - 1) * 10}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            إتقان المهارات الأربع 🎯
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
