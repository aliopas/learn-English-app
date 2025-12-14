import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.VITE_DB_HOST,
    port: parseInt(process.env.VITE_DB_PORT || '5432'),
    database: process.env.VITE_DB_NAME,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
    ssl: process.env.VITE_DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
};

// --- REAL CONTENT DATA ---

const LEVELS = {
    A1: { name: 'A1 - المبتدئ', days: [1, 2, 3, 4, 5, 6, 7] },
    A2: { name: 'A2 - الأساسي', days: [8, 9, 10, 11, 12, 13, 14] },
    B1: { name: 'B1 - المتوسط', days: [15, 16, 17, 18, 19, 20, 21, 22] },
    B2: { name: 'B2 - المتقدم', days: [23, 24, 25, 26, 27, 28, 29, 30] }
};

const LESSON_TITLES = {
    1: 'التحيات والضمائر (Greetings & Pronouns)',
    2: 'فعل الكون والوظائف (Verb to Be & Jobs)',
    3: 'العائلة والأرقام (Family & Numbers)',
    4: 'المضارع البسيط (Present Simple)',
    5: 'الطعام والشراب (Food & Drinks)',
    6: 'الوقت والروتين (Time & Routine)',
    7: 'مراجعة المستوى الأول (A1 Review)'
};

// Real exercises for Day 1 (A1)
const EXERCISES_DB = {
    A1: [
        {
            type: 'multiple_choice',
            question: 'Choose the correct pronoun: "_______ am a student."',
            options: ['He', 'She', 'I', 'They'],
            correct_answer: 'I',
            points: 10
        },
        {
            type: 'multiple_choice',
            question: 'Choose the correct answer: "How _______ you?"',
            options: ['is', 'are', 'am', 'be'],
            correct_answer: 'are',
            points: 10
        },
        {
            type: 'translation',
            question: 'ترجم: "Good morning"',
            options: [],
            correct_answer: 'صباح الخير',
            points: 10
        },
        {
            type: 'fill_gap',
            question: 'Complete: "Nice to _______ you."',
            options: [],
            correct_answer: 'meet',
            points: 10
        },
        {
            type: 'multiple_choice',
            question: 'Which is correct?',
            options: ['She is happy', 'She are happy', 'She am happy', 'She be happy'],
            correct_answer: 'She is happy',
            points: 10
        }
    ],
    A2: [
        {
            type: 'multiple_choice',
            question: 'Past Simple: "Yesterday, I _______ to the park."',
            options: ['go', 'goes', 'went', 'gone'],
            correct_answer: 'went',
            points: 10
        },
        {
            type: 'fill_gap',
            question: 'Compare: "This car is _______ than that one."',
            options: [],
            correct_answer: 'faster',
            points: 10
        }
    ],
    // Fallback for others
    GENERIC: [
        {
            type: 'multiple_choice',
            question: 'Select the correct grammar structure:',
            options: ['Subject + Verb + Object', 'Verb + Subject + Object', 'Object + Verb + Subject', 'Subject + Object + Verb'],
            correct_answer: 'Subject + Verb + Object',
            points: 10
        }
    ]
};

async function seedContent() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('🧹 Clearing existing content...');
        await client.query('DELETE FROM exercises');
        await client.query('DELETE FROM lessons');

        console.log('🌱 Seeding REAL content...');

        for (const [levelKey, levelData] of Object.entries(LEVELS)) {
            for (const dayNum of levelData.days) {
                // Use specific title or generic
                const title = LESSON_TITLES[dayNum] || `Lesson Day ${dayNum} (${levelKey})`;

                // Insert Lesson
                const lessonResult = await client.query(
                    `INSERT INTO lessons (day_number, title, content) 
           VALUES ($1, $2, $3) RETURNING id`,
                    [
                        dayNum,
                        title,
                        JSON.stringify({
                            sections: [
                                { title: 'Video', type: 'video', url: 'default-video.mp4' },
                                { title: 'Vocabulary', type: 'vocab', count: 10 },
                                { title: 'Grammar', type: 'grammar', topic: 'Lesson Topic' }
                            ]
                        })
                    ]
                );

                const lessonId = lessonResult.rows[0].id;

                // Get exercises (Specific if Day 1, else generic based on level)
                let exercises;
                if (dayNum === 1) exercises = EXERCISES_DB.A1;
                else if (levelData.name.includes('A2')) exercises = EXERCISES_DB.A2;
                else exercises = EXERCISES_DB.GENERIC;

                // Insert Exercises
                for (const ex of exercises) {
                    await client.query(
                        `INSERT INTO exercises (lesson_id, type, question, options, correct_answer, points)
             VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            lessonId,
                            ex.type,
                            ex.question,
                            JSON.stringify(ex.options),
                            ex.correct_answer,
                            ex.points
                        ]
                    );
                }

                process.stdout.write(`.`);
            }
        }

        console.log('\n✅ Real content seeding complete!');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
    } finally {
        await client.end();
    }
}

seedContent();
