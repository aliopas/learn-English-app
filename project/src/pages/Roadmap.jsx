import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import RoadmapNode from '../components/RoadmapNode'
import { LEVELS } from '../data/learningData'
import { useNavigate } from 'react-router-dom'
import { Map } from 'lucide-react'
import { useState, useEffect } from 'react'
import { lessonAPI } from '../lib/api'

const Roadmap = () => {
  const { learningPath, userProfile } = useApp()
  const navigate = useNavigate()
  const [availableDays, setAvailableDays] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch available lessons from database
  useEffect(() => {
    const fetchAvailableLessons = async () => {
      try {
        console.log('🔍 Fetching available lessons from database...')
        const response = await lessonAPI.getAvailableLessons()
        console.log('📦 Available lessons response:', response)

        if (response.success && response.availableDays) {
          console.log('✅ Available days:', response.availableDays)
          setAvailableDays(response.availableDays)
        } else {
          console.warn('⚠️ No available days in response')
          setAvailableDays([])
        }
      } catch (error) {
        console.error('❌ Error fetching available lessons:', error)
        // On error, don't lock everything - allow current day at least
        setAvailableDays([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailableLessons()
  }, [])

  if (!userProfile) return null

  const currentDay = userProfile.current_day

  const handleNodeClick = (day) => {
    // Check if lesson has content in database
    const hasContent = availableDays.includes(day.day)

    // Allow navigation only if unlocked by progress AND has content in DB
    if (day.day <= currentDay && hasContent) {
      navigate(`/lesson/${day.day}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              خارطة الطريق إلى B2
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            رحلة 30 يوماً منظمة من المبتدئ إلى المتقدم
          </p>
        </motion.div>

        {Object.keys(LEVELS).map((levelKey, levelIndex) => {
          const level = LEVELS[levelKey]
          const levelLessons = learningPath.filter(l => l.level === levelKey)

          return (
            <motion.div
              key={levelKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIndex * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6 pr-4">
                <div
                  className="w-3 h-20 rounded-full"
                  style={{ backgroundColor: level.color }}
                />
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {level.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {level.days.length} أيام • الأيام {level.days[0]} - {level.days[level.days.length - 1]}
                  </p>
                </div>
              </div>

              <div className="pr-8 border-r-4 border-gray-200 dark:border-gray-700">
                {levelLessons.map((day) => {
                  // If availableDays is empty (API failed), be permissive and allow lessons up to current day
                  const hasContent = availableDays.length === 0 ? true : availableDays.includes(day.day)

                  // Locked if: user hasn't reached this day OR (no content in DB AND we have data)
                  const isLocked = day.day > currentDay || (availableDays.length > 0 && !hasContent)
                  const isCompleted = day.day < currentDay && hasContent
                  const isCurrent = day.day === currentDay && hasContent
                  // Show "coming soon" indicator if unlocked by progress but no content (only when we have API data)
                  const isComingSoon = availableDays.length > 0 && day.day <= currentDay && !hasContent

                  return (
                    <RoadmapNode
                      key={day.day}
                      day={day}
                      isLocked={isLocked}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      isComingSoon={isComingSoon}
                      onClick={() => handleNodeClick(day)}
                      levelColor={level.color}
                    />
                  )
                })}
              </div>
            </motion.div>
          )
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-8 text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            وجهتك النهائية
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            بعد 30 يوماً، ستصل إلى مستوى B2 وتتقن الإنجليزية بثقة!
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Roadmap
