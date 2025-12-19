import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { lessonAPI } from '../lib/api'
import { Play, BookOpen, CheckCircle, ArrowRight, Clock, Target, Award, XCircle, AlertCircle, BookOpenText, Image as ImageIcon, Volume2, Square } from 'lucide-react'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

const LessonView = () => {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const { learningPath, refreshProfile, user } = useApp()
  const [activeTab, setActiveTab] = useState('video')
  const [apiLessonData, setApiLessonData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isReading, setIsReading] = useState(false) // State for reading text status

  const speakWord = (text) => {
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakText = (text) => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    utterance.onend = () => {
      setIsReading(false);
    };

    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when changing tabs or unmounting
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  }, [activeTab]);

  // Quiz State
  const [userAnswers, setUserAnswers] = useState({}) // { exerciseId: selectedOption }
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(null) // 'success' or 'error'

  const [completedSections, setCompletedSections] = useState({
    video: false,
    vocabulary: false,
    grammar: false,
    reading: false,
    summary: false,
    exercises: false
  })

  // Helper to format video URL for embedding
  const getVideoEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube Short URL (youtu.be/ID)
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // YouTube Standard URL (youtube.com/watch?v=ID)
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }

    // Google Drive URL
    if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview');
    }

    return url;
  };

  const tabs = [
    { id: 'video', label: 'الفيديو', icon: Play },
    { id: 'vocabulary', label: 'المفردات', icon: BookOpen },
    { id: 'grammar', label: 'القواعد', icon: Target },
    { id: 'reading', label: 'القراءة', icon: BookOpenText },
    { id: 'summary', label: 'الملخص', icon: ImageIcon },
    { id: 'exercises', label: 'الاختبار', icon: CheckCircle }
  ]

  const getOptions = (ex) => {
    if (!ex.options) return null;
    return typeof ex.options === 'string' ? JSON.parse(ex.options) : ex.options;
  };

  // Helper to detect if exercise is multiple choice (check options first, then type)
  const isMultipleChoice = (ex) => {
    const options = getOptions(ex);
    // If options exist and have values, it's multiple choice
    if (options && Array.isArray(options) && options.length > 0) {
      return true;
    }
    // Fallback to type check
    return ex.type === 'multiple-choice';
  };

  const checkIsCorrect = (ex, userAnswer) => {
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') return false;

    const correctAnswer = ex.correctAnswer !== undefined ? ex.correctAnswer : ex.correct_answer;

    // Multiple Choice: compare the selected option text with correct answer
    if (isMultipleChoice(ex)) {
      const options = getOptions(ex);
      if (!options || !Array.isArray(options)) return false;

      // Normalize both for comparison
      const normalizedUser = String(userAnswer).trim().toLowerCase();
      const normalizedCorrect = String(correctAnswer).trim().toLowerCase();

      // Direct string comparison - the answer is the text, not an index
      return normalizedUser === normalizedCorrect;
    }

    // Fill-blank & Translate: correctAnswer is a string - text comparison
    const normalizedUser = String(userAnswer).trim().toLowerCase();
    const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
    return normalizedUser === normalizedCorrect;
  };



  // Helper to get exercise type (detect from options if type is missing)
  const getExerciseType = (ex) => {
    if (ex.type) return ex.type;
    const options = getOptions(ex);
    if (options && Array.isArray(options) && options.length > 0) {
      return 'multiple-choice';
    }
    // Check question content to guess type
    const q = (ex.question || '').toLowerCase();
    if (q.includes('ترجم') || q.includes('translate')) return 'translate';
    if (q.includes('complete') || q.includes('أكمل') || q.includes('___')) return 'fill-blank';
    return 'fill-blank'; // default
  };

  // Helper to get question type label in Arabic
  const getQuestionTypeLabel = (ex) => {
    const type = getExerciseType(ex);
    switch (type) {
      case 'multiple-choice': return 'اختر الإجابة الصحيحة';
      case 'fill-blank': return 'أكمل الفراغ';
      case 'translate': return 'ترجم';
      default: return 'سؤال';
    }
  };

  // Helper to get placeholder text based on question type
  const getPlaceholder = (ex) => {
    const type = getExerciseType(ex);
    switch (type) {
      case 'fill-blank': return 'أكتب الكلمة الناقصة...';
      case 'translate': return 'أكتب الترجمة هنا...';
      default: return 'أكتب إجابتك هنا...';
    }
  };

  // 1. Get local rich content
  const localLesson = learningPath.find(l => l.day === parseInt(dayId))

  // 2. Build lesson object with Priority & Source Tracking
  const isApiSource = apiLessonData && apiLessonData.title && !error;
  const lesson = isApiSource
    ? {
      ...apiLessonData,
      source: 'api',
      estimatedTime: apiLessonData.estimatedTime || localLesson?.estimatedTime || '30 دقيقة',
      skillFocus: localLesson?.skillFocus,
      vocabulary: apiLessonData.vocabulary || [],
      vocabularyData: apiLessonData.vocabularyData,
      documentContent: apiLessonData.documentContent,
    }
    : (localLesson ? { ...localLesson, source: 'local' } : null);

  // Prepare Vocab List (Handles both DB and Local structures)
  const displayVocab = lesson?.vocabularyData
    ? [
      { word: lesson.vocabularyData.word, translation: lesson.vocabularyData.translation, example: lesson.vocabularyData.example },
      { word: lesson.vocabularyData.word1, translation: lesson.vocabularyData.translation1, example: lesson.vocabularyData.example1 },
      { word: lesson.vocabularyData.word2, translation: lesson.vocabularyData.translation2, example: lesson.vocabularyData.example2 },
      { word: lesson.vocabularyData.word3, translation: lesson.vocabularyData.translation3, example: lesson.vocabularyData.example3 },
      { word: lesson.vocabularyData.word4, translation: lesson.vocabularyData.translation4, example: lesson.vocabularyData.example4 },
      { word: lesson.vocabularyData.word5, translation: lesson.vocabularyData.translation5, example: lesson.vocabularyData.example5 },
      { word: lesson.vocabularyData.word6, translation: lesson.vocabularyData.translation6, example: lesson.vocabularyData.example6 },
      { word: lesson.vocabularyData.word7, translation: lesson.vocabularyData.translation7, example: lesson.vocabularyData.example7 },
      { word: lesson.vocabularyData.word8, translation: lesson.vocabularyData.translation8, example: lesson.vocabularyData.example8 },
      { word: lesson.vocabularyData.word9, translation: lesson.vocabularyData.translation9, example: lesson.vocabularyData.example9 },
    ].filter(v => v.word)
    : (lesson?.vocabulary || []);

  // Helper for localStorage key
  const getStorageKey = () => user ? `lesson_progress_${user.id}_${dayId}` : null;

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const { data } = await lessonAPI.getLesson(dayId);
        setApiLessonData(data);

        let initialAnswers = {};

        // Check if lesson is already completed first
        if (data.userProgress?.completed) {
          // Lesson completed - show results state but DON'T load old answers
          setCompletedSections({
            video: true,
            vocabulary: true,
            grammar: true,
            reading: true,
            exercises: true
          });
          setQuizSubmitted(true);
          if (data.userProgress?.score !== undefined) {
            setScore(data.userProgress.score);
          }
          // Keep initialAnswers empty - user can retake fresh
        } else {
          // Lesson NOT completed - load saved progress to continue

          // 1. Load from DB
          if (data.userProgress?.saved_answers) {
            initialAnswers = { ...data.userProgress.saved_answers };
          }

          // 2. Load from LocalStorage (backup)
          const storageKey = getStorageKey();
          if (storageKey) {
            const savedLocal = localStorage.getItem(storageKey);
            if (savedLocal) {
              try {
                const parsed = JSON.parse(savedLocal);
                initialAnswers = { ...initialAnswers, ...parsed };
              } catch (e) {
                console.error("Failed to parse local storage", e);
              }
            }
          }
        }

        setUserAnswers(initialAnswers);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        setError(error.message || "Failed to load from database");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if has user (to generate storage key correctly)
    if (user) {
      fetchLessonData();
    }
  }, [dayId, user]); // Add user dependency

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل الدرس...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    // Check if this is a valid day number but just not in database yet
    const isValidDay = dayId >= 1 && dayId <= 30;

    if (isValidDay && !error) {
      // Lesson exists in roadmap but not in database yet
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-12 text-center max-w-2xl"
          >
            <div className="text-8xl mb-6">🔒</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              الدرس قيد الإعداد
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              محتوى اليوم {dayId} لم يتم إضافته بعد. نعمل على إعداد محتوى تعليمي مميز لك!
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500 mb-8">
              سيتم إضافة هذا الدرس قريباً. يرجى العودة لاحقاً أو التواصل مع فريق الدعم.
            </p>
            <button
              onClick={() => navigate('/roadmap')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg"
            >
              العودة للخارطة
            </button>
          </motion.div>
        </div>
      )
    }

    // Truly invalid lesson
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">الدرس غير موجود</h2>
          <button onClick={() => navigate('/roadmap')} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            العودة للخارطة
          </button>
        </div>
      </div>
    )
  }

  const handleCompleteSection = (section) => {
    if (section !== 'exercises') {
      setCompletedSections(prev => ({ ...prev, [section]: true }))
    }
  }

  const handleOptionSelect = async (exerciseIndex, option) => {
    if (quizSubmitted) return;

    const newAnswers = {
      ...userAnswers,
      [exerciseIndex]: option
    };

    // 1. Update UI immediately
    setUserAnswers(newAnswers);

    // 2. Save to LocalStorage (Instant Save)
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newAnswers));
    }

    // 3. Auto-save to backend
    try {
      await lessonAPI.saveProgress(dayId, newAnswers);
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  }

  const submitQuiz = () => {
    let correctCount = 0;
    lesson.exercises.forEach((ex, index) => {
      const userAnswer = userAnswers[index];
      if (!userAnswer) return;

      if (checkIsCorrect(ex, userAnswer)) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / lesson.exercises.length) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
    setCompletedSections(prev => ({ ...prev, exercises: true }));

    // Clear Local Storage on submit
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }

    if (calculatedScore >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setShowFeedback({ type: 'success', message: `رائع! نتيجتك ${calculatedScore}%` });
    } else {
      setShowFeedback({ type: 'error', message: `نتيجتك ${calculatedScore}%. حاول مرة أخرى لتحسين مستواك!` });
    }
  }

  const handleCompleteLesson = async () => {
    try {
      await lessonAPI.completeLesson(lesson.day, score, 30);
      await refreshProfile();
      navigate('/roadmap');
    } catch (error) {
      console.error("Error completing lesson:", error);
      setShowFeedback({ type: 'error', message: "عذراً، حدث خطأ أثناء حفظ تقدمك." });
    }
  }

  const allSectionsCompleted = Object.values(completedSections).every(v => v);





  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4 md:p-6 overflow-x-hidden">

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${showFeedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            {showFeedback.type === 'success' ? <CheckCircle /> : <AlertCircle />}
            <p className="font-bold">{showFeedback.message}</p>
            <button onClick={() => setShowFeedback(null)} className="mr-4 hover:opacity-80"><XCircle size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-right" dir="rtl" role="alert">
            <strong className="font-bold">خطأ في تحميل البيانات من قاعدة البيانات: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {lesson?.source && (
          <div className={`mb-4 px-3 py-1 text-xs font-mono inline-block rounded ${lesson.source === 'api' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            Source: {lesson.source === 'api' ? 'Database' : 'Local File'}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Award className="w-64 h-64 text-purple-500" />
          </div>

          <button
            onClick={() => navigate('/roadmap')}
            className="relative z-10 flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4 hover:gap-4 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للخارطة
          </button>

          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <div className="inline-block px-4 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-3">
                {lesson.levelName}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl text-sm md:text-base">
                {lesson.description}
              </p>
            </div>
            <div className="flex gap-4 text-center w-full md:w-auto">
              <div className="bg-white/50 dark:bg-black/20 p-3 md:p-4 rounded-xl backdrop-blur-sm flex-1 md:flex-none">
                <p className="text-xs text-gray-500">النقاط</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">85+</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 p-3 md:p-4 rounded-xl backdrop-blur-sm flex-1 md:flex-none">
                <p className="text-xs text-gray-500">الوقت</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{lesson.estimatedTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="glass rounded-3xl p-2 md:p-4 mb-6 sticky top-4 z-30 shadow-lg backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {completedSections[tab.id] && <CheckCircle className="w-4 h-4 text-green-400 bg-white rounded-full" />}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass rounded-3xl p-4 md:p-8 min-h-[400px]"
        >
          {activeTab === 'video' && (
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
                شاهد وتعلم
              </h2>
              <div className="aspect-video bg-gray-900 rounded-2xl mb-6 flex items-center justify-center relative group shadow-2xl overflow-hidden">
                {getVideoEmbedUrl(lesson.videoUrl) ? (
                  <iframe
                    src={getVideoEmbedUrl(lesson.videoUrl)}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={lesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:opacity-0 transition-opacity" />
                    <Play className="w-16 h-16 md:w-24 md:h-24 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                    {lesson.videoDuration && (
                      <p className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-2 py-1 rounded">{lesson.videoDuration}</p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleCompleteSection('video')}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01] ${completedSections.video
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {completedSections.video ? '✓ تم مشاهدة الفيديو' : 'أكملت المشاهدة، التالي'}
              </button>
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div>
              {/* Vocabulary Grid */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">الكلمات الجديدة</h2>
                <span className="text-xs md:text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{displayVocab.length} كلمات</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {displayVocab.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    لا توجد كلمات متاحة لهذا الدرس
                  </div>
                )}
                {displayVocab.map((vocab, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xl md:text-2xl font-bold text-purple-600" dir="ltr">{vocab.word}</div>
                      <button onClick={() => speakWord(vocab.word)} className="text-gray-400 hover:text-purple-500"><Play size={16} /></button>
                    </div>
                    <div className="text-lg md:text-xl text-gray-800 dark:text-white mb-2 font-medium">
                      {vocab.translation}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg" dir="ltr">
                      "{vocab.example}"
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => handleCompleteSection('vocabulary')}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01] ${completedSections.vocabulary
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {completedSections.vocabulary ? '✓ تم حفظ الكلمات' : 'حفظت الكلمات، التالي'}
              </button>
            </div>
          )}

          {activeTab === 'grammar' && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
                شرح القواعد{lesson.grammar?.topic ? `: ${lesson.grammar.topic}` : ''}
              </h2>
              <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl mb-8 border border-gray-100 dark:border-gray-700">
                {(() => {
                  const docUrl = lesson.documentContent;

                  const getGoogleDocEmbedUrl = (url) => {
                    if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;

                    try {
                      const urlObj = new URL(url);

                      // Check if it's a Google Docs URL
                      if (urlObj.hostname.includes('docs.google.com')) {
                        // Extract document ID from various Google Docs URL formats
                        let docId = null;

                        // Format: /document/d/{ID}/edit or /document/d/{ID}/view
                        const docMatch = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
                        if (docMatch) {
                          docId = docMatch[1];
                        }

                        if (docId) {
                          // Return embedded view-only URL
                          return `https://docs.google.com/document/d/${docId}/preview`;
                        }

                        // Fallback: try to convert existing URL
                        return url
                          .replace(/\/edit.*$/, '/preview')
                          .replace(/\/view.*$/, '/preview');
                      }

                      return url;
                    } catch (e) {
                      console.error('Error parsing document URL:', e);
                      return null;
                    }
                  };

                  const embedUrl = getGoogleDocEmbedUrl(docUrl);

                  if (embedUrl) {
                    return (
                      <div className="mt-4 w-full">
                        <iframe
                          src={embedUrl}
                          className="w-full h-[600px] rounded-xl border border-gray-200 dark:border-gray-700"
                          title="Grammar Document"
                          loading="lazy"
                          allow="autoplay"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        />
                      </div>
                    );
                  }

                  return (
                    <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300" dir="ltr">
                      {lesson.grammar?.description || 'لا يتوفر محتوى للقواعد'}
                    </p>
                  );
                })()}
              </div>
              <button
                onClick={() => handleCompleteSection('grammar')}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01] ${completedSections.grammar
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {completedSections.grammar ? '✓ تم دراسة القواعد' : 'فهمت القاعدة، التالي'}
              </button>
            </div>
          )}

          {activeTab === 'reading' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                    النص القرائي
                  </h2>
                  <button
                    onClick={() => handleSpeakText(lesson.readingExercise?.text || lesson.readingExercise || '')}
                    className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                    title={isReading ? "إيقاف القراءة" : "استمع للنص"}
                  >
                    {isReading ? <Square size={20} fill="currentColor" /> : <Volume2 size={24} />}
                  </button>
                </div>
                <span className="text-xs md:text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  ممارسة القراءة
                </span>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line dir-ltr font-serif">
                  {lesson.readingExercise?.text || "No reading text available."}
                </p>
              </div>

              {/* Reading Questions Section Removed as per request */}

              <button
                onClick={() => handleCompleteSection('reading')}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01] ${completedSections.reading
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {completedSections.reading ? '✓ تم القراءة' : 'أكملت القراءة، التالي'}
              </button>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
                ملخص الدرس
              </h2>
              <div className="w-full bg-white dark:bg-gray-800 p-2 md:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex justify-center">
                {lesson.imageUrl ? (
                  <img
                    src={lesson.imageUrl}
                    alt="Lesson Summary"
                    className="rounded-xl shadow-lg max-w-full h-auto object-contain max-h-[600px] hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p>لا يتوفر ملخص مصور لهذا الدرس بعد</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCompleteSection('summary')}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.01] ${completedSections.summary
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                {completedSections.summary ? '✓ تم الاطلاع على الملخص' : 'أطلعت على الملخص، التالي'}
              </button>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                  {quizSubmitted ? `نتيجتك: ${score}%` : 'اختبر نفسك'}
                </h2>
                {!quizSubmitted && (
                  <span className="text-xs md:text-sm text-gray-500">
                    {Object.keys(userAnswers).length} / {lesson.exercises.length} مجاب
                  </span>
                )}
              </div>

              <div className="space-y-8 mb-8">
                {lesson.exercises.map((exercise, index) => {
                  const options = getOptions(exercise);
                  const userAnswer = userAnswers[index];
                  const isCorrect = checkIsCorrect(exercise, userAnswer);
                  const correctAnswer = exercise.correctAnswer !== undefined ? exercise.correctAnswer : exercise.correct_answer;

                  return (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 md:p-6 rounded-2xl border-2 transition-all ${quizSubmitted
                        ? (isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10')
                        : 'border-transparent bg-white dark:bg-gray-800 hover:border-purple-200'
                        }`}
                    >
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                            {index + 1}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${isMultipleChoice(exercise) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            getExerciseType(exercise) === 'translate' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                              'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                            }`}>
                            {getQuestionTypeLabel(exercise)}
                          </span>
                          {quizSubmitted && (
                            isCorrect ? <CheckCircle className="text-green-500 flex-shrink-0 mr-auto" /> : <XCircle className="text-red-500 flex-shrink-0 mr-auto" />
                          )}
                        </div>
                        <p className="text-base md:text-lg font-medium text-gray-800 dark:text-white dir-ltr pr-10">
                          {exercise.question}
                        </p>
                      </div>

                      <div className="pl-0 md:pl-11">
                        {isMultipleChoice(exercise) ? (
                          // Multiple Choice Grid
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {options.map((option, i) => {
                              const isSelected = userAnswer === option;
                              // Compare option text with correct answer text (both normalized)
                              const isCorrectOption = String(option).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();

                              let btnClass = "p-3 rounded-xl text-left transition-all border-2 w-full ";

                              if (quizSubmitted) {
                                if (isCorrectOption) btnClass += "bg-green-500 text-white border-green-500";
                                else if (isSelected && !isCorrectOption) btnClass += "bg-red-100 text-red-700 border-red-500";
                                else btnClass += "bg-gray-100 dark:bg-gray-700 opacity-50 border-transparent";
                              } else {
                                if (isSelected) btnClass += "bg-purple-600 text-white border-purple-600 shadow-md transform scale-[1.02]";
                                else btnClass += "bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 border-transparent";
                              }

                              return (
                                <button
                                  key={i}
                                  onClick={() => handleOptionSelect(index, option)}
                                  disabled={quizSubmitted}
                                  className={btnClass}
                                  dir="ltr"
                                >
                                  {option}
                                </button>
                              )
                            })}
                          </div>
                        ) : (
                          // Text Input for Fill Blank / Translate
                          <div className="relative">
                            <input
                              type="text"
                              value={userAnswer || ''}
                              onChange={(e) => handleOptionSelect(index, e.target.value)}
                              disabled={quizSubmitted}
                              className={`w-full p-4 rounded-xl border-2 outline-none transition-all shadow-sm ${quizSubmitted
                                ? (isCorrect ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                                : 'border-gray-300 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50'
                                }`}
                              placeholder={getPlaceholder(exercise)}
                              dir="ltr"
                            />
                            {quizSubmitted && !isCorrect && (
                              <div className="mt-2 text-sm text-red-500 dir-ltr text-right">
                                الإجابة الصحيحة: <span className="font-bold">{correctAnswer}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Explanation Block - Shows after submission */}
                      {quizSubmitted && exercise.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <span className="text-xl">💡</span>
                            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed dir-rtl text-right">
                              {exercise.explanation}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => {
                    const answeredCount = Object.keys(userAnswers).length;
                    const totalCount = lesson.exercises.length;
                    if (answeredCount < totalCount) {
                      setShowFeedback({ type: 'error', message: `يرجى الإجابة على جميع الأسئلة (${answeredCount}/${totalCount})` });
                    } else {
                      submitQuiz();
                    }
                  }}
                  className={`w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all transform active:scale-95 mb-16 ${Object.keys(userAnswers).length < lesson.exercises.length ? 'opacity-70' : ''}`}
                >
                  عرض النتيجة
                </button>
              ) : (
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-16">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">تم تسجيل نتيجتك</p>
                  <div className="font-bold text-purple-600 text-xl mb-4">
                    {score >= 50 ? 'ممتاز! يمكنك المتابعة' : 'حاول مراجعة الدرس مرة أخرى'}
                  </div>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setUserAnswers({});
                      setScore(0);
                      setCompletedSections(prev => ({ ...prev, exercises: false }));
                    }}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    🔄 إعادة الاختبار
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Global Completion Action - Only appears if quiz passed */}
        {allSectionsCompleted && quizSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t dark:border-gray-800 z-50 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎉</div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">أحسنت! أكملت الدرس بنجاح</h3>
                  <p className="text-xs md:text-sm text-gray-500">تم حفظ تقدمك وإضافة النقاط</p>
                </div>
              </div>
              <button
                onClick={handleCompleteLesson}
                className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
              >
                انتقل للدرس التالي <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default LessonView
