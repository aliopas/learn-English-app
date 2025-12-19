import { query } from '../config/database.js';

// @desc    Get lesson content by day number
// @route   GET /api/lessons/:dayNumber
// @access  Private
export const getLessonByDay = async (req, res) => {
    try {
        const dayNumber = parseInt(req.params.dayNumber);

        // 1. Get Lesson Details from DB (Single Row Fetch)
        const lessonResult = await query(
            'SELECT * FROM lessons WHERE day_number = $1',
            [dayNumber]
        );

        let lesson = {};

        if (lessonResult.rows.length > 0) {
            lesson = lessonResult.rows[0];
        }

        // 2. Get User Progress
        const progressResult = await query(
            'SELECT * FROM lesson_progress WHERE user_id = $1 AND day_number = $2',
            [req.user.id, dayNumber]
        );

        const progress = progressResult.rows[0] || {
            completed: false,
            score: 0,
            exercises_completed: false
        };

        // 3. Map DB Hybrid Structure to Frontend API Response
        res.status(200).json({
            success: true,
            data: {
                id: lesson.id,
                day: lesson.day_number || dayNumber,
                level: lesson.level || 'A1',
                levelName: lesson.level || 'A1',
                title: lesson.title || `Day ${dayNumber}`,
                description: lesson.description,
                videoUrl: lesson.video_url,
                imageUrl: lesson.image_url,
                estimatedTime: '30 دقيقة',
                documentContent: lesson.grammar_content, // Google Doc URL for grammar
                grammar: {
                    topic: lesson.grammar_topic,
                    description: lesson.grammar_content
                },
                readingExercise: {
                    text: lesson.reading_text
                },
                // Map JSONB columns directly
                vocabulary: lesson.vocabulary_list || [],
                exercises: (lesson.quiz_list || []).map(ex => ({
                    ...ex,
                    // Handle both 'answer' and 'correct_answer' fields for compatibility
                    correctAnswer: ex.correct_answer || ex.answer
                })),
                flashcards: lesson.flashcards_list || [],
                userProgress: progress
            }
        });

    } catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
            error: error.message
        });
    }
};

// @desc    Complete a lesson
// @route   POST /api/lessons/:dayNumber/complete
// @access  Private
export const completeLesson = async (req, res) => {
    try {
        const dayNumber = parseInt(req.params.dayNumber);
        const { score, timeSpent } = req.body;
        const userId = req.user.id;

        console.log(`📝 User ${userId} completing Lesson Day ${dayNumber}`);

        // 1. Check if lesson exists in DB
        const lessonResult = await query(
            'SELECT id FROM lessons WHERE day_number = $1',
            [dayNumber]
        );

        let lessonId = null;
        if (lessonResult.rows.length > 0) {
            lessonId = lessonResult.rows[0].id;
        } else {
            console.log(`⚠️ Lesson Day ${dayNumber} content missing in DB. Link will be null.`);
        }

        // 2. Insert or Update Progress
        const result = await query(
            `INSERT INTO lesson_progress 
       (user_id, day_number, lesson_id, completed, score, time_spent_minutes, completed_at, updated_at)
       VALUES ($1, $2, $3, true, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id, day_number) 
       DO UPDATE SET 
         lesson_id = COALESCE(EXCLUDED.lesson_id, lesson_progress.lesson_id),
         completed = true,
         score = GREATEST(lesson_progress.score, EXCLUDED.score),
         time_spent_minutes = lesson_progress.time_spent_minutes + EXCLUDED.time_spent_minutes,
         completed_at = NOW(),
         updated_at = NOW()
       RETURNING *`,
            [userId, dayNumber, lessonId, score || 0, timeSpent || 0]
        );

        // 3. Smart Update User Profile (Avoid > 30 check constraint error)
        // Rotate skill focus: 0=Listening, 1=Reading, 2=Speaking, 3=Grammar
        const skillIndex = (dayNumber - 1) % 4;

        // Base increment for all skills is 1, focus skill gets 5
        const listeningInc = skillIndex === 0 ? 5 : 1;
        const readingInc = skillIndex === 1 ? 5 : 1;
        const speakingInc = skillIndex === 2 ? 5 : 1;
        const grammarInc = skillIndex === 3 ? 5 : 1;

        await query(
            `UPDATE user_profiles
       SET 
         total_study_minutes = total_study_minutes + $1,
         current_day = CASE 
            WHEN current_day < 30 AND current_day <= $2 THEN $2 + 1 
            ELSE current_day 
         END,
         listening_score = LEAST(100, listening_score + $3),
         reading_score = LEAST(100, reading_score + $4),
         speaking_score = LEAST(100, speaking_score + $5),
         grammar_score = LEAST(100, grammar_score + $6),
         updated_at = NOW()
       WHERE user_id = $7`,
            [
                timeSpent || 0,
                dayNumber,
                listeningInc,
                readingInc,
                speakingInc,
                grammarInc,
                userId
            ]
        );

        console.log('✅ Progress saved successfully');

        res.status(200).json({
            success: true,
            message: 'Lesson completed successfully',
            progress: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Complete lesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error saving progress',
            error: error.message
        });
    }
};

// @desc    Save lesson progress (answers) without completing
// @route   POST /api/lessons/:dayNumber/save
// @access  Private
export const saveLessonProgress = async (req, res) => {
    try {
        const dayNumber = parseInt(req.params.dayNumber);
        const { answers } = req.body;
        const userId = req.user.id;

        // 1. Get lesson ID
        const lessonResult = await query(
            'SELECT id FROM lessons WHERE day_number = $1',
            [dayNumber]
        );

        let lessonId = null;
        if (lessonResult.rows.length > 0) {
            lessonId = lessonResult.rows[0].id;
        }

        // 2. Upsert progress with saved_answers
        await query(
            `INSERT INTO lesson_progress 
       (user_id, day_number, lesson_id, saved_answers, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, day_number) 
       DO UPDATE SET 
         lesson_id = COALESCE(EXCLUDED.lesson_id, lesson_progress.lesson_id),
         saved_answers = $4,
         updated_at = NOW()`,
            [userId, dayNumber, lessonId, JSON.stringify(answers)]
        );

        res.status(200).json({ success: true, message: 'Progress saved' });

    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get vocabulary for game based on user's current day
// @route   GET /api/lessons/vocabulary/game
// @access  Private
export const getGameVocabulary = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get User's Current Day from Profile
        const profileResult = await query(
            'SELECT current_day FROM user_profiles WHERE user_id = $1',
            [userId]
        );

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        const currentDay = profileResult.rows[0].current_day;

        // 2. Fetch Vocabulary from lessons table (vocabulary_list JSONB)
        const result = await query(
            'SELECT vocabulary_list FROM lessons WHERE day_number = $1',
            [currentDay]
        );

        const allWords = [];
        let idCounter = 1;

        if (result.rows.length > 0 && result.rows[0].vocabulary_list) {
            const vocabList = result.rows[0].vocabulary_list;
            // Parse if it's string (pg might auto-parse jsonb, but safe to check)
            const vocabs = Array.isArray(vocabList) ? vocabList : [];

            vocabs.forEach(v => {
                if (v.word && v.translation) {
                    allWords.push({
                        id: idCounter++,
                        english: v.word,
                        arabic: v.translation,
                        level: 'A1'
                    });
                }
            });
        } else {
            // Fallback: Fetch from any random lesson that has vocab
            console.log(`⚠️ No vocabulary found for Day ${currentDay}, fetching random fallback.`);
            const fallbackResult = await query('SELECT vocabulary_list FROM lessons WHERE vocabulary_list IS NOT NULL LIMIT 1');
            if (fallbackResult.rows.length > 0) {
                const fallback = fallbackResult.rows[0].vocabulary_list;
                if (Array.isArray(fallback)) {
                    fallback.slice(0, 5).forEach(v => {
                        allWords.push({
                            id: idCounter++,
                            english: v.word,
                            arabic: v.translation,
                            level: 'A1'
                        });
                    });
                }
            }
        }

        // Shuffle
        const shuffledWords = allWords.sort(() => Math.random() - 0.5);

        res.status(200).json({
            success: true,
            data: shuffledWords,
            day: currentDay
        });

    } catch (error) {
        console.error('Get game vocabulary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching vocabulary'
        });
    }
};

// @desc    Get all available lessons (days that have content in DB)
// @route   GET /api/lessons/available
// @access  Private
export const getAvailableLessons = async (req, res) => {
    try {
        console.log('📋 Getting available lessons from database...');

        // Get all day numbers that have content in the database
        const result = await query(
            'SELECT day_number, title, level FROM lessons ORDER BY day_number ASC'
        );

        console.log('📊 Query result:', result.rows);

        const availableDays = result.rows.map(row => row.day_number);

        console.log('✅ Available days:', availableDays);

        res.status(200).json({
            success: true,
            availableDays: availableDays,
            lessons: result.rows
        });

    } catch (error) {
        console.error('❌ Get available lessons error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching available lessons'
        });
    }
};

