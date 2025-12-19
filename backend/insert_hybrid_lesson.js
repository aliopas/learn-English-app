
import { query } from './config/database.js';

const insertHybridLesson = async () => {
    console.log('🚀 Inserting Hybrid Lesson Example...');

    try {
        const insertQuery = `
            INSERT INTO lessons (
                day_number, 
                title, 
                level, 
                description, 
                grammar_topic, 
                grammar_content, 
                reading_text, 
                video_url, 
                image_url,
                vocabulary_list,
                quiz_list,
                flashcards_list
            ) VALUES (
                1, 
                'أساسيات الضمائر في الإنجليزية', 
                'A1', 
                'تعلم كيف تتحدث بطلاقة وتجنب التكرار باستخدام الضمائر الصحيحة.', 
                'Subject, Object, and Possessive Pronouns', 
                'Detailed grammar explanation goes here...', 
                'Hello, I am Ahmed, and this is my story...', 
                'https://example.com/video.mp4', 
                'https://example.com/image.jpg',
                -- Vocabulary List (JSONB)
                '[
                    {"word": "Pronoun", "translation": "ضمير", "example": "He is a pronoun."},
                    {"word": "Subject", "translation": "فاعل", "example": "The subject performs the action."},
                    {"word": "Object", "translation": "مفعول به", "example": "The object receives the action."}
                ]'::jsonb,
                -- Quiz List (JSONB)
                '[
                    {
                        "type": "multiple_choice",
                        "question": "What is a pronoun?",
                        "options": ["A word that replaces a noun", "A verb", "An adjective"],
                        "correct_answer": "A word that replaces a noun"
                    },
                    {
                        "type": "multiple_choice",
                        "question": "Which is a subject pronoun?",
                        "options": ["Me", "He", "My"],
                        "correct_answer": "He"
                    },
                    {
                        "type": "fill-blank",
                        "question": "Complete: ___ goes to school.",
                        "correct_answer": "He"
                    }
                ]'::jsonb,
                -- Flashcards List (JSONB)
                '[
                    {"front": "Pronoun", "back": "ضمير"},
                    {"front": "Subject", "back": "فاعل"},
                    {"front": "Object", "back": "مفعول به"}
                ]'::jsonb
            )
            ON CONFLICT (day_number) DO UPDATE SET 
                title = EXCLUDED.title,
                vocabulary_list = EXCLUDED.vocabulary_list,
                quiz_list = EXCLUDED.quiz_list,
                flashcards_list = EXCLUDED.flashcards_list,
                updated_at = NOW()
            RETURNING id;
        `;

        const res = await query(insertQuery);
        console.log(`✅ Lesson inserted with ID: ${res.rows[0].id}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error inserting lesson:', error);
        process.exit(1);
    }
};

insertHybridLesson();
