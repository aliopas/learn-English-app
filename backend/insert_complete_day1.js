import { query } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const insertCompleteDay1 = async () => {
    try {
        console.log('🔄 Inserting Complete Day 1 Data...');

        // البيانات من data.json
        const vocabularyList = [
            { "id": 1, "word": "Pronoun", "translation": "ضمير" },
            { "id": 2, "word": "Replace", "translation": "يستبدل / يحل محل" },
            { "id": 3, "word": "Subject", "translation": "فاعل" },
            { "id": 4, "word": "Object", "translation": "مفعول به" },
            { "id": 5, "word": "Possessive", "translation": "ملكية" },
            { "id": 6, "word": "Repetition", "translation": "تكرار" },
            { "id": 7, "word": "Avoid", "translation": "يتجنب" },
            { "id": 8, "word": "Sentence", "translation": "جملة" },
            { "id": 9, "word": "Reflexive", "translation": "انعكاسي" },
            { "id": 10, "word": "Emphasize", "translation": "يؤكد / يشدد" }
        ];

        const quizList = [
            {
                "id": 1,
                "question": "ما هو الدور الأساسي للضمير في الجملة؟",
                "options": ["وصف الفعل", "استبدال الاسم لتجنب التكرار", "الربط بين الجمل", "تحديد زمن الجملة"],
                "answer": "استبدال الاسم لتجنب التكرار"
            },
            {
                "id": 2,
                "question": "أي من الضمائر التالية يُستخدم كفاعل مفرد مذكر؟",
                "options": ["She", "It", "He", "They"],
                "answer": "He"
            },
            {
                "id": 3,
                "question": "اختر الضمير المناسب للجملة: _______ loves coffee. (بديلاً عن Sarah)",
                "options": ["He", "It", "She", "They"],
                "answer": "She"
            },
            {
                "id": 4,
                "question": "أين يقع ضمير الفاعل عادة في الجملة؟",
                "options": ["في نهاية الجملة", "بعد الفعل", "قبل الفعل وفي بداية الجملة", "بعد حرف الجر"],
                "answer": "قبل الفعل وفي بداية الجملة"
            },
            {
                "id": 5,
                "question": "في الجملة Jake is hurt because Bill hit him، كلمة him هي:",
                "options": ["ضمير فاعل", "ضمير مفعول", "صفة ملكية", "ضمير انعكاسي"],
                "answer": "ضمير مفعول"
            },
            {
                "id": 6,
                "question": "أي مجموعة من الضمائر التالية هي ضمائر مفعول؟",
                "options": ["I, You, He", "me, you, him", "my, your, his", "mine, yours, his"],
                "answer": "me, you, him"
            },
            {
                "id": 7,
                "question": "أكمل الجملة بصفة ملكية مناسبة: This is _______ house. (نحن نملكه)",
                "options": ["ours", "us", "we", "our"],
                "answer": "our"
            },
            {
                "id": 8,
                "question": "ما الفرق الرئيسي بين صفات الملكية وضمائر الملكية؟",
                "options": ["صفات الملكية لا يتبعها اسم", "كلاهما يتبعهما اسم", "صفات الملكية يتبعها اسم، بينما ضمائر الملكية لا يتبعها اسم", "لا يوجد فرق"],
                "answer": "صفات الملكية يتبعها اسم، بينما ضمائر الملكية لا يتبعها اسم"
            },
            {
                "id": 9,
                "question": "أي جملة تستخدم ضمير الملكية بشكل صحيح؟",
                "options": ["This book is my.", "This is mine book.", "This book is mine.", "This is mine."],
                "answer": "This book is mine."
            },
            {
                "id": 10,
                "question": "في الجملة He hurt himself، كلمة himself هي:",
                "options": ["ضمير توكيدي", "ضمير انعكاسي", "ضمير مفعول عادي", "صفة ملكية"],
                "answer": "ضمير انعكاسي"
            },
            {
                "id": 11,
                "question": "ماذا يحدث إذا حذفنا الضمير التوكيدي من الجملة؟",
                "options": ["تصبح الجملة غير صحيحة", "يتغير المعنى تماماً", "تفقد الجملة عنصر التوكيد فقط ويبقى المعنى صحيحاً", "تتحول الجملة إلى نفي"],
                "answer": "تفقد الجملة عنصر التوكيد فقط ويبقى المعنى صحيحاً"
            },
            {
                "id": 12,
                "question": "اختر الضمير الصحيح: The students did the homework by _______.",
                "options": ["themselves", "theirselves", "them", "theirs"],
                "answer": "themselves"
            },
            {
                "id": 13,
                "question": "ما هو ضمير المفعول للضمير We؟",
                "options": ["Our", "Ours", "Us", "Ourselves"],
                "answer": "Us"
            },
            {
                "id": 14,
                "question": "في الجملة Give the book to me، كلمة me تأتي بعد:",
                "options": ["فاعل", "حرف جر", "صفة", "ظرف"],
                "answer": "حرف جر"
            },
            {
                "id": 15,
                "question": "أي الكلمات التالية هي صفة ملكية؟",
                "options": ["Him", "He", "His", "Himself"],
                "answer": "His"
            },
            {
                "id": 16,
                "question": "الجملة I made these cookies myself تحتوي على:",
                "options": ["ضمير انعكاسي", "ضمير توكيدي (يمكن حذفه)", "ضمير ملكية", "ضمير مفعول به"],
                "answer": "ضمير توكيدي (يمكن حذفه)"
            },
            {
                "id": 17,
                "question": "ما هو الضمير المناسب لغير العاقل المفرد؟",
                "options": ["They", "It", "She", "You"],
                "answer": "It"
            },
            {
                "id": 18,
                "question": "في الجملة These shoes are not hers، كلمة hers تعني:",
                "options": ["Her shoes", "She shoes", "Her", "Herself"],
                "answer": "Her shoes"
            },
            {
                "id": 19,
                "question": "أي جملة صحيحة؟",
                "options": ["Me like apples.", "I like apples.", "My like apples.", "Mine like apples."],
                "answer": "I like apples"
            },
            {
                "id": 20,
                "question": "الضمير You يمكن أن يستخدم لـ:",
                "options": ["المفرد المخاطب فقط", "الجمع المخاطب فقط", "المفرد والجمع المخاطب", "الغائب المفرد"],
                "answer": "المفرد والجمع المخاطب"
            }
        ];

        const flashcardsList = [
            { "id": 1, "front": "Pronoun", "back": "الضمير (كلمة تحل محل الاسم)" },
            { "id": 2, "front": "Subject Pronoun", "back": "ضمير الفاعل (يقوم بالفعل)" },
            { "id": 3, "front": "Object Pronoun", "back": "ضمير المفعول (يقع عليه الفعل)" },
            { "id": 4, "front": "Possessive Adjective", "back": "صفة الملكية (يتبعها اسم)" },
            { "id": 5, "front": "Possessive Pronoun", "back": "ضمير الملكية (لا يتبعه اسم)" },
            { "id": 6, "front": "Reflexive Pronoun", "back": "ضمير انعكاسي (يعود على الفاعل)" },
            { "id": 7, "front": "Emphatic Pronoun", "back": "ضمير توكيدي (يؤكد الفاعل)" },
            { "id": 8, "front": "I", "back": "أنا (فاعل)" },
            { "id": 9, "front": "You (Subject)", "back": "أنت / أنتم (فاعل)" },
            { "id": 10, "front": "He", "back": "هو (فاعل - مفرد مذكر)" },
            { "id": 11, "front": "She", "back": "هي (فاعل - مفرد مؤنث)" },
            { "id": 12, "front": "It (Subject)", "back": "هو/هي لغير العاقل (فاعل)" },
            { "id": 13, "front": "We", "back": "نحن (فاعل)" },
            { "id": 14, "front": "They", "back": "هم / هن (فاعل)" },
            { "id": 15, "front": "Me", "back": "ني / أنا (مفعول به)" },
            { "id": 16, "front": "You (Object)", "back": "كَ / كُم (مفعول به)" },
            { "id": 17, "front": "Him", "back": "ـه / هو (مفعول به)" },
            { "id": 18, "front": "Her (Object)", "back": "ـها / هي (مفعول به)" },
            { "id": 19, "front": "It (Object)", "back": "ـه / ـها لغير العاقل (مفعول به)" },
            { "id": 20, "front": "Us", "back": "ـنا / نحن (مفعول به)" },
            { "id": 21, "front": "Them", "back": "ـهم / ـهن (مفعول به)" },
            { "id": 22, "front": "My", "back": "لي / ملكي (يتبعها اسم)" },
            { "id": 23, "front": "Your", "back": "لكَ / لكم (يتبعها اسم)" },
            { "id": 24, "front": "His (Adjective)", "back": "له (يتبعها اسم)" },
            { "id": 25, "front": "Her (Adjective)", "back": "لها (يتبعها اسم)" },
            { "id": 26, "front": "Its (Adjective)", "back": "له/لها لغير العاقل (يتبعها اسم)" },
            { "id": 27, "front": "Our", "back": "لنا (يتبعها اسم)" },
            { "id": 28, "front": "Their", "back": "لهم (يتبعها اسم)" },
            { "id": 29, "front": "Mine", "back": "ملكي (لا يتبعها اسم)" },
            { "id": 30, "front": "Yours", "back": "ملكك / ملككم (لا يتبعها اسم)" },
            { "id": 31, "front": "His (Pronoun)", "back": "ملكه (لا يتبعها اسم)" },
            { "id": 32, "front": "Hers", "back": "ملكها (لا يتبعها اسم)" },
            { "id": 33, "front": "Ours", "back": "ملكنا (لا يتبعها اسم)" },
            { "id": 34, "front": "Theirs", "back": "ملكهم (لا يتبعها اسم)" },
            { "id": 35, "front": "Myself", "back": "نفسي" },
            { "id": 36, "front": "Yourself", "back": "نفسكَ" },
            { "id": 37, "front": "Himself", "back": "نفسه" },
            { "id": 38, "front": "Herself", "back": "نفسها" },
            { "id": 39, "front": "Itself", "back": "نفسه/نفسها (لغير العاقل)" },
            { "id": 40, "front": "Ourselves", "back": "أنفسنا" },
            { "id": 41, "front": "Yourselves", "back": "أنفسكم" },
            { "id": 42, "front": "Themselves", "back": "أنفسهم" },
            { "id": 43, "front": "Avoid repetition", "back": "تجنب التكرار" },
            { "id": 44, "front": "Direct Object", "back": "مفعول به مباشر" },
            { "id": 45, "front": "Indirect Object", "back": "مفعول به غير مباشر" },
            { "id": 46, "front": "Singular", "back": "مفرد" },
            { "id": 47, "front": "Plural", "back": "جمع" },
            { "id": 48, "front": "Ownership", "back": "الملكية" },
            { "id": 49, "front": "Preposition", "back": "حرف الجر" },
            { "id": 50, "front": "Apologize", "back": "يعتذر" }
        ];

        const readingText = `Hello, I am Ahmed, and this is my story. I live with my family in Riyadh. We have a nice house. This house is ours, and we love it very much. I have a sister named Sara. She is very smart. I help her with her homework, and she thanks me. That blue bag on the table is hers. I also have a brother named Ali. He likes football. He plays it every day. Sometimes, he hurts himself when he plays, but he is strong. On Friday, we all go to the park. My father drives the car himself. He tells us funny stories. My mother makes delicious food for us. She says, ''This food is made by me, specifically for you.'' They are the best parents. I love them very much, and they love me. Life is beautiful with them.`;

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
            1, // day_number
            'A1', // level
            'أساسيات الضمائر في الإنجليزية', // title
            'الفاعل، المفعول، والملكية', // grammar_topic
            'تعلم كيف تتحدث بطلاقة وتجنب التكرار باستخدام الضمائر الصحيحة. سنشرح لك الفرق بين "I" و "Me" و "My" ومتى تستخدم كل واحدة منها.', // description
            'https://drive.google.com/file/d/1n1PEaKAUdb0neeJw8XXvoo03B-QrUdyB/view?usp=drive_link', // video_url
            'https://drive.google.com/file/d/12WPO_adx32CgimFGd53gkYz6LB6PEzl9/view?usp=drive_link', // image_url
            'https://docs.google.com/document/d/1aJUFv0KL0pSEXXBNa7EeIcspiBtp_S1WyTlP1l5inFI/edit?usp=sharing', // grammar_content (Google Doc)
            readingText, // reading_text
            JSON.stringify(vocabularyList), // vocabulary_list
            JSON.stringify(quizList), // quiz_list
            JSON.stringify(flashcardsList) // flashcards_list
        ];

        const result = await query(insertQuery, values);

        console.log('✅ Day 1 Data Inserted/Updated Successfully!');
        console.log('📌 Lesson ID:', result.rows[0].id);
        console.log('📌 Title:', result.rows[0].title);
        console.log('📊 Stats:');
        console.log(`   - Vocabulary: ${vocabularyList.length} words`);
        console.log(`   - Quiz: ${quizList.length} questions`);
        console.log(`   - Flashcards: ${flashcardsList.length} cards`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error inserting data:', error);
        process.exit(1);
    }
};

insertCompleteDay1();
