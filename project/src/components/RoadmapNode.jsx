import { motion } from 'framer-motion'
import { Lock, CheckCircle, Circle, Clock } from 'lucide-react'

const RoadmapNode = ({ day, isLocked, isCompleted, isCurrent, isComingSoon, onClick, levelColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: day.day * 0.05 }}
      className="flex items-center gap-4 mb-6"
    >
      <div className="flex items-center">
        <motion.button
          onClick={onClick}
          disabled={isLocked || isComingSoon}
          whileHover={(!isLocked && !isComingSoon) ? { scale: 1.05 } : {}}
          whileTap={(!isLocked && !isComingSoon) ? { scale: 0.95 } : {}}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all
            ${isLocked ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' :
              isComingSoon ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 cursor-not-allowed border-2 border-amber-300' :
                isCompleted ? 'bg-green-500 text-white shadow-lg' :
                  isCurrent ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl' :
                    'glass text-gray-700 dark:text-white hover:shadow-lg'}`}
          style={{
            borderColor: !isLocked && !isCompleted && !isComingSoon ? levelColor : 'transparent',
            borderWidth: isCurrent ? '3px' : '0px'
          }}
        >
          {isLocked ? (
            <Lock className="w-6 h-6" />
          ) : isComingSoon ? (
            <Clock className="w-6 h-6" />
          ) : isCompleted ? (
            <CheckCircle className="w-8 h-8" />
          ) : (
            <span>{day.day}</span>
          )}
          {isCurrent && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ borderColor: levelColor }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.button>
      </div>

      <motion.div
        className={`flex-1 p-4 rounded-xl transition-all ${isLocked ? 'glass-dark opacity-50' :
            isComingSoon ? 'glass border-2 border-amber-300 bg-amber-50/50 dark:bg-amber-900/20' :
              isCurrent ? 'glass border-2 shadow-xl' : 'glass'
          }`}
        style={{
          borderColor: isCurrent ? levelColor : isComingSoon ? '#fcd34d' : 'transparent'
        }}
        whileHover={(!isLocked && !isComingSoon) ? { x: -5 } : {}}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              {day.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {day.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
              <span>⏱️ {day.estimatedTime}</span>
              <span>🎯 {day.skillFocus}</span>
              <span className="px-2 py-1 rounded-full" style={{ backgroundColor: `${levelColor}20`, color: levelColor }}>
                {day.levelName}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {isLocked ? null : isComingSoon ? (
              <div className="flex flex-col items-center">
                <span className="text-2xl">🔜</span>
                <span className="text-xs text-amber-600 font-medium mt-1">قريباً</span>
              </div>
            ) : (
              <div className="text-2xl">
                {isCompleted ? '✅' : isCurrent ? '▶️' : '📚'}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RoadmapNode
