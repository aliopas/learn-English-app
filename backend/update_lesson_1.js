import { query } from './config/database.js';
import dotenv from 'dotenv';
dotenv.config();

const updateLesson = async () => {
    const grammarContent = `## 1. ضمائر الفاعل (Subject Pronouns)
هي كلمات تحل محل الاسم الذي يقوم بالفعل. تأتي عادة في بداية الجملة.

* **المفرد:** I, You, He, She, It
* **الجمع:** We, You, They

**أمثلة:**
* **Jim** is angry → **He** wants Sally to apologize.
* **This table** is old → **It** needs to be repainted.

---

## 2. ضمائر المفعول (Object Pronouns)
تحل محل الاسم الذي يستقبل الفعل. تأتي عادة بعد الفعل أو بعد حروف الجر.

* **المفرد:** me, you, him, her, it
* **الجمع:** us, you, them

**أمثلة:**
* Give the book to **me**.
* Jake is hurt because Bill hit **him**.

---

## 3. التعبير عن الملكية (Possession)

### أ) صفات الملكية (Possessive Adjectives)
تأتي **قبل الاسم** لتوضح ملكيته.
* **أمثلة:** My shoes, Your homework, Her bike, Our house.

### ب) ضمائر الملكية (Possessive Pronouns)
تأتي **بمفردها** (لا يتبعها اسم) لأن الاسم مفهوم من السياق.
* **أمثلة:** This bag is **mine**. That car is **ours**.

| صفات الملكية (يتبعها اسم) | ضمائر الملكية (لا يتبعها اسم) |
| :--- | :--- |
| This is **my** book. | This book is **mine**. |
| Is this **your** car? | Is this car **yours**? |

---

## 4. الضمائر الانعكاسية والتوكيدية (-self)
تستخدم عندما يكون الفاعل والمفعول هما نفس الشخص.

* **أمثلة:**
    * He hurt **himself**. (انعكاسي: لا يمكن حذفه)
    * I made these cookies **myself**. (توكيدي: يمكن حذفه)

---

## ملخص سريع
* **Subject:** I, He, She, We...
* **Object:** Me, Him, Her, Us...
* **Possessive:** My/Mine, His, Her/Hers...`;

    const readingText = `Sarah loves coffee. She drinks it every morning. 
Jim is angry, and he wants Sally to apologize.
This table is old. It needs to be repainted.
We aren't coming. They don't like pancakes.

Give the book to me. The teacher wants to talk to you.
Jake is hurt because Bill hit him. Don't be angry with us.

Did mother find my shoes? Mrs. Baker wants to see your homework.
Samantha will fix her bike tomorrow. This is our house.

This bag is mine. Yours is not blue.
These shoes are not hers. That car is ours.

He hurt himself on the stairs.
She found herself in a dangerous part of town.
We blame ourselves for the fire.
I made these cookies myself.`;

    try {
        console.log('🔄 Checking if lesson 1 exists...');
        const check = await query('SELECT id FROM lessons WHERE day_number = $1', [1]);

        if (check.rows.length === 0) {
            console.log('⚠️ Lesson 1 not found. Please create it first or check the day_number.');
            // Optional: Insert if not exists, but instructions said "Update... except URL because I added it", implying it exists.
            process.exit(0);
        }

        console.log('🔄 Updating Lesson 1...');
        const result = await query(
            `UPDATE lessons 
             SET title = $1,
                 level = $2,
                 description = $3,
                 grammar_topic = $4,
                 grammar_content = $5,
                 reading_text = $6,
                 updated_at = now()
             WHERE day_number = $7
             RETURNING id, title`,
            [
                'الضمائر في اللغة الإنجليزية: دليل المبتدئين الشامل',
                'Beginner',
                'تعلم كيفية استخدام الضمائر (Pronouns) لجعل جملك أكثر سلاسة ووضوحاً. سنغطي ضمائر الفاعل، المفعول، الملكية، والضمائر الانعكاسية.',
                'English Pronouns (Subject, Object, Possessive, Reflexive)',
                grammarContent,
                readingText,
                1
            ]
        );

        console.log('✅ Lesson updated successfully:', result.rows[0]);
    } catch (error) {
        console.error('❌ Error updating lesson:', error);
    } finally {
        process.exit();
    }
};

updateLesson();
