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
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-1.5 xs:gap-2 md:gap-3 flex-shrink-0">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-xs xs:text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                نُطقي
              </h1>
              {userProfile && (
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  م{userProfile.current_level} • يوم {userProfile.current_day}
                </p>
              )}
            </div>
          </Link>

          {/* Navigation Items + Actions */}
          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 flex-grow justify-end overflow-hidden">
            {/* Navigation Items container with horizontal scroll */}
            <div className="flex items-center gap-0.5 xs:gap-1 overflow-x-auto scrollbar-hide px-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 py-1.5 xs:py-2 rounded-lg xs:rounded-xl transition-all whitespace-nowrap ${location.pathname === item.path
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                >
                  <item.icon className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-[10px] xs:text-xs sm:text-sm hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Theme Toggle + Logout */}
            <div className="flex items-center gap-0.5 xs:gap-1 border-r border-gray-200 dark:border-gray-700 pr-0.5 xs:pr-1 mr-0.5 xs:mr-1 flex-shrink-0">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 xs:p-2 rounded-lg xs:rounded-xl text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-all"
              >
                {darkMode ? <Sun className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5" />}
              </button>

              <button
                onClick={signOut}
                className="p-1.5 xs:p-2 rounded-lg xs:rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4 xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}


export default Navbar
