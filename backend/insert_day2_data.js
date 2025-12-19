import { query } from './config/database.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const insertDay2 = async () => {
    try {
        console.log('🔄 Reading data.json for Day 2...');
        const jsonPath = path.join(__dirname, '../data.json');

        if (!fs.existsSync(jsonPath)) {
            console.error('❌ data.json not found at:', jsonPath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf8');

        // Parse the SQL-like structure manually
        console.log('📝 Parsing Day 2 data...');

        // البيانات من data.json لليوم الثاني
        const vocabularyList = [
            { "id": 1, "word": "Student", "translation": "طالب" },
            { "id": 2, "word": "Teacher", "translation": "معلم / معلمة" },
            { "id": 3, "word": "Doctor", "translation": "طبيب" },
            { "id": 4, "word": "Friend", "translation": "صديق" },
            { "id": 5, "word": "Happy", "translation": "سعيد" },
            { "id": 6, "word": "Sad", "translation": "حزين" },
            { "id": 7, "word": "Tall", "translation": "طويل" },
            { "id": 8, "word": "Short", "translation": "قصير" },
            { "id": 9, "word": "Hungry", "translation": "جائع" },
            { "id": 10, "word": "Tired", "translation": "متعب" }
        ];

        const quizList = [
            { "id": 1, "question": "I ___ a student.", "options": ["is", "am", "are", "be"], "answer": "am", "explanation": "نستخدم am دائماً مع الضمير I." },
            { "id": 2, "question": "She ___ my sister.", "options": ["am", "are", "is", "be"], "answer": "is", "explanation": "نستخدم is مع المفرد الغائب (She)." },
            { "id": 3, "question": "They ___ happy.", "options": ["is", "am", "are", "was"], "answer": "are", "explanation": "نستخدم are مع الجمع (They)." },
            { "id": 4, "question": "It ___ a cat.", "options": ["is", "am", "are", "were"], "answer": "is", "explanation": "نستخدم is مع غير العاقل المفرد (It)." },
            { "id": 5, "question": "We ___ friends.", "options": ["am", "is", "be", "are"], "answer": "are", "explanation": "نستخدم are مع المتكلم الجمع (We)." },
            { "id": 6, "question": "You ___ a good teacher.", "options": ["is", "am", "are", "be"], "answer": "are", "explanation": "نستخدم are مع المخاطب (You)." },
            { "id": 7, "question": "He ___ tall.", "options": ["are", "am", "is", "be"], "answer": "is", "explanation": "نستخدم is مع المفرد الغائب المذكر (He)." },
            { "id": 8, "question": "The dog ___ brown.", "options": ["am", "are", "is", "be"], "answer": "is", "explanation": "الكلب (The dog) مفرد غير عاقل، لذا نستخدم is." },
            { "id": 9, "question": "Sarah and Ali ___ at home.", "options": ["is", "am", "are", "was"], "answer": "are", "explanation": "سارة وعلي مثنى (جمع في الإنجليزية)، لذا نستخدم are." },
            { "id": 10, "question": "My book ___ new.", "options": ["is", "am", "are", "be"], "answer": "is", "explanation": "كتابي (My book) مفرد، لذا نستخدم is." },
            { "id": 11, "question": "I ___ tired today.", "options": ["is", "are", "am", "be"], "answer": "am", "explanation": "الضمير I يأخذ دائماً am." },
            { "id": 12, "question": "The cars ___ fast.", "options": ["is", "am", "are", "was"], "answer": "are", "explanation": "السيارات (The cars) جمع، لذا نستخدم are." },
            { "id": 13, "question": "My father ___ a doctor.", "options": ["are", "am", "be", "is"], "answer": "is", "explanation": "أبي يعامل معاملة He، لذا نستخدم is." },
            { "id": 14, "question": "You and I ___ busy.", "options": ["am", "is", "are", "be"], "answer": "are", "explanation": "أنت وأنا (You and I) نصبح We، لذا نستخدم are." },
            { "id": 15, "question": "This apple ___ red.", "options": ["are", "am", "is", "were"], "answer": "is", "explanation": "التفاحة مفرد، لذا نستخدم is." },
            { "id": 16, "question": "The children ___ playing.", "options": ["is", "am", "are", "be"], "answer": "are", "explanation": "الأطفال (Children) جمع، لذا نستخدم are." },
            { "id": 17, "question": "London ___ a big city.", "options": ["are", "is", "am", "be"], "answer": "is", "explanation": "لندن مدينة واحدة (مفرد)، لذا نستخدم is." },
            { "id": 18, "question": "I ___ very hungry.", "options": ["is", "are", "am", "were"], "answer": "am", "explanation": "الضمير I يأخذ am." },
            { "id": 19, "question": "Your shoes ___ dirty.", "options": ["is", "am", "are", "be"], "answer": "are", "explanation": "الحذاء (Shoes) يعامل معاملة الجمع، لذا نستخدم are." },
            { "id": 20, "question": "The sun ___ hot.", "options": ["am", "is", "are", "be"], "answer": "is", "explanation": "الشمس مفرد، لذا نستخدم is." }
        ];

        const flashcardsList = [
            { "id": 1, "front": "I am", "back": "أنا أكون" },
            { "id": 2, "front": "You are (singular)", "back": "أنتَ تكون / أنتِ تكونين" },
            { "id": 3, "front": "He is", "back": "هو يكون" },
            { "id": 4, "front": "She is", "back": "هي تكون" },
            { "id": 5, "front": "It is", "back": "هو/هي تكون (لغير العاقل)" },
            { "id": 6, "front": "We are", "back": "نحن نكون" },
            { "id": 7, "front": "You are (plural)", "back": "أنتم تكونون" },
            { "id": 8, "front": "They are", "back": "هم يكونون" },
            { "id": 9, "front": "I am happy", "back": "أنا سعيد" },
            { "id": 10, "front": "He is sad", "back": "هو حزين" },
            { "id": 11, "front": "She is tall", "back": "هي طويلة" },
            { "id": 12, "front": "It is a cat", "back": "إنها قطة" },
            { "id": 13, "front": "We are friends", "back": "نحن أصدقاء" },
            { "id": 14, "front": "They are teachers", "back": "هم معلمين" },
            { "id": 15, "front": "You are late", "back": "أنت متأخر" },
            { "id": 16, "front": "I'm (Contraction)", "back": "أنا (اختصار)" },
            { "id": 17, "front": "He's (Contraction)", "back": "هو (اختصار)" },
            { "id": 18, "front": "She's (Contraction)", "back": "هي (اختصار)" },
            { "id": 19, "front": "It's (Contraction)", "back": "إنه/إنها (اختصار)" },
            { "id": 20, "front": "We're (Contraction)", "back": "نحن (اختصار)" },
            { "id": 21, "front": "You're (Contraction)", "back": "أنت/أنتم (اختصار)" },
            { "id": 22, "front": "They're (Contraction)", "back": "هم (اختصار)" },
            { "id": 23, "front": "The sky is blue", "back": "السماء زرقاء" },
            { "id": 24, "front": "The car is red", "back": "السيارة حمراء" },
            { "id": 25, "front": "My name is...", "back": "اسمي هو..." },
            { "id": 26, "front": "I am a student", "back": "أنا طالب" },
            { "id": 27, "front": "She is a nurse", "back": "هي ممرضة" },
            { "id": 28, "front": "He is a pilot", "back": "هو طيار" },
            { "id": 29, "front": "They are busy", "back": "هم مشغولون" },
            { "id": 30, "front": "We are hungry", "back": "نحن جائعون" },
            { "id": 31, "front": "It is cold", "back": "الجو بارد" },
            { "id": 32, "front": "It is hot", "back": "الجو حار" },
            { "id": 33, "front": "The book is new", "back": "الكتاب جديد" },
            { "id": 34, "front": "The pen is old", "back": "القلم قديم" },
            { "id": 35, "front": "My brother is smart", "back": "أخي ذكي" },
            { "id": 36, "front": "My sister is funny", "back": "أختي مضحكة" },
            { "id": 37, "front": "The house is big", "back": "المنزل كبير" },
            { "id": 38, "front": "The room is small", "back": "الغرفة صغيرة" },
            { "id": 39, "front": "I am ready", "back": "أنا جاهز" },
            { "id": 40, "front": "He is tired", "back": "هو متعب" },
            { "id": 41, "front": "She is beautiful", "back": "هي جميلة" },
            { "id": 42, "front": "The test is easy", "back": "الاختبار سهل" },
            { "id": 43, "front": "The work is hard", "back": "العمل شاق" },
            { "id": 44, "front": "We are home", "back": "نحن في المنزل" },
            { "id": 45, "front": "They are at school", "back": "هم في المدرسة" },
            { "id": 46, "front": "It is a dog", "back": "إنه كلب" },
            { "id": 47, "front": "You are right", "back": "أنت محق" },
            { "id": 48, "front": "I am wrong", "back": "أنا مخطئ" },
            { "id": 49, "front": "It is okay", "back": "الأمر بخير" },
            { "id": 50, "front": "Everyone is here", "back": "الجميع هنا" }
        ];

        const readingText = `Hello! My name is Sarah. I am a new student at this school. I am very excited today. My bag is blue and heavy. This is my friend, Ali. He is tall and smart. We are in the same class. Our teacher is Mrs. Green. She is very kind. The classroom is big and bright. Usually, the students are quiet, but today they are loud because it is the first day of school. We are ready to learn!`;

        const insertQuery = `
            INSERT INTO lessons (
                day_number, 
                level,
                title, 
                grammar_topic,
                description, 
                video_url, 
                image_url,
                grammar_content,
                reading_text,
                vocabulary_list,
                quiz_list,
                flashcards_list,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
            )
            ON CONFLICT (day_number) DO UPDATE SET
                level = EXCLUDED.level,
                title = EXCLUDED.title,
                grammar_topic = EXCLUDED.grammar_topic,
                description = EXCLUDED.description,
                video_url = EXCLUDED.video_url,
                image_url = EXCLUDED.image_url,
                grammar_content = EXCLUDED.grammar_content,
                reading_text = EXCLUDED.reading_text,
                vocabulary_list = EXCLUDED.vocabulary_list,
                quiz_list = EXCLUDED.quiz_list,
                flashcards_list = EXCLUDED.flashcards_list,
                updated_at = NOW()
            RETURNING id, title;
        `;

        const values = [
            2, // day_number
            'A1', // level
            'فعل الكينونة (To Be) - حالة الإثبات', // title
            'المفتاح الأول للتحدث: كيف تصف نفسك والآخرين؟', // grammar_topic
            'يُعد هذا الفعل "عمود الخيمة" في اللغة الإنجليزية وأكثر الأفعال استخداماً. الفرق الجوهري بينه وبين لغتنا العربية هو أننا في العربية نستطيع تكوين جملة اسمية بدون فعل ظاهر (مثال: "أنا سعيد")، أما في الإنجليزية فهذا مستحيل! يجب أن نستخدم "فعل الكينونة" ليعمل كجسر أو "صمغ" يربط بين الفاعل وصفته. يظهر هذا الفعل في ثلاثة أشكال (am, is, are) تختلف بحسب الشخص الذي نتحدث عنه. إتقانك لهذا الفعل هو الخطوة الأولى لتركيب جمل إنجليزية صحيحة 100%.', // description
            'https://drive.google.com/file/d/1JtC800ANYl39kA8deoT2OFVqKAIkvSbH/view?usp=drive_link', // video_url
            'https://drive.google.com/file/d/1ojWUOG1srC2_sGTUMVc-JoTHFSyKTH9E/view?usp=drive_link', // image_url
            'https://docs.google.com/document/d/18BrnsVpJiVZmiZH9_AUR5ZidlKkJxbRG9N7nY9HqD6c/edit?usp=sharing', // grammar_content (Google Doc)
            readingText, // reading_text
            JSON.stringify(vocabularyList), // vocabulary_list
            JSON.stringify(quizList), // quiz_list
            JSON.stringify(flashcardsList) // flashcards_list
        ];

        const result = await query(insertQuery, values);

        console.log('✅ Day 2 Data Inserted/Updated Successfully!');
        console.log('📌 Lesson ID:', result.rows[0].id);
        console.log('📌 Title:', result.rows[0].title);
        console.log('📊 Stats:');
        console.log(`   - Vocabulary: ${vocabularyList.length} words`);
        console.log(`   - Quiz: ${quizList.length} questions`);
        console.log(`   - Flashcards: ${flashcardsList.length} cards`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error inserting Day 2 data:', error);
        process.exit(1);
    }
};

insertDay2();
