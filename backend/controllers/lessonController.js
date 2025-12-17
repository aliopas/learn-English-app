import { query } from '../config/database.js';

// @desc    Get lesson content by day number
// @route   GET /api/lessons/:dayNumber
// @access  Private
export const getLessonByDay = async (req, res) => {
    try {
        const dayNumber = parseInt(req.params.dayNumber);

        // 1. Try to Get Lesson Details from DB
        const lessonResult = await query(
            'SELECT * FROM lessons WHERE day_number = $1',
            [dayNumber]
        );

        let lesson = {};
        let exercises = [];

        if (lessonResult.rows.length > 0) {
            lesson = lessonResult.rows[0];
            // 2. Get Exercises for this lesson if it exists in DB
            const exercisesResult = await query(
                'SELECT * FROM exercises WHERE lesson_id = $1',
                [lesson.id]
            );
            exercises = exercisesResult.rows;
        }

        // 3. Get Vocabulary for this day (by day_number)
        const vocabResult = await query(
            'SELECT * FROM vocabulary WHERE day_number = $1',
            [dayNumber]
        );
        const vocabularyData = vocabResult.rows.length > 0 ? vocabResult.rows[0] : null;

        // 3. Get User Progress for this lesson
        const progressResult = await query(
            'SELECT * FROM lesson_progress WHERE user_id = $1 AND day_number = $2',
            [req.user.id, dayNumber]
        );

        const progress = progressResult.rows[0] || {
            completed: false,
            score: 0,
            exercises_completed: false
        };

        // Return success even if lesson content is missing in DB (handled by frontend local data)
        res.status(200).json({
            success: true,
            data: {
                id: lesson.id,
                day: lesson.day_number,
                level: lesson.level,
                levelName: lesson.level, // Map level to levelName as fallback
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.video_url,
                imageUrl: lesson.image_url,
                documentContent: lesson.document_content, // New field for Google Docs link
                estimatedTime: '30 دقيقة', // Default value as it's not in DB
                grammar: {
                    topic: lesson.grammar_topic,
                    description: lesson.grammar_content
                },
                readingExercise: {
                    text: lesson.reading_text
                },
                vocabulary: [], // Keep empty for backward compatibility
                vocabularyData: vocabularyData, // Single row with 10 words for this day
                exercises: exercises.map(ex => ({
                    ...ex,
                    correctAnswer: ex.correct_answer // CamelCase for frontend
                })),
                userProgress: progress
            }
        });

    } catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message, // Return specific error to frontend
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

        // 1. Check if lesson exists in DB, otherwise use placeholder
        const lessonResult = await query(
            'SELECT id FROM lessons WHERE day_number = $1',
            [dayNumber]
        );

        let lessonId;
        if (lessonResult.rows.length === 0) {
            console.log(`⚠️ Lesson Day ${dayNumber} content missing in DB. Using placeholder ID.`);
            lessonId = `day-${dayNumber}-placeholder`;
        } else {
            lessonId = String(lessonResult.rows[0].id);
        }

        // 2. Insert or Update Progress
        const result = await query(
            `INSERT INTO lesson_progress 
       (user_id, day_number, lesson_id, completed, score, time_spent_minutes, completed_at, updated_at)
       VALUES ($1, $2, $3, true, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id, day_number) 
       DO UPDATE SET 
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

        // 1. Get lesson ID (or placeholder)
        const lessonResult = await query(
            'SELECT id FROM lessons WHERE day_number = $1',
            [dayNumber]
        );

        let lessonId;
        if (lessonResult.rows.length === 0) {
            lessonId = `day-${dayNumber}-placeholder`;
        } else {
            lessonId = String(lessonResult.rows[0].id);
        }

        // 2. Upsert progress with saved_answers
        await query(
            `INSERT INTO lesson_progress 
       (user_id, day_number, lesson_id, saved_answers, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id, day_number) 
       DO UPDATE SET 
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

        // 2. Fetch Vocabulary for THIS specific day
        const result = await query(
            'SELECT * FROM vocabulary WHERE day_number = $1',
            [currentDay]
        );

        const allWords = [];
        let idCounter = 1;

        if (result.rows.length > 0) {
            const row = result.rows[0];

            // Include main word
            if (row.word && row.translation) {
                allWords.push({
                    id: idCounter++,
                    english: row.word,
                    arabic: row.translation,
                    level: 'A1'
                });
            }

            // Include words 1-9
            for (let i = 1; i <= 9; i++) {
                const w = row[`word${i}`];
                const t = row[`translation${i}`];
                if (w && t) {
                    allWords.push({
                        id: idCounter++,
                        english: w,
                        arabic: t,
                        level: 'A1'
                    });
                }
            }
        } else {
            // Fallback if no vocab found for current day
            console.log(`⚠️ No vocabulary found for Day ${currentDay}, fetching random fallback.`);
            const fallbackResult = await query('SELECT * FROM vocabulary ORDER BY RANDOM() LIMIT 1');
            if (fallbackResult.rows.length > 0) {
                const row = fallbackResult.rows[0];
                if (row.word) allWords.push({ id: 1, english: row.word, arabic: row.translation, level: 'A1' });
                if (row.word1) allWords.push({ id: 2, english: row.word1, arabic: row.translation1, level: 'A1' });
                if (row.word2) allWords.push({ id: 3, english: row.word2, arabic: row.translation2, level: 'A1' });
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


