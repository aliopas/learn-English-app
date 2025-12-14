import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Link, useLocation } from 'react-router-dom'
import { Home, Map, Brain, BookOpen, Bot, Moon, Sun, LogOut, Gamepad2 } from 'lucide-react'

const Navbar = () => {
  const { darkMode, toggleDarkMode, signOut, userProfile } = useApp()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/roadmap', icon: Map, label: 'الخارطة' },
    { path: '/flashcards', icon: Brain, label: 'البطاقات' },
    { path: '/game', icon: Gamepad2, label: 'تحدي' },
    { path: '/ai-tutor', icon: Bot, label: 'المعلم' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div className="hidden min-[400px]:block">
              <h1 className="text-sm md:text-xl font-bold text-gray-800 dark:text-white">
                منصة إتقان
              </h1>
              {userProfile && (
                <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                  م{userProfile.current_level} • يوم {userProfile.current_day}
                </p>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-1 md:gap-2 flex-grow justify-end overflow-hidden">

            {/* Navigation Items container with horizontal scroll for very small devices */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient px-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${location.pathname === item.path
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-1 mr-1">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-all flex-shrink-0"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={signOut}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
