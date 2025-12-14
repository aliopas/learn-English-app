import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { AI_SCENARIOS } from '../data/learningData'
import { Send, Bot, User, AlertCircle, Sparkles } from 'lucide-react'

const AITutor = () => {
  // ⚠️ FEATURE TEMPORARILY DISABLED
  const FEATURE_DISABLED = true;

  const { userProfile } = useApp()
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Show "Coming Soon" message if feature is disabled
  if (FEATURE_DISABLED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 text-center max-w-2xl"
        >
          <div className="text-8xl mb-6">🚧</div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            قريباً جداً!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            المعلم الشخصي الذكي قيد التطوير حالياً
          </p>
          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              نعمل على تطوير نظام ذكاء اصطناعي متقدم لمساعدتك في تعلم اللغة الإنجليزية.
              سيكون متاحاً قريباً مع مميزات رائعة!
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>محادثات تفاعلية</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <span>تصحيح فوري للأخطاء</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500" />
              <span>سيناريوهات واقعية</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }


  const startScenario = (scenario) => {
    setSelectedScenario(scenario)
    setMessages([
      {
        role: 'assistant',
        content: `مرحباً! أنا معلمك الشخصي. لنبدأ سيناريو "${scenario.title}". تحدث معي بالإنجليزية وسأساعدك في تصحيح أخطائك.`,
        corrections: []
      }
    ])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
      corrections: []
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const corrections = analyzeMessage(inputMessage)
      const response = generateResponse(inputMessage, selectedScenario, corrections)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        corrections: corrections
      }])
      setIsTyping(false)
    }, 1500)
  }

  const analyzeMessage = (message) => {
    const corrections = []

    if (message.toLowerCase().includes('i am go')) {
      corrections.push({
        error: 'I am go',
        correction: 'I am going / I go',
        rule: 'استخدم "going" مع "am" للمضارع المستمر، أو "go" للمضارع البسيط'
      })
    }

    if (message.toLowerCase().includes('he go')) {
      corrections.push({
        error: 'he go',
        correction: 'he goes',
        rule: 'مع الضمائر (he, she, it) نضيف "s" أو "es" للفعل في المضارع البسيط'
      })
    }

    if (!message.endsWith('.') && !message.endsWith('?') && !message.endsWith('!')) {
      corrections.push({
        error: 'علامة الترقيم مفقودة',
        correction: message + '.',
        rule: 'يجب أن تنتهي الجمل بعلامة ترقيم مناسبة'
      })
    }

    return corrections
  }

  const generateResponse = (userMsg, scenario, corrections) => {
    if (corrections.length > 0) {
      return `رائع! لاحظت بعض الأخطاء البسيطة. دعني أساعدك في تصحيحها. واصل التدريب!`
    }

    const responses = {
      coffee: 'Great! What size would you like - small, medium, or large?',
      'job-interview': 'That sounds interesting. Can you tell me more about your previous experience?',
      airport: 'Certainly! May I see your passport and ticket, please?',
      doctor: 'I understand. How long have you been experiencing these symptoms?',
      shopping: 'Excellent choice! Would you like to try it on?',
      business: 'That\'s a good point. What do you think about the timeline?',
      hotel: 'Perfect! Let me check our availability for those dates.',
      restaurant: 'Wonderful! Would you like to start with any appetizers?'
    }

    return responses[scenario?.id] || 'That\'s great! Please continue...'
  }

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                المعلم الشخصي الذكي
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              تحدث بثقة مع معلم ذكي يصحح أخطاءك ويساعدك على التحسن
            </p>
            {userProfile && (
              <div className="mt-4 inline-block px-6 py-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  مستواك الحالي: {userProfile.current_level}
                </span>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_SCENARIOS.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => startScenario(scenario)}
                className="glass rounded-2xl p-6 text-center hover:shadow-xl transition-all group"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {scenario.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {scenario.title}
                </h3>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {scenario.level}
                </div>
              </motion.button>
            ))}
          </div>
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
          className="glass rounded-3xl p-6 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{selectedScenario.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {selectedScenario.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedScenario.level}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedScenario(null)
              setMessages([])
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            إنهاء المحادثة
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-3xl p-6 mb-6 h-[500px] overflow-y-auto scrollbar-hide"
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                    {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <div className={`p-4 rounded-2xl ${msg.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                      }`}>
                      {msg.content}
                    </div>
                    {msg.corrections.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border-r-4 border-red-500 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-600 dark:text-red-400">تصحيحات</span>
                        </div>
                        {msg.corrections.map((correction, i) => (
                          <div key={i} className="mb-2 text-sm">
                            <div className="text-red-600 dark:text-red-400">
                              ❌ <span className="line-through">{correction.error}</span>
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              ✅ {correction.correction}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              💡 {correction.rule}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-4"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="اكتب رسالتك بالإنجليزية..."
              className="flex-1 px-6 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-transparent focus:border-purple-500 outline-none transition-colors"
              dir="ltr"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Send className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AITutor
