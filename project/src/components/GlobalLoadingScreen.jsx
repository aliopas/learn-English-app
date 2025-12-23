import { motion } from 'framer-motion'
import { BookOpen, Loader2 } from 'lucide-react'

const GlobalLoadingScreen = ({ message = "جاري تحميل البيانات..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                {/* Icon with pulse animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl"
                >
                    <BookOpen className="w-12 h-12 text-white" />
                </motion.div>

                {/* Loading spinner */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {message}
                    </h2>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-purple-600 rounded-full"
                        />
                    ))}
                </div>

                <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                    يتم تحضير كل شيء لك...
                </p>
            </motion.div>
        </div>
    )
}

export default GlobalLoadingScreen
