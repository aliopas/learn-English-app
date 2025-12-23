import { query } from '../config/database.js';

// @desc    Get bulk initial data (all available lessons metadata)
// @route   GET /api/lessons/bulk/initial-data
// @access  Private
export const getBulkInitialData = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get all available lessons (lightweight - only metadata)
        const lessonsResult = await query(`
            SELECT 
                day_number,
                level,
                title,
                description,
                video_url,
                image_url,
                grammar_topic,
                CASE 
                    WHEN vocabulary_list IS NOT NULL THEN true
                    ELSE false
                END as has_vocabulary,
                CASE 
                    WHEN quiz_list IS NOT NULL THEN true
                    ELSE false
                END as has_quiz,
                CASE 
                    WHEN flashcards_list IS NOT NULL THEN true
                    ELSE false
                END as has_flashcards
            FROM lessons
            ORDER BY day_number ASC
        `);

        // 2. Get user's current progress for all lessons
        const progressResult = await query(`
            SELECT day_number, completed, score
            FROM lesson_progress
            WHERE user_id = $1
        `, [userId]);

        // Map progress to day_number for quick lookup
        const progressMap = {};
        progressResult.rows.forEach(p => {
            progressMap[p.day_number] = {
                completed: p.completed,
                score: p.score
            };
        });

        // 3. Combine lessons with progress
        const lessonsWithProgress = lessonsResult.rows.map(lesson => ({
            day: lesson.day_number,
            level: lesson.level || 'A1',
            title: lesson.title || `Day ${lesson.day_number}`,
            description: lesson.description,
            videoUrl: lesson.video_url,
            imageUrl: lesson.image_url,
            grammarTopic: lesson.grammar_topic,
            hasVocabulary: lesson.has_vocabulary,
            hasQuiz: lesson.has_quiz,
            hasFlashcards: lesson.has_flashcards,
            progress: progressMap[lesson.day_number] || {
                completed: false,
                score: 0
            }
        }));

        // 4. Get available days list
        const availableDays = lessonsResult.rows.map(l => l.day_number);

        res.status(200).json({
            success: true,
            data: {
                lessons: lessonsWithProgress,
                availableDays: availableDays,
                totalLessons: lessonsResult.rows.length
            }
        });

    } catch (error) {
        console.error('Get bulk initial data error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching initial data'
        });
    }
};
