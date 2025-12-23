// ============================================
// منهج تعليم الإنجليزية الكامل - 120 يوم
// كل مستوى = 30 يوم | مبني على معايير CEFR العالمية
// ============================================

// Helper function to generate array of days for a level
const generateDays = (start, count) => {
  return Array.from({ length: count }, (_, i) => start + i)
}

export const LEVELS = {
  A1: {
    name: 'A1 - المبتدئ',
    days: generateDays(1, 30),      // Days 1-30
    dayRange: { start: 1, end: 30 },
    color: '#10b981',
    description: 'أساسيات اللغة للمبتدئين'
  },
  A2: {
    name: 'A2 - الأساسي',
    days: generateDays(31, 30),     // Days 31-60
    dayRange: { start: 31, end: 60 },
    color: '#3b82f6',
    description: 'تطوير المهارات الأساسية'
  },
  B1: {
    name: 'B1 - المتوسط',
    days: generateDays(61, 30),     // Days 61-90
    dayRange: { start: 61, end: 90 },
    color: '#8b5cf6',
    description: 'التعبير بوضوح والمشاركة في نقاشات'
  },
  B2: {
    name: 'B2 - المتقدم',
    days: generateDays(91, 30),     // Days 91-120
    dayRange: { start: 91, end: 120 },
    color: '#ec4899',
    description: 'إتقان اللغة والمواضيع المعقدة'
  }
}

// Total course duration
export const COURSE_INFO = {
  totalDays: 120,
  totalLevels: 4,
  daysPerLevel: 30
}

// ============================================
// قاعدة بيانات الكلمات الموسعة - 700+ كلمة
// ============================================
const VOCABULARY_DATABASE = {
  A1: [
    // Basic Greetings & Introductions (10)
    { word: 'Hello', translation: 'مرحبا', example: 'Hello, how are you?', category: 'greetings' },
    { word: 'Goodbye', translation: 'وداعا', example: 'Goodbye, see you later!', category: 'greetings' },
    { word: 'Good morning', translation: 'صباح الخير', example: 'Good morning, everyone!', category: 'greetings' },
    { word: 'Good night', translation: 'تصبح على خير', example: 'Good night, sleep well!', category: 'greetings' },
    { word: 'Please', translation: 'من فضلك', example: 'Please sit down.', category: 'greetings' },
    { word: 'Thank you', translation: 'شكرا لك', example: 'Thank you for your help.', category: 'greetings' },
    { word: 'Sorry', translation: 'آسف', example: 'Sorry, I am late.', category: 'greetings' },
    { word: 'Excuse me', translation: 'لو سمحت', example: 'Excuse me, where is the bus stop?', category: 'greetings' },
    { word: 'Yes', translation: 'نعم', example: 'Yes, I agree.', category: 'greetings' },
    { word: 'No', translation: 'لا', example: 'No, I don\'t think so.', category: 'greetings' },

    // Numbers & Time (10)
    { word: 'One', translation: 'واحد', example: 'I have one brother.', category: 'numbers' },
    { word: 'Two', translation: 'اثنان', example: 'Two cups of coffee, please.', category: 'numbers' },
    { word: 'Three', translation: 'ثلاثة', example: 'I work three days a week.', category: 'numbers' },
    { word: 'Today', translation: 'اليوم', example: 'Today is Monday.', category: 'time' },
    { word: 'Tomorrow', translation: 'غدا', example: 'See you tomorrow!', category: 'time' },
    { word: 'Yesterday', translation: 'أمس', example: 'I saw him yesterday.', category: 'time' },
    { word: 'Now', translation: 'الآن', example: 'I am busy now.', category: 'time' },
    { word: 'Later', translation: 'لاحقا', example: 'I will call you later.', category: 'time' },
    { word: 'Morning', translation: 'صباح', example: 'I wake up in the morning.', category: 'time' },
    { word: 'Night', translation: 'ليل', example: 'I sleep at night.', category: 'time' },

    // Family & People (10)
    { word: 'Family', translation: 'عائلة', example: 'My family is very important.', category: 'family' },
    { word: 'Mother', translation: 'أم', example: 'My mother is a teacher.', category: 'family' },
    { word: 'Father', translation: 'أب', example: 'My father works in a bank.', category: 'family' },
    { word: 'Brother', translation: 'أخ', example: 'I have one brother.', category: 'family' },
    { word: 'Sister', translation: 'أخت', example: 'My sister is younger than me.', category: 'family' },
    { word: 'Friend', translation: 'صديق', example: 'He is my best friend.', category: 'people' },
    { word: 'Baby', translation: 'طفل رضيع', example: 'The baby is sleeping.', category: 'family' },
    { word: 'Child', translation: 'طفل', example: 'The child is playing.', category: 'people' },
    { word: 'Man', translation: 'رجل', example: 'That man is tall.', category: 'people' },
    { word: 'Woman', translation: 'امرأة', example: 'The woman is kind.', category: 'people' },

    // Common Verbs (10)
    { word: 'Be', translation: 'يكون', example: 'I am happy.', category: 'verbs' },
    { word: 'Have', translation: 'يملك', example: 'I have a car.', category: 'verbs' },
    { word: 'Do', translation: 'يفعل', example: 'What do you do?', category: 'verbs' },
    { word: 'Go', translation: 'يذهب', example: 'I go to school.', category: 'verbs' },
    { word: 'Come', translation: 'يأتي', example: 'Come here, please.', category: 'verbs' },
    { word: 'See', translation: 'يرى', example: 'I see a bird.', category: 'verbs' },
    { word: 'Know', translation: 'يعرف', example: 'I know English.', category: 'verbs' },
    { word: 'Like', translation: 'يحب', example: 'I like pizza.', category: 'verbs' },
    { word: 'Want', translation: 'يريد', example: 'I want water.', category: 'verbs' },
    { word: 'Need', translation: 'يحتاج', example: 'I need help.', category: 'verbs' },

    // Places (10)
    { word: 'Home', translation: 'منزل', example: 'I am at home.', category: 'places' },
    { word: 'School', translation: 'مدرسة', example: 'Children go to school.', category: 'places' },
    { word: 'Work', translation: 'عمل', example: 'I go to work every day.', category: 'places' },
    { word: 'Hospital', translation: 'مستشفى', example: 'The hospital is near.', category: 'places' },
    { word: 'Shop', translation: 'محل', example: 'The shop is open.', category: 'places' },
    { word: 'Restaurant', translation: 'مطعم', example: 'Let\'s go to a restaurant.', category: 'places' },
    { word: 'Park', translation: 'حديقة', example: 'Children play in the park.', category: 'places' },
    { word: 'Street', translation: 'شارع', example: 'This street is busy.', category: 'places' },
    { word: 'City', translation: 'مدينة', example: 'I live in a big city.', category: 'places' },
    { word: 'Country', translation: 'بلد', example: 'Egypt is a beautiful country.', category: 'places' },

    // Food & Drink (10)
    { word: 'Food', translation: 'طعام', example: 'This food is delicious.', category: 'food' },
    { word: 'Water', translation: 'ماء', example: 'Can I have some water?', category: 'drink' },
    { word: 'Bread', translation: 'خبز', example: 'I eat bread for breakfast.', category: 'food' },
    { word: 'Rice', translation: 'أرز', example: 'Rice is my favorite.', category: 'food' },
    { word: 'Meat', translation: 'لحم', example: 'I don\'t eat meat.', category: 'food' },
    { word: 'Fish', translation: 'سمك', example: 'Fish is healthy.', category: 'food' },
    { word: 'Egg', translation: 'بيضة', example: 'I want two eggs.', category: 'food' },
    { word: 'Milk', translation: 'حليب', example: 'Milk is good for you.', category: 'drink' },
    { word: 'Tea', translation: 'شاي', example: 'I drink tea every morning.', category: 'drink' },
    { word: 'Coffee', translation: 'قهوة', example: 'I love coffee.', category: 'drink' },

    // Basic Objects (10)
    { word: 'Book', translation: 'كتاب', example: 'I am reading a book.', category: 'objects' },
    { word: 'Phone', translation: 'هاتف', example: 'My phone is ringing.', category: 'objects' },
    { word: 'Car', translation: 'سيارة', example: 'I drive a car.', category: 'objects' },
    { word: 'Table', translation: 'طاولة', example: 'The table is clean.', category: 'objects' },
    { word: 'Chair', translation: 'كرسي', example: 'Sit on the chair.', category: 'objects' },
    { word: 'Door', translation: 'باب', example: 'Close the door, please.', category: 'objects' },
    { word: 'Window', translation: 'نافذة', example: 'Open the window.', category: 'objects' },
    { word: 'Pen', translation: 'قلم', example: 'I need a pen.', category: 'objects' },
    { word: 'Bag', translation: 'حقيبة', example: 'My bag is heavy.', category: 'objects' },
    { word: 'Money', translation: 'نقود', example: 'I need some money.', category: 'objects' }
  ],

  A2: [
    // Adjectives & Descriptions (15)
    { word: 'Big', translation: 'كبير', example: 'This is a big house.', category: 'adjectives' },
    { word: 'Small', translation: 'صغير', example: 'I have a small car.', category: 'adjectives' },
    { word: 'Good', translation: 'جيد', example: 'This is good coffee.', category: 'adjectives' },
    { word: 'Bad', translation: 'سيئ', example: 'That\'s bad news.', category: 'adjectives' },
    { word: 'New', translation: 'جديد', example: 'I bought a new phone.', category: 'adjectives' },
    { word: 'Old', translation: 'قديم', example: 'This is an old building.', category: 'adjectives' },
    { word: 'Happy', translation: 'سعيد', example: 'She looks very happy.', category: 'feelings' },
    { word: 'Sad', translation: 'حزين', example: 'Why are you sad?', category: 'feelings' },
    { word: 'Tired', translation: 'متعب', example: 'I am so tired today.', category: 'feelings' },
    { word: 'Angry', translation: 'غاضب', example: 'He seems angry.', category: 'feelings' },
    { word: 'Beautiful', translation: 'جميل', example: 'What a beautiful day!', category: 'adjectives' },
    { word: 'Easy', translation: 'سهل', example: 'This exercise is easy.', category: 'adjectives' },
    { word: 'Difficult', translation: 'صعب', example: 'The test was difficult.', category: 'adjectives' },
    { word: 'Expensive', translation: 'غالي', example: 'That car is too expensive.', category: 'adjectives' },
    { word: 'Cheap', translation: 'رخيص', example: 'This shirt is cheap.', category: 'adjectives' },

    // Travel & Transport (15)
    { word: 'Airport', translation: 'مطار', example: 'I will meet you at the airport.', category: 'travel' },
    { word: 'Train', translation: 'قطار', example: 'The train is late.', category: 'transport' },
    { word: 'Bus', translation: 'حافلة', example: 'I take the bus to work.', category: 'transport' },
    { word: 'Ticket', translation: 'تذكرة', example: 'I need to buy a ticket.', category: 'travel' },
    { word: 'Passport', translation: 'جواز سفر', example: 'Don\'t forget your passport.', category: 'travel' },
    { word: 'Hotel', translation: 'فندق', example: 'We stayed at a nice hotel.', category: 'travel' },
    { word: 'Beach', translation: 'شاطئ', example: 'Let\'s go to the beach.', category: 'places' },
    { word: 'Mountain', translation: 'جبل', example: 'The mountain is high.', category: 'nature' },
    { word: 'River', translation: 'نهر', example: 'The river is beautiful.', category: 'nature' },
    { word: 'Weather', translation: 'طقس', example: 'The weather is nice today.', category: 'weather' },
    { word: 'Hot', translation: 'حار', example: 'It\'s very hot today.', category: 'weather' },
    { word: 'Cold', translation: 'بارد', example: 'It\'s cold outside.', category: 'weather' },
    { word: 'Rain', translation: 'مطر', example: 'It will rain tomorrow.', category: 'weather' },
    { word: 'Sun', translation: 'شمس', example: 'The sun is shining.', category: 'weather' },
    { word: 'Snow', translation: 'ثلج', example: 'I love snow.', category: 'weather' },

    // Work & Education (15)
    { word: 'Job', translation: 'وظيفة', example: 'I need a new job.', category: 'work' },
    { word: 'Office', translation: 'مكتب', example: 'He works in a big office.', category: 'work' },
    { word: 'Manager', translation: 'مدير', example: 'The manager is busy.', category: 'work' },
    { word: 'Computer', translation: 'حاسوب', example: 'I use a computer for work.', category: 'technology' },
    { word: 'Email', translation: 'بريد إلكتروني', example: 'Send me an email.', category: 'technology' },
    { word: 'Meeting', translation: 'اجتماع', example: 'The meeting starts at 10.', category: 'work' },
    { word: 'Teacher', translation: 'معلم', example: 'She is a good teacher.', category: 'jobs' },
    { word: 'Doctor', translation: 'طبيب', example: 'I need to see a doctor.', category: 'jobs' },
    { word: 'Student', translation: 'طالب', example: 'I am a student.', category: 'education' },
    { word: 'Class', translation: 'فصل', example: 'The class is full.', category: 'education' },
    { word: 'Homework', translation: 'واجب منزلي', example: 'I have homework to do.', category: 'education' },
    { word: 'Exam', translation: 'امتحان', example: 'The exam is next week.', category: 'education' },
    { word: 'Answer', translation: 'إجابة', example: 'I know the answer.', category: 'education' },
    { word: 'Question', translation: 'سؤال', example: 'Can I ask you a question?', category: 'education' },
    { word: 'Problem', translation: 'مشكلة', example: 'We have a problem.', category: 'general' },

    // Shopping & Clothes (15)
    { word: 'Shop', translation: 'يتسوق', example: 'I shop every weekend.', category: 'shopping' },
    { word: 'Buy', translation: 'يشتري', example: 'I want to buy a shirt.', category: 'shopping' },
    { word: 'Sell', translation: 'يبيع', example: 'They sell clothes.', category: 'shopping' },
    { word: 'Price', translation: 'سعر', example: 'What\'s the price?', category: 'shopping' },
    { word: 'Shirt', translation: 'قميص', example: 'I like this shirt.', category: 'clothes' },
    { word: 'Shoes', translation: 'أحذية', example: 'These shoes are comfortable.', category: 'clothes' },
    { word: 'Dress', translation: 'فستان', example: 'She wore a beautiful dress.', category: 'clothes' },
    { word: 'Hat', translation: 'قبعة', example: 'I need a hat.', category: 'clothes' },
    { word: 'Coat', translation: 'معطف', example: 'It\'s cold, wear your coat.', category: 'clothes' },
    { word: 'Color', translation: 'لون', example: 'What color do you like?', category: 'general' },
    { word: 'Red', translation: 'أحمر', example: 'I like red.', category: 'colors' },
    { word: 'Blue', translation: 'أزرق', example: 'The sky is blue.', category: 'colors' },
    { word: 'Green', translation: 'أخضر', example: 'Green is my favorite color.', category: 'colors' },
    { word: 'Black', translation: 'أسود', example: 'I have a black car.', category: 'colors' },
    { word: 'White', translation: 'أبيض', example: 'Snow is white.', category: 'colors' }
  ],

  B1: [
    // Career & Professional (20)
    { word: 'Achievement', translation: 'إنجاز', example: 'This is a great achievement.', category: 'professional' },
    { word: 'Experience', translation: 'خبرة', example: 'I have 5 years of experience.', category: 'professional' },
    { word: 'Skill', translation: 'مهارة', example: 'Communication is an important skill.', category: 'professional' },
    { word: 'Career', translation: 'مسيرة مهنية', example: 'She has a successful career.', category: 'professional' },
    { word: 'Interview', translation: 'مقابلة', example: 'I have a job interview tomorrow.', category: 'professional' },
    { word: 'Salary', translation: 'راتب', example: 'The salary is good.', category: 'professional' },
    { word: 'Colleague', translation: 'زميل', example: 'My colleagues are friendly.', category: 'professional' },
    { word: 'Boss', translation: 'رئيس', example: 'My boss is understanding.', category: 'professional' },
    { word: 'Employee', translation: 'موظف', example: 'The company has 100 employees.', category: 'professional' },
    { word: 'Employer', translation: 'صاحب عمل', example: 'My employer is supportive.', category: 'professional' },
    { word: 'Deadline', translation: 'موعد نهائي', example: 'The deadline is next week.', category: 'professional' },
    { word: 'Project', translation: 'مشروع', example: 'We are working on a new project.', category: 'professional' },
    { word: 'Task', translation: 'مهمة', example: 'This task is challenging.', category: 'professional' },
    { word: 'Team', translation: 'فريق', example: 'Our team works well together.', category: 'professional' },
    { word: 'Report', translation: 'تقرير', example: 'I need to write a report.', category: 'professional' },
    { word: 'Presentation', translation: 'عرض تقديمي', example: 'The presentation was excellent.', category: 'professional' },
    { word: 'Contract', translation: 'عقد', example: 'Sign the contract here.', category: 'professional' },
    { word: 'Agreement', translation: 'اتفاق', example: 'We reached an agreement.', category: 'professional' },
    { word: 'Promotion', translation: 'ترقية', example: 'He got a promotion.', category: 'professional' },
    { word: 'Training', translation: 'تدريب', example: 'I attended training yesterday.', category: 'professional' },

    // Business & Finance (20)
    { word: 'Business', translation: 'عمل تجاري', example: 'He owns a business.', category: 'business' },
    { word: 'Company', translation: 'شركة', example: 'I work for a big company.', category: 'business' },
    { word: 'Market', translation: 'سوق', example: 'The market is growing.', category: 'business' },
    { word: 'Customer', translation: 'عميل', example: 'The customer is always right.', category: 'business' },
    { word: 'Product', translation: 'منتج', example: 'This product is popular.', category: 'business' },
    { word: 'Service', translation: 'خدمة', example: 'They provide excellent service.', category: 'business' },
    { word: 'Quality', translation: 'جودة', example: 'Quality is important.', category: 'business' },
    { word: 'Price', translation: 'سعر', example: 'The price is reasonable.', category: 'business' },
    { word: 'Cost', translation: 'تكلفة', example: 'What is the cost?', category: 'business' },
    { word: 'Profit', translation: 'ربح', example: 'The company made a profit.', category: 'finance' },
    { word: 'Loss', translation: 'خسارة', example: 'They suffered a loss.', category: 'finance' },
    { word: 'Budget', translation: 'ميزانية', example: 'We need to stay within budget.', category: 'finance' },
    { word: 'Investment', translation: 'استثمار', example: 'This is a good investment.', category: 'finance' },
    { word: 'Account', translation: 'حساب', example: 'I have a bank account.', category: 'finance' },
    { word: 'Credit', translation: 'ائتمان', example: 'Do you accept credit cards?', category: 'finance' },
    { word: 'Debt', translation: 'دين', example: 'He has no debt.', category: 'finance' },
    { word: 'Income', translation: 'دخل', example: 'My income is steady.', category: 'finance' },
    { word: 'Expense', translation: 'مصروف', example: 'Keep track of your expenses.', category: 'finance' },
    { word: 'Tax', translation: 'ضريبة', example: 'I paid my taxes.', category: 'finance' },
    { word: 'Sale', translation: 'تخفيضات', example: 'There\'s a sale today.', category: 'business' },

    // Social & Relationships (20)
    { word: 'Relationship', translation: 'علاقة', example: 'They have a good relationship.', category: 'social' },
    { word: 'Trust', translation: 'ثقة', example: 'Trust is important.', category: 'social' },
    { word: 'Respect', translation: 'احترام', example: 'Show respect to others.', category: 'social' },
    { word: 'Support', translation: 'دعم', example: 'Thank you for your support.', category: 'social' },
    { word: 'Help', translation: 'مساعدة', example: 'Can I help you?', category: 'social' },
    { word: 'Advice', translation: 'نصيحة', example: 'I need your advice.', category: 'social' },
    { word: 'Opinion', translation: 'رأي', example: 'What\'s your opinion?', category: 'social' },
    { word: 'Agree', translation: 'يوافق', example: 'I agree with you.', category: 'social' },
    { word: 'Disagree', translation: 'يختلف', example: 'I disagree respectfully.', category: 'social' },
    { word: 'Discuss', translation: 'يناقش', example: 'Let\'s discuss this.', category: 'social' },
    { word: 'Argue', translation: 'يجادل', example: 'Don\'t argue with me.', category: 'social' },
    { word: 'Apologize', translation: 'يعتذر', example: 'I need to apologize.', category: 'social' },
    { word: 'Forgive', translation: 'يسامح', example: 'Please forgive me.', category: 'social' },
    { word: 'Promise', translation: 'وعد', example: 'I promise to help.', category: 'social' },
    { word: 'Invite', translation: 'يدعو', example: 'I invite you to dinner.', category: 'social' },
    { word: 'Celebrate', translation: 'يحتفل', example: 'Let\'s celebrate!', category: 'social' },
    { word: 'Introduce', translation: 'يقدم', example: 'Let me introduce myself.', category: 'social' },
    { word: 'Recommend', translation: 'يوصي', example: 'I recommend this book.', category: 'social' },
    { word: 'Suggest', translation: 'يقترح', example: 'I suggest we leave now.', category: 'social' },
    { word: 'Prefer', translation: 'يفضل', example: 'I prefer tea to coffee.', category: 'social' },

    // Technology & Innovation (20)
    { word: 'Technology', translation: 'تكنولوجيا', example: 'Technology is changing fast.', category: 'technology' },
    { word: 'Internet', translation: 'إنترنت', example: 'The internet is slow today.', category: 'technology' },
    { word: 'Website', translation: 'موقع إلكتروني', example: 'Visit our website.', category: 'technology' },
    { word: 'Software', translation: 'برمجيات', example: 'Install the software.', category: 'technology' },
    { word: 'Hardware', translation: 'عتاد', example: 'The hardware is outdated.', category: 'technology' },
    { word: 'Network', translation: 'شبكة', example: 'Connect to the network.', category: 'technology' },
    { word: 'Data', translation: 'بيانات', example: 'Save your data.', category: 'technology' },
    { word: 'File', translation: 'ملف', example: 'Open the file.', category: 'technology' },
    { word: 'Download', translation: 'تنزيل', example: 'Download the app.', category: 'technology' },
    { word: 'Upload', translation: 'رفع', example: 'Upload the document.', category: 'technology' },
    { word: 'Update', translation: 'تحديث', example: 'Update your phone.', category: 'technology' },
    { word: 'Password', translation: 'كلمة مرور', example: 'Enter your password.', category: 'technology' },
    { word: 'Security', translation: 'أمان', example: 'Security is important.', category: 'technology' },
    { word: 'Privacy', translation: 'خصوصية', example: 'Protect your privacy.', category: 'technology' },
    { word: 'Digital', translation: 'رقمي', example: 'We live in a digital age.', category: 'technology' },
    { word: 'Online', translation: 'متصل', example: 'Shop online.', category: 'technology' },
    { word: 'Offline', translation: 'غير متصل', example: 'I\'m offline now.', category: 'technology' },
    { word: 'Cloud', translation: 'سحابة', example: 'Save it to the cloud.', category: 'technology' },
    { word: 'App', translation: 'تطبيق', example: 'Download the app.', category: 'technology' },
    { word: 'Device', translation: 'جهاز', example: 'This device is broken.', category: 'technology' },
    { word: 'Battery', translation: 'بطارية', example: 'The battery is low.', category: 'technology' },
    { word: 'Charge', translation: 'شحن', example: 'Charge your phone.', category: 'technology' }]
};

const VOCABULARY_DATABASE_B2 = {
  B2: [
    // Advanced Professional (25)
    { word: 'Strategy', translation: 'استراتيجية', example: 'We need a new strategy.', category: 'professional' },
    { word: 'Implement', translation: 'تنفيذ', example: 'We will implement the changes.', category: 'professional' },
    { word: 'Evaluate', translation: 'تقييم', example: 'We need to evaluate the results.', category: 'professional' },
    { word: 'Analyze', translation: 'تحليل', example: 'Let\'s analyze the data.', category: 'professional' },
    { word: 'Demonstrate', translation: 'إظهار', example: 'He demonstrated great skill.', category: 'professional' },
    { word: 'Establish', translation: 'إنشاء', example: 'We need to establish guidelines.', category: 'professional' },
    { word: 'Maintain', translation: 'الحفاظ على', example: 'We must maintain quality.', category: 'professional' },
    { word: 'Negotiate', translation: 'التفاوض', example: 'They are negotiating the terms.', category: 'professional' },
    { word: 'Collaborate', translation: 'التعاون', example: 'We need to collaborate effectively.', category: 'professional' },
    { word: 'Facilitate', translation: 'تسهيل', example: 'This will facilitate the process.', category: 'professional' },
    { word: 'Initiative', translation: 'مبادرة', example: 'It\'s a great initiative.', category: 'professional' },
    { word: 'Objective', translation: 'هدف', example: 'What is the main objective?', category: 'professional' },
    { word: 'Outcome', translation: 'نتيجة', example: 'The outcome was positive.', category: 'professional' },
    { word: 'Criteria', translation: 'معايير', example: 'Meet the criteria first.', category: 'professional' },
    { word: 'Framework', translation: 'إطار عمل', example: 'We need a framework.', category: 'professional' },
    { word: 'Procedure', translation: 'إجراء', example: 'Follow the procedure.', category: 'professional' },
    { word: 'Protocol', translation: 'بروتوكول', example: 'This is the protocol.', category: 'professional' },
    { word: 'Competence', translation: 'كفاءة', example: 'She has proven competence.', category: 'professional' },
    { word: 'Expertise', translation: 'خبرة متخصصة', example: 'He has expertise in this field.', category: 'professional' },
    { word: 'Qualification', translation: 'مؤهل', example: 'Do you have the qualifications?', category: 'professional' },
    { word: 'Accountability', translation: 'مساءلة', example: 'There must be accountability.', category: 'professional' },
    { word: 'Transparency', translation: 'شفافية', example: 'We value transparency.', category: 'professional' },
    { word: 'Integrity', translation: 'نزاهة', example: 'Integrity is essential.', category: 'professional' },
    { word: 'Compliance', translation: 'امتثال', example: 'Ensure compliance with rules.', category: 'professional' },
    { word: 'Delegation', translation: 'تفويض', example: 'Delegation is important.', category: 'professional' },

    // Academic & Intellectual (25)
    { word: 'Nevertheless', translation: 'ومع ذلك', example: 'Nevertheless, we must continue.', category: 'connectors' },
    { word: 'Furthermore', translation: 'علاوة على ذلك', example: 'Furthermore, I would like to add...', category: 'connectors' },
    { word: 'Consequently', translation: 'وبالتالي', example: 'Consequently, we decided to proceed.', category: 'connectors' },
    { word: 'Moreover', translation: 'بالإضافة إلى ذلك', example: 'Moreover, the cost is high.', category: 'connectors' },
    { word: 'Therefore', translation: 'لذلك', example: 'Therefore, we must act now.', category: 'connectors' },
    { word: 'However', translation: 'لكن', example: 'However, there are risks.', category: 'connectors' },
    { word: 'Although', translation: 'بالرغم من', example: 'Although it\'s difficult, we can do it.', category: 'connectors' },
    { word: 'Whereas', translation: 'بينما', example: 'Whereas some agree, others don\'t.', category: 'connectors' },
    { word: 'Hypothesis', translation: 'فرضية', example: 'We need to test this hypothesis.', category: 'academic' },
    { word: 'Theory', translation: 'نظرية', example: 'This theory is widely accepted.', category: 'academic' },
    { word: 'Evidence', translation: 'دليل', example: 'Where is the evidence?', category: 'academic' },
    { word: 'Research', translation: 'بحث', example: 'The research is ongoing.', category: 'academic' },
    { word: 'Methodology', translation: 'منهجية', example: 'Our methodology is sound.', category: 'academic' },
    { word: 'Analysis', translation: 'تحليل', example: 'The analysis shows clear results.', category: 'academic' },
    { word: 'Conclusion', translation: 'استنتاج', example: 'What is your conclusion?', category: 'academic' },
    { word: 'Argument', translation: 'حجة', example: 'His argument is convincing.', category: 'academic' },
    { word: 'Concept', translation: 'مفهوم', example: 'Explain the concept clearly.', category: 'academic' },
    { word: 'Context', translation: 'سياق', example: 'Consider the context.', category: 'academic' },
    { word: 'Perspective', translation: 'وجهة نظر', example: 'That\'s an interesting perspective.', category: 'academic' },
    { word: 'Implication', translation: 'دلالة', example: 'What are the implications?', category: 'academic' },
    { word: 'Assumption', translation: 'افتراض', example: 'That\'s a false assumption.', category: 'academic' },
    { word: 'Interpretation', translation: 'تفسير', example: 'Your interpretation is valid.', category: 'academic' },
    { word: 'Phenomenon', translation: 'ظاهرة', example: 'This is a complex phenomenon.', category: 'academic' },
    { word: 'Principle', translation: 'مبدأ', example: 'Follow this principle.', category: 'academic' },
    { word: 'Paradigm', translation: 'نموذج', example: 'We need a new paradigm.', category: 'academic' },

    // Complex Adjectives (25)
    { word: 'Sophisticated', translation: 'متطور', example: 'It\'s a sophisticated system.', category: 'adjectives' },
    { word: 'Substantial', translation: 'كبير', example: 'There was a substantial improvement.', category: 'adjectives' },
    { word: 'Comprehensive', translation: 'شامل', example: 'We need a comprehensive solution.', category: 'adjectives' },
    { word: 'Innovative', translation: 'مبتكر', example: 'It\'s an innovative approach.', category: 'adjectives' },
    { word: 'Sustainable', translation: 'مستدام', example: 'We need sustainable practices.', category: 'adjectives' },
    { word: 'Fundamental', translation: 'جوهري', example: 'This is a fundamental change.', category: 'adjectives' },
    { word: 'Significant', translation: 'هام', example: 'There was a significant increase.', category: 'adjectives' },
    { word: 'Considerable', translation: 'كبير', example: 'There is considerable interest.', category: 'adjectives' },
    { word: 'Evident', translation: 'واضح', example: 'It is evident that...', category: 'adjectives' },
    { word: 'Apparent', translation: 'ظاهر', example: 'It became apparent that...', category: 'adjectives' },
    { word: 'Crucial', translation: 'حاسم', example: 'This is a crucial moment.', category: 'adjectives' },
    { word: 'Essential', translation: 'أساسي', example: 'It is essential to understand.', category: 'adjectives' },
    { word: 'Vital', translation: 'حيوي', example: 'This is vital information.', category: 'adjectives' },
    { word: 'Critical', translation: 'حرج', example: 'We are at a critical stage.', category: 'adjectives' },
    { word: 'Potential', translation: 'محتمل', example: 'There are potential risks.', category: 'adjectives' },
    { word: 'Inevitable', translation: 'حتمي', example: 'Change is inevitable.', category: 'adjectives' },
    { word: 'Adequate', translation: 'كاف', example: 'Is this adequate?', category: 'adjectives' },
    { word: 'Sufficient', translation: 'كاف', example: 'We have sufficient resources.', category: 'adjectives' },
    { word: 'Efficient', translation: 'فعال', example: 'This is an efficient method.', category: 'adjectives' },
    { word: 'Effective', translation: 'مؤثر', example: 'It\'s an effective solution.', category: 'adjectives' },
    { word: 'Relevant', translation: 'ذو صلة', example: 'This is highly relevant.', category: 'adjectives' },
    { word: 'Appropriate', translation: 'مناسب', example: 'That\'s not appropriate.', category: 'adjectives' },
    { word: 'Reasonable', translation: 'معقول', example: 'That\'s a reasonable request.', category: 'adjectives' },
    { word: 'Rational', translation: 'منطقي', example: 'Be rational about this.', category: 'adjectives' },
    { word: 'Logical', translation: 'منطقي', example: 'That\'s the logical conclusion.', category: 'adjectives' },

    // Advanced Verbs (25)
    { word: 'Achieve', translation: 'يحقق', example: 'We achieved our goals.', category: 'verbs' },
    { word: 'Acquire', translation: 'يكتسب', example: 'I acquired new skills.', category: 'verbs' },
    { word: 'Adapt', translation: 'يتكيف', example: 'We must adapt to changes.', category: 'verbs' },
    { word: 'Adopt', translation: 'يتبنى', example: 'We will adopt this approach.', category: 'verbs' },
    { word: 'Anticipate', translation: 'يتوقع', example: 'We anticipate growth.', category: 'verbs' },
    { word: 'Assess', translation: 'يقيّم', example: 'We need to assess the situation.', category: 'verbs' },
    { word: 'Assume', translation: 'يفترض', example: 'Don\'t assume anything.', category: 'verbs' },
    { word: 'Attain', translation: 'يبلغ', example: 'We attained our target.', category: 'verbs' },
    { word: 'Comprehend', translation: 'يستوعب', example: 'Do you comprehend?', category: 'verbs' },
    { word: 'Conceive', translation: 'يتصور', example: 'I cannot conceive of this.', category: 'verbs' },
    { word: 'Conduct', translation: 'يجري', example: 'We will conduct research.', category: 'verbs' },
    { word: 'Constitute', translation: 'يشكل', example: 'This constitutes a problem.', category: 'verbs' },
    { word: 'Contribute', translation: 'يساهم', example: 'Everyone should contribute.', category: 'verbs' },
    { word: 'Convey', translation: 'ينقل', example: 'Convey my regards.', category: 'verbs' },
    { word: 'Deduce', translation: 'يستنتج', example: 'What can we deduce?', category: 'verbs' },
    { word: 'Derive', translation: 'يستمد', example: 'We derive benefits from this.', category: 'verbs' },
    { word: 'Diminish', translation: 'يقلل', example: 'The risk will diminish.', category: 'verbs' },
    { word: 'Eliminate', translation: 'يزيل', example: 'We must eliminate errors.', category: 'verbs' },
    { word: 'Emphasize', translation: 'يؤكد', example: 'I must emphasize this point.', category: 'verbs' },
    { word: 'Enhance', translation: 'يحسّن', example: 'This will enhance performance.', category: 'verbs' },
    { word: 'Ensure', translation: 'يضمن', example: 'Ensure everything is ready.', category: 'verbs' },
    { word: 'Illustrate', translation: 'يوضح', example: 'Let me illustrate this.', category: 'verbs' },
    { word: 'Imply', translation: 'يلمح', example: 'What are you implying?', category: 'verbs' },
    { word: 'Incorporate', translation: 'يدمج', example: 'We will incorporate feedback.', category: 'verbs' },
    { word: 'Justify', translation: 'يبرر', example: 'Can you justify this decision?', category: 'verbs' }
  ]
};

// ============================================
// توليد المفردات بناءً على اليوم
// ============================================
const generateVocabulary = (level, count, day) => {
  let allVocab = VOCABULARY_DATABASE[level] || [];
  if (level === 'B2' && typeof VOCABULARY_DATABASE_B2 !== 'undefined') {
    allVocab = VOCABULARY_DATABASE_B2.B2 || [];
  }
  const offset = ((day - 1) * count) % allVocab.length;

  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(allVocab[(offset + i) % allVocab.length]);
  }

  return result;
};

// ============================================
// قاعدة بيانات التمارين الموسعة
// ============================================
const EXERCISES_DATABASE = {
  A1: {
    day1: [
      { type: 'multiple-choice', question: 'Choose the correct greeting: "Good ___!"', options: ['morning', 'mourning', 'moring', 'morining'], correctAnswer: 0, difficulty: 'سهل', explanation: 'Good morning هي التحية الصحيحة للصباح' },
      { type: 'fill-blank', question: 'Complete: "My name ___ Ahmed."', correctAnswer: 'is', difficulty: 'سهل', explanation: 'نستخدم is مع الضمائر المفردة' },
      { type: 'translate', question: 'ترجم إلى الإنجليزية: "شكراً لك"', correctAnswer: 'Thank you', difficulty: 'سهل', explanation: 'Thank you هي الطريقة المهذبة للشكر' },
      { type: 'multiple-choice', question: 'Select the pronoun: "___ am a student."', options: ['He', 'She', 'I', 'They'], correctAnswer: 2, difficulty: 'سهل', explanation: 'I يستخدم للمتكلم مع am' },
      { type: 'fill-blank', question: 'Complete: "This ___ my book."', correctAnswer: 'is', difficulty: 'سهل', explanation: 'This (هذا) مفرد لذلك نستخدم is' }
    ],
    day2: [
      { type: 'multiple-choice', question: 'Choose the number: "I have ___ brothers."', options: ['one', 'two', 'tree', 'too'], correctAnswer: 1, difficulty: 'سهل', explanation: 'two هي الكتابة الصحيحة للرقم 2' },
      { type: 'fill-blank', question: 'What color is the sky? The sky is ___', correctAnswer: 'blue', difficulty: 'سهل', explanation: 'السماء زرقاء - blue' },
      { type: 'translate', question: 'ترجم: "أحب اللون الأحمر"', correctAnswer: 'I like red', difficulty: 'سهل', explanation: 'I like + color' },
      { type: 'multiple-choice', question: 'Count: Three + Two = ___', options: ['Four', 'Five', 'Six', 'Seven'], correctAnswer: 1, difficulty: 'سهل', explanation: '3 + 2 = 5 (Five)' },
      { type: 'fill-blank', question: 'Complete: "I can count from one to ___"', correctAnswer: 'ten', difficulty: 'سهل', explanation: 'العد من واحد إلى عشرة شائع للمبتدئين' }
    ],
    day3: [
      { type: 'multiple-choice', question: 'Who is your mother\'s mother?', options: ['Aunt', 'Grandmother', 'Sister', 'Cousin'], correctAnswer: 1, difficulty: 'سهل', explanation: 'أم أمك هي جدتك' },
      { type: 'fill-blank', question: 'My father\'s brother is my ___', correctAnswer: 'uncle', difficulty: 'سهل', explanation: 'أخو والدك هو عمك' },
      { type: 'translate', question: 'ترجم: "عائلتي كبيرة"', correctAnswer: 'My family is big', difficulty: 'سهل', explanation: 'My family + is + صفة' },
      { type: 'multiple-choice', question: 'Complete: "I have two ___"', options: ['brother', 'brothers', 'brotheres', 'brethren'], correctAnswer: 1, difficulty: 'سهل', explanation: 'جمع brother هو brothers' },
      { type: 'fill-blank', question: 'She is my best ___', correctAnswer: 'friend', difficulty: 'سهل', explanation: 'best friend تعني أعز صديق' }
    ],
    day4: [
      { type: 'multiple-choice', question: 'What do you drink in the morning?', options: ['Bread', 'Coffee', 'Shirt', 'Book'], correctAnswer: 1, difficulty: 'سهل', explanation: 'Coffee مشروب شائع في الصباح' },
      { type: 'fill-blank', question: 'I am hungry. I need ___', correctAnswer: 'food', difficulty: 'سهل', explanation: 'عندما تكون جائعاً تحتاج طعام' },
      { type: 'translate', question: 'ترجم: "أحب البيتزا"', correctAnswer: 'I like pizza', difficulty: 'سهل', explanation: 'I like + food' },
      { type: 'multiple-choice', question: 'What is white and comes from cows?', options: ['Water', 'Juice', 'Milk', 'Tea'], correctAnswer: 2, difficulty: 'سهل', explanation: 'الحليب أبيض ويأتي من الأبقار' },
      { type: 'fill-blank', question: 'Can I have a glass of ___?', correctAnswer: 'water', difficulty: 'سهل', explanation: 'glass of water = كوب ماء' }
    ],
    day5: [
      { type: 'multiple-choice', question: 'Where do children study?', options: ['Hospital', 'School', 'Restaurant', 'Airport'], correctAnswer: 1, difficulty: 'سهل', explanation: 'الأطفال يدرسون في المدرسة' },
      { type: 'fill-blank', question: 'I live in a big ___', correctAnswer: 'city', difficulty: 'سهل', explanation: 'نعيش في مدينة - city' },
      { type: 'translate', question: 'ترجم: "أين البنك؟"', correctAnswer: 'Where is the bank?', difficulty: 'سهل', explanation: 'Where is + مكان للسؤال عن الموقع' },
      { type: 'multiple-choice', question: 'Complete: "Turn ___ at the corner."', options: ['left', 'lift', 'leave', 'leaf'], correctAnswer: 0, difficulty: 'سهل', explanation: 'left تعني يسار' },
      { type: 'fill-blank', question: 'The bank is ___ to the post office.', correctAnswer: 'next', difficulty: 'سهل', explanation: 'next to تعني بجانب' }
    ],
    day6: [
      { type: 'multiple-choice', question: 'What time is it if the clock shows 3:00?', options: ['Three clock', 'Three o\'clock', 'Three hours', 'Three times'], correctAnswer: 1, difficulty: 'سهل', explanation: 'نقول three o\'clock للساعة الثالثة' },
      { type: 'fill-blank', question: 'I wake up at 7 ___ every day.', correctAnswer: 'AM', difficulty: 'سهل', explanation: 'AM للصباح، PM للمساء' },
      { type: 'translate', question: 'ترجم: "ما هو التاريخ اليوم؟"', correctAnswer: 'What is the date today?', difficulty: 'سهل', explanation: 'What is the date للسؤال عن التاريخ' },
      { type: 'multiple-choice', question: 'Which is a day of the week?', options: ['January', 'Monday', 'Summer', 'Clock'], correctAnswer: 1, difficulty: 'سهل', explanation: 'Monday يوم من أيام الأسبوع' },
      { type: 'fill-blank', question: 'There are 7 days in a ___', correctAnswer: 'week', difficulty: 'سهل', explanation: 'أسبوع = week ويحتوي على 7 أيام' }
    ],
    day7: [
      { type: 'multiple-choice', question: 'What do you do for fun?', options: ['Homework', 'Hobby', 'Work', 'Sleep'], correctAnswer: 1, difficulty: 'سهل', explanation: 'Hobby هي الهواية التي نمارسها للمتعة' },
      { type: 'fill-blank', question: 'I like to ___ football.', correctAnswer: 'play', difficulty: 'سهل', explanation: 'play + sport للعب رياضة' },
      { type: 'translate', question: 'ترجم: "هوايتي المفضلة القراءة"', correctAnswer: 'My favorite hobby is reading', difficulty: 'سهل', explanation: 'My favorite hobby is + gerund' },
      { type: 'multiple-choice', question: 'Complete: "I enjoy ___ music."', options: ['listen', 'listening', 'to listen', 'listened'], correctAnswer: 1, difficulty: 'سهل', explanation: 'enjoy + verb-ing' },
      { type: 'fill-blank', question: 'Do you like ___? Yes, I do.', correctAnswer: 'swimming', difficulty: 'سهل', explanation: 'like + verb-ing للتعبير عن الهوايات' }
    ]
  },

  A2: {
    day8: [
      { type: 'multiple-choice', question: 'I ___ breakfast at 7 AM every day.', options: ['eat', 'eats', 'eating', 'eaten'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'I + verb بدون s' },
      { type: 'fill-blank', question: 'She usually ___ (go) to work by bus.', correctAnswer: 'goes', difficulty: 'متوسط', explanation: 'She/He/It + verb + s' },
      { type: 'translate', question: 'ترجم: "أستيقظ في السادسة صباحاً"', correctAnswer: 'I wake up at six AM', difficulty: 'متوسط', explanation: 'wake up at + time' },
      { type: 'multiple-choice', question: 'How often do you exercise? ___ a week.', options: ['One time', 'Once', 'One', 'First'], correctAnswer: 1, difficulty: 'متوسط', explanation: 'once a week = مرة في الأسبوع' },
      { type: 'fill-blank', question: 'My daily ___ includes work and exercise.', correctAnswer: 'routine', difficulty: 'متوسط', explanation: 'daily routine = الروتين اليومي' }
    ],
    day9: [
      { type: 'multiple-choice', question: 'How much does this shirt ___?', options: ['cost', 'costs', 'costing', 'costed'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'How much + does + verb' },
      { type: 'fill-blank', question: 'I need to buy new ___ for winter.', correctAnswer: 'clothes', difficulty: 'متوسط', explanation: 'clothes = ملابس (دائماً جمع)' },
      { type: 'translate', question: 'ترجم: "هذا غالي جداً"', correctAnswer: 'This is too expensive', difficulty: 'متوسط', explanation: 'too + adjective = جداً' },
      { type: 'multiple-choice', question: 'Can I ___ this on?', options: ['put', 'wear', 'try', 'take'], correctAnswer: 2, difficulty: 'متوسط', explanation: 'try on = تجربة ملابس' },
      { type: 'fill-blank', question: 'What ___ do you prefer?', correctAnswer: 'size', difficulty: 'متوسط', explanation: 'size = مقاس/حجم' }
    ],
    day10: [
      { type: 'multiple-choice', question: 'It ___ tomorrow.', options: ['rains', 'will rain', 'rained', 'raining'], correctAnswer: 1, difficulty: 'متوسط', explanation: 'will + verb للمستقبل' },
      { type: 'fill-blank', question: 'The weather is ___ today.', correctAnswer: 'sunny', difficulty: 'متوسط', explanation: 'sunny = مشمس' },
      { type: 'translate', question: 'ترجم: "الجو بارد اليوم"', correctAnswer: 'It is cold today', difficulty: 'متوسط', explanation: 'It + is + weather adjective' },
      { type: 'multiple-choice', question: 'In summer, the weather is usually ___', options: ['cold', 'hot', 'snowy', 'freezing'], correctAnswer: 1, difficulty: 'متوسط', explanation: 'الصيف عادة حار' },
      { type: 'fill-blank', question: 'Don\'t forget your ___! It might rain.', correctAnswer: 'umbrella', difficulty: 'متوسط', explanation: 'umbrella = مظلة' }
    ],
    day11: [
      { type: 'multiple-choice', question: 'Last summer, I ___ to Paris.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 2, difficulty: 'متوسط', explanation: 'went هو الماضي من go' },
      { type: 'fill-blank', question: 'I need to book a ___ for my trip.', correctAnswer: 'flight', difficulty: 'متوسط', explanation: 'flight = رحلة طيران' },
      { type: 'translate', question: 'ترجم: "سأسافر الشهر القادم"', correctAnswer: 'I will travel next month', difficulty: 'متوسط', explanation: 'will travel + next month' },
      { type: 'multiple-choice', question: 'Where is my ___? I need it for travel.', options: ['passport', 'password', 'passage', 'passing'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'passport = جواز سفر' },
      { type: 'fill-blank', question: 'The plane ___ at 10 PM.', correctAnswer: 'departs', difficulty: 'متوسط', explanation: 'depart/take off = يقلع' }
    ],
    day12: [
      { type: 'multiple-choice', question: 'I feel ___. I need to see a doctor.', options: ['sick', 'seek', 'sack', 'sake'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'sick = مريض' },
      { type: 'fill-blank', question: 'Exercise is good for your ___', correctAnswer: 'health', difficulty: 'متوسط', explanation: 'health = صحة' },
      { type: 'translate', question: 'ترجم: "أمارس الرياضة كل يوم"', correctAnswer: 'I exercise every day', difficulty: 'متوسط', explanation: 'exercise = يمارس الرياضة' },
      { type: 'multiple-choice', question: 'You should ___ more water.', options: ['drink', 'drinks', 'drinking', 'drank'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'should + verb' },
      { type: 'fill-blank', question: 'I have a ___. My head hurts.', correctAnswer: 'headache', difficulty: 'متوسط', explanation: 'headache = صداع' }
    ],
    day13: [
      { type: 'multiple-choice', question: 'What do you do? I ___ as a teacher.', options: ['work', 'works', 'working', 'worked'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'I work as = أعمل كـ' },
      { type: 'fill-blank', question: 'My ___ is teaching English.', correctAnswer: 'job', difficulty: 'متوسط', explanation: 'job = وظيفة' },
      { type: 'translate', question: 'ترجم: "أريد أن أصبح طبيباً"', correctAnswer: 'I want to become a doctor', difficulty: 'متوسط', explanation: 'want to become = يريد أن يصبح' },
      { type: 'multiple-choice', question: 'She has worked here ___ 5 years.', options: ['since', 'for', 'during', 'while'], correctAnswer: 1, difficulty: 'متوسط', explanation: 'for + period of time' },
      { type: 'fill-blank', question: 'I am looking for a new ___', correctAnswer: 'career', difficulty: 'متوسط', explanation: 'career = مسيرة مهنية' }
    ],
    day14: [
      { type: 'multiple-choice', question: 'I use the ___ to browse the web.', options: ['internet', 'Internet', 'intarnet', 'enter-net'], correctAnswer: 1, difficulty: 'متوسط', explanation: 'Internet يكتب بحرف كبير' },
      { type: 'fill-blank', question: 'Can you send me an ___?', correctAnswer: 'email', difficulty: 'متوسط', explanation: 'email = بريد إلكتروني' },
      { type: 'translate', question: 'ترجم: "التكنولوجيا مهمة جداً"', correctAnswer: 'Technology is very important', difficulty: 'متوسط', explanation: 'Technology + is + adjective' },
      { type: 'multiple-choice', question: 'I need to ___ the app.', options: ['download', 'downlaod', 'downlode', 'downloud'], correctAnswer: 0, difficulty: 'متوسط', explanation: 'download = تنزيل' },
      { type: 'fill-blank', question: 'Don\'t forget your ___. You need it to log in.', correctAnswer: 'password', difficulty: 'متوسط', explanation: 'password = كلمة مرور' }
    ]
  },

  B1: {
    // أضف 8 أيام من التمارين لمستوى B1
    day15: [
      { type: 'multiple-choice', question: 'If I ___ time, I will help you.', options: ['have', 'will have', 'had', 'having'], correctAnswer: 0, difficulty: 'متقدم', explanation: 'First Conditional: If + present, will + verb' },
      { type: 'fill-blank', question: 'I ___ (study) English for 3 years.', correctAnswer: 'have studied', difficulty: 'متقدم', explanation: 'Present Perfect: have/has + past participle' },
      { type: 'translate', question: 'ترجم: "لم أزر لندن من قبل"', correctAnswer: 'I have never visited London', difficulty: 'متقدم', explanation: 'Present Perfect للتجارب' },
      { type: 'multiple-choice', question: 'She has been ___ here since 2020.', options: ['work', 'works', 'working', 'worked'], correctAnswer: 2, difficulty: 'متقدم', explanation: 'Present Perfect Continuous: has been + verb-ing' },
      { type: 'fill-blank', question: 'By next year, I ___ (graduate) from university.', correctAnswer: 'will have graduated', difficulty: 'متقدم', explanation: 'Future Perfect للإنجاز في المستقبل' }
    ],
    day16: [
      { type: 'multiple-choice', question: 'The book ___ by Shakespeare.', options: ['wrote', 'was written', 'is written', 'writes'], correctAnswer: 1, difficulty: 'متقدم', explanation: 'Passive Voice: was/were + past participle' },
      { type: 'fill-blank', question: 'English ___ (speak) all over the world.', correctAnswer: 'is spoken', difficulty: 'متقدم', explanation: 'Present Simple Passive' },
      { type: 'translate', question: 'ترجم: "تم بناء المنزل في 1990"', correctAnswer: 'The house was built in 1990', difficulty: 'متقدم', explanation: 'Past Simple Passive' },
      { type: 'multiple-choice', question: 'The work will be ___ tomorrow.', options: ['finish', 'finished', 'finishing', 'finishes'], correctAnswer: 1, difficulty: 'متقدم', explanation: 'Future Passive: will be + past participle' },
      { type: 'fill-blank', question: 'The problem ___ (solve) by the team.', correctAnswer: 'was solved', difficulty: 'متقدم', explanation: 'Passive Voice في الماضي' }
    ],
    day17: [
      { type: 'multiple-choice', question: 'You ___ smoke here. It\'s prohibited.', options: ['must', 'mustn\'t', 'should', 'can'], correctAnswer: 1, difficulty: 'متقدم', explanation: 'mustn\'t = ممنوع' },
      { type: 'fill-blank', question: 'You ___ see a doctor if you feel sick.', correctAnswer: 'should', difficulty: 'متقدم', explanation: 'should = يجب (نصيحة)' },
      { type: 'translate', question: 'ترجم: "ربما يمطر غداً"', correctAnswer: 'It might rain tomorrow', difficulty: 'متقدم', explanation: 'might = ربما (احتمال)' },
      { type: 'multiple-choice', question: 'She ___ be at home. I saw her car.', options: ['must', 'might', 'can\'t', 'mustn\'t'], correctAnswer: 0, difficulty: 'متقدم', explanation: 'must = لا بد (استنتاج)' },
      { type: 'fill-blank', question: 'I ___ speak three languages when I was young.', correctAnswer: 'could', difficulty: 'متقدم', explanation: 'could = كان يستطيع' }
    ],
    day18: [
      { type: 'multiple-choice', question: 'I wish I ___ rich.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2, difficulty: 'متقدم', explanation: 'I wish + past simple (were للتمني)' },
      { type: 'fill-blank', question: 'If I ___ (be) you, I would accept the offer.', correctAnswer: 'were', difficulty: 'متقدم', explanation: 'Second Conditional: If + past, would + verb' },
      { type: 'translate', question: 'ترجم: "لو كنت غنياً، لسافرت حول العالم"', correctAnswer: 'If I were rich, I would travel around the world', difficulty: 'متقدم', explanation: 'Second Conditional للخيال' },
      { type: 'multiple-choice', question: 'She acts as if she ___ everything.', options: ['know', 'knows', 'knew', 'known'], correctAnswer: 2, difficulty: 'متقدم', explanation: 'as if + past simple' },
      { type: 'fill-blank', question: 'I\'d rather you ___ (not smoke) here.', correctAnswer: 'didn\'t smoke', difficulty: 'متقدم', explanation: 'would rather + past simple' }
    ],
    day19: [
      { type: 'multiple-choice', question: 'The man ___ is talking is my teacher.', options: ['who', 'which', 'whose', 'where'], correctAnswer: 0, difficulty: 'متقدم', explanation: 'who للأشخاص' },
      { type: 'fill-blank', question: 'This is the book ___ I told you about.', correctAnswer: 'that', difficulty: 'متقدم', explanation: 'that/which للأشياء' },
      { type: 'translate', question: 'ترجم: "المدينة التي أعيش فيها كبيرة"', correctAnswer: 'The city where I live is big', difficulty: 'متقدم', explanation: 'where للأماكن' },
      { type: 'multiple-choice', question: 'The woman ___ car was stolen called police.', options: ['who', 'which', 'whose', 'whom'], correctAnswer: 2, difficulty: 'متقدم', explanation: 'whose للملكية' },
      { type: 'fill-blank', question: 'That\'s the reason ___ I left early.', correctAnswer: 'why', difficulty: 'متقدم', explanation: 'why للأسباب' }
    ],
    day20: [
      { type: 'multiple-choice', question: 'He said he ___ tired.', options: ['is', 'was', 'were', 'be'], correctAnswer: 1, difficulty: 'متقدم', explanation: 'Reported Speech: الماضي يتحول للماضي البعيد' },
      { type: 'fill-blank', question: 'She told me that she ___ (go) to the market.', correctAnswer: 'had gone', difficulty: 'متقدم', explanation: 'Reported Speech: past simple → past perfect' },
      { type: 'translate', question: 'ترجم: "قال إنه سيساعدني"', correctAnswer: 'He said he would help me', difficulty: 'متقدم', explanation: 'will → would في الكلام المنقول' },
      { type: 'multiple-choice', question: 'She asked me ___ I was ready.', options: ['that', 'if', 'what', 'which'], correctAnswer: 1, difficulty: 'متقدم', explanation: 'if/whether في الأسئلة المنقولة' },
      { type: 'fill-blank', question: 'He asked me where I ___', correctAnswer: 'lived', difficulty: 'متقدم', explanation: 'Reported Questions: past tense' }
    ],
    day21: [
      { type: 'multiple-choice', question: '___ the rain, we went out.', options: ['Although', 'Despite', 'However', 'But'], correctAnswer: 1, difficulty: 'متقدم', explanation: 'Despite + noun' },
      { type: 'fill-blank', question: '___ I was tired, I continued working.', correctAnswer: 'Although', difficulty: 'متقدم', explanation: 'Although + clause' },
      { type: 'translate', question: 'ترجم: "بالرغم من المطر، خرجنا"', correctAnswer: 'Despite the rain, we went out', difficulty: 'متقدم', explanation: 'Despite/In spite of + noun' },
      { type: 'multiple-choice', question: 'It was expensive. ___, I bought it.', options: ['Although', 'Despite', 'However', 'Though'], correctAnswer: 2, difficulty: 'متقدم', explanation: 'However يأتي بين جملتين' },
      { type: 'fill-blank', question: 'He studied hard. ___, he failed.', correctAnswer: 'Nevertheless', difficulty: 'متقدم', explanation: 'Nevertheless = ومع ذلك' }
    ],
    day22: [
      { type: 'multiple-choice', question: 'I suggest that he ___ more.', options: ['study', 'studies', 'studied', 'studying'], correctAnswer: 0, difficulty: 'متقدم', explanation: 'suggest + (that) + base verb' },
      { type: 'fill-blank', question: 'It\'s important that she ___ (be) on time.', correctAnswer: 'be', difficulty: 'متقدم', explanation: 'Subjunctive: base form بعد important that' },
      { type: 'translate', question: 'ترجم: "أقترح أن نبدأ مبكراً"', correctAnswer: 'I suggest that we start early', difficulty: 'متقدم', explanation: 'suggest + base verb' },
      { type: 'multiple-choice', question: 'He insisted that I ___ with him.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 0, difficulty: 'متقدم', explanation: 'insist + base verb' },
      { type: 'fill-blank', question: 'I recommend that you ___ (see) a doctor.', correctAnswer: 'see', difficulty: 'متقدم', explanation: 'recommend + base verb' }
    ]
  },

  B2: {
    // أضف 8 أيام من التمارين لمستوى B2
    day23: [
      { type: 'multiple-choice', question: 'If I had known, I ___ you.', options: ['would tell', 'would have told', 'will tell', 'told'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Third Conditional: If + past perfect, would have + past participle' },
      { type: 'fill-blank', question: 'Had I seen you, I ___ (say) hello.', correctAnswer: 'would have said', difficulty: 'خبير', explanation: 'Inverted Third Conditional' },
      { type: 'translate', question: 'ترجم: "لو كنت درست، لنجحت"', correctAnswer: 'If I had studied, I would have passed', difficulty: 'خبير', explanation: 'Third Conditional للماضي المستحيل' },
      { type: 'multiple-choice', question: 'She wishes she ___ gone to university.', options: ['has', 'had', 'have', 'was'], correctAnswer: 1, difficulty: 'خبير', explanation: 'wish + past perfect للندم' },
      { type: 'fill-blank', question: 'If only I ___ (listen) to your advice!', correctAnswer: 'had listened', difficulty: 'خبير', explanation: 'If only + past perfect' }
    ],
    day24: [
      { type: 'multiple-choice', question: 'Not only ___ late, but he also forgot his keys.', options: ['he was', 'was he', 'he is', 'is he'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Inversion after negative adverbials' },
      { type: 'fill-blank', question: 'Rarely ___ (do) we see such talent.', correctAnswer: 'do', difficulty: 'خبير', explanation: 'Inversion بعد rarely' },
      { type: 'translate', question: 'ترجم: "نادراً ما أشاهد التلفاز"', correctAnswer: 'Rarely do I watch TV', difficulty: 'خبير', explanation: 'Inversion بعد Rarely' },
      { type: 'multiple-choice', question: 'Under no circumstances ___ this information.', options: ['you should share', 'should you share', 'you share', 'share you'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Inversion after negative expressions' },
      { type: 'fill-blank', question: 'Little ___ (do) he know about the surprise.', correctAnswer: 'did', difficulty: 'خبير', explanation: 'Inversion after Little' }
    ],
    day25: [
      { type: 'multiple-choice', question: 'The meeting having ended, we ___ home.', options: ['go', 'went', 'gone', 'going'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Participle clauses' },
      { type: 'fill-blank', question: '___ (finish) his work, he went for a walk.', correctAnswer: 'Having finished', difficulty: 'خبير', explanation: 'Perfect participle للترتيب' },
      { type: 'translate', question: 'ترجم: "بعد الانتهاء من الواجب، شاهدت فيلماً"', correctAnswer: 'Having finished homework, I watched a movie', difficulty: 'خبير', explanation: 'Having + past participle' },
      { type: 'multiple-choice', question: '___ by his words, she left.', options: ['Hurt', 'Hurting', 'Having hurt', 'To hurt'], correctAnswer: 0, difficulty: 'خبير', explanation: 'Past participle للحالة السلبية' },
      { type: 'fill-blank', question: 'The project ___ (complete), we celebrated.', correctAnswer: 'completed', difficulty: 'خبير', explanation: 'Participle clause' }
    ],
    day26: [
      { type: 'multiple-choice', question: 'It is essential that he ___ present.', options: ['is', 'be', 'was', 'were'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Subjunctive mood' },
      { type: 'fill-blank', question: 'I demand that she ___ (apologize) immediately.', correctAnswer: 'apologize', difficulty: 'خبير', explanation: 'demand + base form' },
      { type: 'translate', question: 'ترجم: "من الضروري أن يحضر الجميع"', correctAnswer: 'It is essential that everyone attend', difficulty: 'خبير', explanation: 'Subjunctive: base verb' },
      { type: 'multiple-choice', question: 'The proposal requires that all members ___ informed.', options: ['are', 'be', 'were', 'is'], correctAnswer: 1, difficulty: 'خبير', explanation: 'require + subjunctive' },
      { type: 'fill-blank', question: 'It\'s crucial that he ___ (understand) the risks.', correctAnswer: 'understand', difficulty: 'خبير', explanation: 'crucial that + base verb' }
    ],
    day27: [
      { type: 'multiple-choice', question: 'Break a ___! (Good luck)', options: ['arm', 'leg', 'heart', 'head'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Break a leg = حظ سعيد (idiom)' },
      { type: 'fill-blank', question: 'It\'s raining cats and ___', correctAnswer: 'dogs', difficulty: 'خبير', explanation: 'مطر غزير (تعبير اصطلاحي)' },
      { type: 'translate', question: 'ترجم التعبير: "قطعة من الكعك" (سهل جداً)', correctAnswer: 'A piece of cake', difficulty: 'خبير', explanation: 'سهل جداً = piece of cake' },
      { type: 'multiple-choice', question: 'To spill the ___ means to reveal a secret.', options: ['milk', 'beans', 'water', 'tea'], correctAnswer: 1, difficulty: 'خبير', explanation: 'spill the beans = يكشف سراً' },
      { type: 'fill-blank', question: 'He\'s feeling under the ___ today.', correctAnswer: 'weather', difficulty: 'خبير', explanation: 'under the weather = مريض قليلاً' }
    ],
    day28: [
      { type: 'multiple-choice', question: 'The data ___ that sales are increasing.', options: ['suggest', 'suggests', 'is suggesting', 'are suggesting'], correctAnswer: 1, difficulty: 'خبير', explanation: 'data يمكن أن يكون مفرد أو جمع' },
      { type: 'fill-blank', question: 'The committee ___ (have) reached a decision.', correctAnswer: 'has', difficulty: 'خبير', explanation: 'collective noun يمكن أن يأخذ مفرد' },
      { type: 'translate', question: 'ترجم: "يجب أخذ جميع الاحتمالات بعين الاعتبار"', correctAnswer: 'All possibilities must be taken into account', difficulty: 'خبير', explanation: 'Passive voice + complex structure' },
      { type: 'multiple-choice', question: 'Neither the students nor the teacher ___ present.', options: ['were', 'was', 'are', 'is'], correctAnswer: 1, difficulty: 'خبير', explanation: 'Neither...nor: الفعل يتبع الأقرب' },
      { type: 'fill-blank', question: 'The majority of people ___ (agree) with this.', correctAnswer: 'agree', difficulty: 'خبير', explanation: 'majority of + plural noun = plural verb' }
    ],
    day29: [
      { type: 'multiple-choice', question: 'He is said ___ a millionaire.', options: ['be', 'to be', 'being', 'been'], correctAnswer: 1, difficulty: 'خبير', explanation: 'be said to = يُقال إنه' },
      { type: 'fill-blank', question: 'The report is believed ___ (complete) by next week.', correctAnswer: 'to be completed', difficulty: 'خبير', explanation: 'passive infinitive' },
      { type: 'translate', question: 'ترجم: "يُعتقد أنه غادر البلاد"', correctAnswer: 'He is believed to have left the country', difficulty: 'خبير', explanation: 'be believed to have + past participle' },
      { type: 'multiple-choice', question: 'She appears ___ the truth.', options: ['know', 'to know', 'knowing', 'known'], correctAnswer: 1, difficulty: 'خبير', explanation: 'appear + to infinitive' },
      { type: 'fill-blank', question: 'They seem ___ (enjoy) the party.', correctAnswer: 'to be enjoying', difficulty: 'خبير', explanation: 'seem + continuous infinitive' }
    ],
    day30: [
      { type: 'multiple-choice', question: 'Choose the most formal: "I want to ___"', options: ['ask for', 'request', 'want', 'need'], correctAnswer: 1, difficulty: 'خبير', explanation: 'request أكثر رسمية' },
      { type: 'fill-blank', question: 'The evidence ___ (suggest) a different conclusion.', correctAnswer: 'suggests', difficulty: 'خبير', explanation: 'استخدام formal للتقارير' },
      { type: 'translate', question: 'ترجم بشكل رسمي: "نحتاج إلى مناقشة هذا الأمر"', correctAnswer: 'This matter requires discussion', difficulty: 'خبير', explanation: 'أسلوب رسمي وأكاديمي' },
      { type: 'multiple-choice', question: 'Which is most academic? "The study ___"', options: ['shows', 'demonstrates', 'says', 'tells'], correctAnswer: 1, difficulty: 'خبير', explanation: 'demonstrates أكثر أكاديمية' },
      { type: 'fill-blank', question: 'The findings ___ (indicate) significant improvement.', correctAnswer: 'indicate', difficulty: 'خبير', explanation: 'indicate للأسلوب الأكاديمي' }
    ]
  }
};

// ============================================
// نصوص القراءة الموسعة (نص لكل يوم)
// ============================================
// ============================================
// نصوص القراءة الكاملة - جميع المستويات
// نفس الـ Structure الأصلي
// ============================================

const READING_TEXTS = {
  A1: {
    1: {
      title: 'Meeting New Friends',
      text: 'Hello! My name is Ahmed. I am 25 years old. I live in Cairo, Egypt. I work in a bank. Every morning, I wake up at 6 AM. I eat breakfast with my family. Then I go to work. I like my job. I have many friends at work. We eat lunch together every day. In the evening, I go home. I watch TV and read books. On weekends, I play football with my friends. I am happy with my life.',
      words: 85
    },
    2: 'My Daily Routine\n\nEvery day, I wake up at seven o\'clock. First, I brush my teeth and wash my face. Then I eat breakfast. I like to eat bread and drink tea. After breakfast, I get dressed and go to work. I work from 8 AM to 4 PM. I have lunch at 12 o\'clock. After work, I go to the gym. I exercise for one hour. Then I go home. I eat dinner with my family. We watch TV together. I go to bed at 10 PM. This is my daily routine.',
    3: 'My Family\n\nI have a big family. My father\'s name is Mohamed. He is a teacher. My mother\'s name is Fatima. She is a doctor. I have two brothers and one sister. My older brother is Ali. He is 30 years old. He works in a hospital. My younger brother is Omar. He is 15 years old. He is a student. My sister Sara is 20 years old. She studies at university. We all live together in one house. We love each other very much. Every Friday, we have a big family dinner.',
    4: 'Shopping for Food\n\nToday is Saturday. I go to the supermarket with my mother. We need to buy food for the week. First, we buy bread and rice. Then we go to the vegetable section. We buy tomatoes, cucumbers, and lettuce. My mother likes to buy fresh vegetables. After that, we buy meat and chicken. We also buy milk, eggs, and cheese. I love cheese! Finally, we buy some fruits. We get apples, oranges, and bananas. Shopping takes two hours. Then we go home and put everything in the refrigerator.',
    5: 'Visiting the City\n\nLast weekend, I visited the city center. I went with my friend Khaled. We took the bus from my house. The bus was crowded. After 30 minutes, we arrived at the city center. First, we went to the museum. The museum was very interesting. We saw old paintings and statues. Then we walked in the park. The park was beautiful. There were many trees and flowers. We sat on a bench and ate sandwiches. After that, we went to a cafe. We drank coffee and talked. It was a wonderful day.',
    6: 'My Weekly Schedule\n\nFrom Monday to Friday, I work. I start work at 8 AM and finish at 5 PM. Every Monday, I have a team meeting at 9 AM. On Tuesday and Thursday, I go to English class after work. The class is from 6 PM to 8 PM. On Wednesday, I visit my grandmother. She lives near my house. On Friday, I usually go shopping. Saturday is my favorite day. I sleep late and relax. On Sunday, I clean my room and do laundry. Then I prepare for the new week. This is my typical week.',
    7: 'My Hobbies\n\nI have many hobbies. I love reading books. My favorite books are mystery novels. I read before I go to bed every night. I also like playing football. Every Sunday, I play football with my friends in the park. We play for two hours. It is very fun and good exercise. Another hobby is cooking. I like to try new recipes. Last week, I made pizza. It was delicious! Sometimes I watch movies. I like action movies and comedies. My hobbies make me happy and help me relax after work.'
  },

  A2: {
    8: 'A Day at Work\n\nMy name is Sara, and I work as a software developer at a technology company. My typical workday starts at 8:30 AM when I arrive at the office. First, I check my emails and plan my tasks for the day. Then I attend a team meeting where we discuss our current projects. After the meeting, I spend most of my morning writing code and fixing bugs. At noon, I take a lunch break with my colleagues. In the afternoon, I continue programming until 5 PM. Sometimes I stay late to finish important work. I enjoy my job because I learn new things every day and work with talented people.',
    9: 'Shopping for Clothes\n\nLast Saturday, I went shopping for new clothes because I needed outfits for my new job. I visited the shopping mall near my house. First, I looked at the professional clothes section. I tried on several shirts and pants. The shop assistant was very helpful. I found a beautiful blue shirt that fit perfectly. It was a bit expensive, but the quality was excellent. Then I bought two pairs of black pants and a jacket. I also needed new shoes, so I went to a shoe store. The total cost was high, but I was happy with my purchases.',
    10: 'Weather and Seasons\n\nI live in a country where we experience four distinct seasons. Each season has its own beauty. In spring, the weather is mild and pleasant. Flowers bloom everywhere, and the temperature is comfortable. Summer is hot and sunny. Temperatures can reach 35 degrees or higher. Many people go to the beach to cool down. In autumn, the weather becomes cooler. Leaves change color and fall from trees. Winter is cold and sometimes we get snow. Temperatures drop below zero degrees. I enjoy each season for different reasons.',
    11: 'My Summer Vacation\n\nLast summer, I took a two-week vacation to Turkey with my family. We planned this trip for months and were very excited. We flew from Cairo to Istanbul. The flight took about three hours. When we arrived, we checked into our hotel in the old city. During our stay, we visited many famous places including the Blue Mosque and Hagia Sophia. We also took a boat tour on the Bosphorus and enjoyed delicious Turkish food every day. In the second week, we traveled to Antalya and spent time at the beach. The water was crystal clear. This vacation was unforgettable.',
    12: 'Staying Healthy\n\nStaying healthy is very important to me. I try to exercise at least three times a week. I usually go to the gym or run in the park. Exercise makes me feel energetic and happy. I also pay attention to what I eat. I try to eat lots of vegetables and fruits every day. I drink plenty of water and avoid sugary drinks. Getting enough sleep is important too. I try to sleep seven to eight hours every night. When I feel sick, I visit the doctor immediately. Last month, I had a bad cold. The doctor told me to rest and drink warm liquids. I followed his advice and felt better in a few days.',
    13: 'My Job Interview\n\nTwo months ago, I had an important job interview at a big company. I was very nervous because I really wanted the job. I prepared for the interview carefully. I researched the company and practiced answering common interview questions. On the interview day, I wore my best suit and arrived 15 minutes early. The interviewer was friendly and asked me about my education and work experience. I answered all questions confidently. He also asked why I wanted to work for their company. I explained my interest in their projects. The interview lasted one hour. A week later, they called me with good news - I got the job!',
    14: 'Technology in My Life\n\nTechnology plays a huge role in my daily life. I use my smartphone for many things. I check emails, browse social media, and watch videos. I also use apps for banking, shopping, and navigation. At work, I use a computer and various software programs. The internet helps me learn new things and stay connected with friends and family. I video call my parents who live in another city every week. I also enjoy streaming movies and music online. However, I try not to spend too much time on screens. I believe it is important to balance technology use with real-life activities and face-to-face interactions.'
  },

  B1: {
    15: 'The Importance of Learning Languages\n\nLearning a second language has become increasingly important in today\'s globalized world. English, in particular, has become the lingua franca of international business, science, and technology. By mastering English, individuals open doors to countless opportunities. These include better career prospects, access to international education, and the ability to communicate with people from different cultures. Moreover, learning a new language enhances cognitive abilities. Studies show that bilingual people have better memory, problem-solving skills, and multitasking abilities. Language learning also provides a deeper understanding of different cultures and perspectives. It allows us to appreciate literature, films, and music in their original form. Additionally, knowing another language makes travel more enjoyable and meaningful. You can interact with locals and understand their customs better. Despite the challenges, the benefits of language learning far outweigh the difficulties. With dedication and the right resources, anyone can become proficient in a foreign language.',
    16: 'The Impact of Social Media\n\nSocial media has transformed the way we communicate and share information. Platforms like Facebook, Instagram, and Twitter connect billions of people worldwide. These platforms allow us to stay in touch with friends and family, share our experiences, and express our opinions. Businesses use social media for marketing and customer engagement. It has also become a powerful tool for social movements and raising awareness about important issues. However, social media has its downsides. Many people spend excessive time scrolling through feeds, which can affect productivity and mental health. The constant comparison with others can lead to feelings of inadequacy and anxiety. Privacy concerns are also significant, as personal data can be misused. Misinformation spreads rapidly on these platforms, making it difficult to distinguish fact from fiction. Despite these challenges, social media is here to stay. The key is to use it mindfully and maintain a healthy balance between online and offline life.',
    17: 'Environmental Challenges\n\nOur planet faces numerous environmental challenges that require immediate attention. Climate change is perhaps the most pressing issue. Rising temperatures are causing glaciers to melt, sea levels to rise, and weather patterns to become more extreme. These changes threaten ecosystems and human communities worldwide. Deforestation is another major problem. Trees absorb carbon dioxide and produce oxygen, but millions of hectares of forests are destroyed each year for agriculture and development. This loss of forests contributes to climate change and results in habitat loss for countless species. Plastic pollution has reached crisis levels. Our oceans are filled with plastic waste that harms marine life and enters the food chain. Air and water pollution continue to affect public health in many regions. To address these challenges, we need both individual and collective action. Simple steps like reducing waste, using renewable energy, and supporting environmental policies can make a difference. Governments and businesses must also take responsibility and implement sustainable practices.',
    18: 'The Future of Work\n\nThe world of work is changing rapidly due to technological advancements and shifting social attitudes. Automation and artificial intelligence are transforming many industries. While these technologies increase efficiency and productivity, they also raise concerns about job displacement. Many traditional jobs may disappear, but new ones will emerge. The key is to adapt and acquire new skills. Remote work has become increasingly common, especially after the COVID-19 pandemic. Many companies now offer flexible work arrangements, allowing employees to work from home or anywhere with internet access. This shift has benefits such as reduced commuting time and better work-life balance. However, it also presents challenges like maintaining team cohesion and separating work from personal life. The gig economy is growing, with more people working as freelancers or contractors rather than traditional employees. This offers flexibility but less job security. Education systems must evolve to prepare students for this changing landscape. Emphasis should be on critical thinking, creativity, and adaptability rather than memorizing facts.',
    19: 'Cultural Diversity\n\nCultural diversity enriches our world in countless ways. Every culture has unique traditions, values, and perspectives that contribute to human civilization. When people from different backgrounds come together, they bring diverse ideas and experiences that foster innovation and creativity. In multicultural societies, individuals have opportunities to learn about different customs, cuisines, and art forms. This exposure broadens horizons and challenges stereotypes. However, cultural diversity also presents challenges. Misunderstandings can arise from different communication styles and social norms. Language barriers may hinder effective interaction. Some people resist diversity due to fear of change or loss of cultural identity. Education plays a crucial role in promoting cultural understanding. Schools should teach students about different cultures and encourage respect for diversity. Workplaces benefit from diverse teams, as different perspectives lead to better problem-solving and decision-making. Governments have a responsibility to protect minority rights and promote inclusion. As our world becomes increasingly interconnected, embracing cultural diversity is not just beneficial but essential for peace and progress.',
    20: 'The Role of Education\n\nEducation is the foundation of personal and societal development. It provides individuals with knowledge, skills, and values necessary for success in life. Beyond teaching academic subjects, education shapes character and critical thinking abilities. A good education system prepares students for the challenges of the modern world. Traditional education focused primarily on memorization and standardized testing. However, modern approaches emphasize creativity, problem-solving, and practical skills. Project-based learning and collaborative work are becoming more common. Technology has revolutionized education, making information more accessible than ever. Online courses and digital resources allow people to learn at their own pace and from anywhere. Despite these advancements, educational inequality remains a significant issue. Many children, especially in developing countries, lack access to quality education. Even in wealthy nations, disparities exist based on socioeconomic status. Investing in education yields tremendous returns. Educated populations are more productive, innovative, and engaged in civic life. They make informed decisions and contribute positively to society.',
    21: 'Health and Wellness Trends\n\nIn recent years, there has been a growing awareness of health and wellness. People are paying more attention to their physical and mental well-being. Exercise and fitness have become priorities for many. Gyms and fitness centers are more popular than ever, and new forms of exercise like yoga and CrossFit have gained widespread appeal. Nutrition is another focus area. Many people are adopting healthier diets, choosing organic foods, and reducing sugar and processed food intake. Vegetarian and vegan diets are becoming more common, both for health reasons and ethical concerns about animal welfare. Mental health awareness has also increased significantly. The stigma surrounding mental health issues is gradually decreasing. More people are seeking therapy and using meditation apps for stress management. Workplaces are recognizing the importance of employee well-being and offering wellness programs. However, the wellness industry has its critics. Some trends are based more on marketing than science. The pressure to maintain perfect health and appearance can itself be stressful. The key is finding a balanced approach that works for each individual.',
    22: 'Urban Living vs. Rural Life\n\nThe choice between urban and rural living involves various considerations. Cities offer numerous advantages. They provide more job opportunities, especially in specialized fields. Urban areas have better infrastructure, including public transportation, healthcare facilities, and educational institutions. Cultural amenities like museums, theaters, and restaurants are readily available. Cities are diverse and dynamic, offering exposure to different people and ideas. However, urban living has significant drawbacks. Cities are expensive, with high costs for housing, food, and services. They are crowded and noisy, which can be stressful. Air pollution and lack of green spaces affect health and quality of life. Rural areas, in contrast, offer peace and natural beauty. The pace of life is slower and less stressful. Housing is more affordable, and communities are often close-knit. However, rural areas have fewer job opportunities and limited access to services. Entertainment options are limited, which can feel isolating, especially for young people. The digital age is blurring these distinctions. Remote work allows people to live in rural areas while maintaining urban careers. Ultimately, the choice depends on individual priorities and life circumstances.'
  },

  B2: {
    23: 'The Phenomenon of Globalization\n\nGlobalization has fundamentally transformed the way societies interact and conduct business on an international scale. This complex process involves the increasing interconnectedness of economies, cultures, and populations through cross-border trade, investment, and technology. While proponents argue that globalization has led to unprecedented economic growth and cultural exchange, critics contend that it has exacerbated inequality and threatened local traditions. The economic dimension of globalization is perhaps most visible. Multinational corporations operate across borders, creating global supply chains and markets. This has lifted millions out of poverty, particularly in developing nations like China and India. However, it has also led to job losses in developed countries as manufacturing moved to regions with lower labor costs. The benefits and burdens of globalization are not evenly distributed. Culturally, globalization has facilitated the spread of ideas, art, and entertainment worldwide. The internet and social media have made cross-cultural communication instant and ubiquitous. Yet this cultural homogenization worries many who fear the loss of linguistic and cultural diversity. The debate surrounding globalization is multifaceted, encompassing economic, social, political, and environmental dimensions. As we navigate this increasingly interconnected world, it is crucial to strike a balance between embracing global opportunities and preserving local identity and autonomy.',
    24: 'Artificial Intelligence and Ethics\n\nArtificial intelligence represents one of the most transformative technologies of our era, with implications that extend far beyond mere technical advancement. As AI systems become increasingly sophisticated, capable of performing tasks that once required human intelligence, we face profound ethical questions. The potential benefits are enormous. AI can revolutionize healthcare through improved diagnostics and personalized treatment. It can address climate change by optimizing energy use and modeling environmental systems. In education, AI can provide customized learning experiences for each student. However, these opportunities come with significant ethical challenges. Algorithmic bias is a major concern. AI systems trained on historical data may perpetuate existing prejudices regarding race, gender, or socioeconomic status. Privacy issues arise as AI requires vast amounts of personal data. The question of accountability is complex: when an autonomous vehicle causes an accident, who bears responsibility? Job displacement due to automation threatens economic stability for millions. Moreover, as AI systems become more autonomous, we must consider questions of consciousness and rights. The development of AI weapons raises fears about autonomous warfare. To navigate these challenges, we need robust ethical frameworks and regulations. Technology companies, governments, and civil society must collaborate to ensure AI development aligns with human values and promotes the common good rather than narrow interests.',
    25: 'The Psychology of Decision Making\n\nHuman decision-making is a far more complex process than it might initially appear. While we like to think of ourselves as rational actors who carefully weigh pros and cons, psychological research reveals that our choices are influenced by numerous cognitive biases and emotional factors. Understanding these mechanisms is crucial for making better decisions and recognizing manipulation. Cognitive biases are systematic patterns of deviation from rationality. Confirmation bias leads us to seek information that supports our existing beliefs while ignoring contradictory evidence. The availability heuristic causes us to overestimate the likelihood of events that are easily recalled, often because they are dramatic or recent. Anchoring bias occurs when we rely too heavily on the first piece of information encountered. The sunk cost fallacy makes us continue investments in failing projects because we have already committed resources. Emotions play a significant role in decision-making, sometimes helpfully and sometimes detrimentally. Fear can lead to overly conservative choices, while excessive optimism results in unrealistic plans. Social pressures and the desire for conformity influence our decisions in ways we often do not recognize. The paradox of choice suggests that having too many options can lead to decision paralysis and dissatisfaction. Improving decision-making requires awareness of these biases, seeking diverse perspectives, and developing structured approaches to important choices. In an age of information overload and sophisticated persuasion techniques, critical thinking skills are more essential than ever.',
    26: 'Sustainable Development Challenges\n\nSustainable development seeks to meet present needs without compromising the ability of future generations to meet theirs. This concept, while simple in principle, presents enormous practical challenges that require balancing economic growth, environmental protection, and social equity. The tension between development and sustainability is particularly acute in emerging economies, where rapid industrialization has lifted millions from poverty but often at significant environmental cost. Climate change represents the defining challenge of sustainable development. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are warming the planet with potentially catastrophic consequences. Transitioning to renewable energy sources is essential but faces obstacles including technological limitations, economic costs, and political resistance from entrenched interests. Developed nations, having largely achieved prosperity through carbon-intensive industrialization, face questions about their responsibility to assist developing countries in pursuing cleaner growth paths. Resource depletion is another critical concern. Fresh water scarcity affects billions of people. Overfishing threatens ocean ecosystems and food security. Biodiversity loss continues at alarming rates, potentially undermining ecosystem services that humans depend upon. Addressing these challenges requires systemic changes. Circular economy models that minimize waste and maximize resource efficiency offer promise. Green technologies continue advancing, but need greater investment and supportive policies. International cooperation is essential, yet difficult to achieve given competing national interests. Individual actions matter, but systemic change requires policy interventions and corporate responsibility.',
    27: 'The Evolution of Democracy\n\nDemocracy, the system of government by the people, has evolved significantly since its ancient origins in Athens. Modern democracies face challenges that test their foundational principles and require constant adaptation. While democracy has spread globally over the past century, recent years have seen concerning trends of democratic backsliding in various regions. The promise of democracy lies in its core principles: political equality, popular sovereignty, and protection of individual rights. Democratic systems, in theory, allow citizens to participate in decision-making, hold leaders accountable, and peacefully transfer power. However, the practice of democracy often falls short of these ideals. Voter suppression, gerrymandering, and campaign finance issues can distort representation. Populist movements challenge liberal democratic norms, sometimes eroding checks and balances. The rise of misinformation and echo chambers threatens informed citizenship. Social media has transformed political discourse, sometimes amplifying extreme voices and deepening polarization. Economic inequality can undermine political equality when wealth translates into disproportionate political influence. The digital age presents both opportunities and threats for democracy. Technology enables new forms of civic participation and transparency. Yet it also facilitates surveillance and manipulation. Authoritarian regimes have become sophisticated in using digital tools for social control. For democracy to thrive, institutions must adapt. Electoral systems may need reform to ensure fair representation. Media literacy education is crucial for navigating the information landscape. Civil society organizations play a vital role in holding power accountable. Ultimately, democracy requires active, informed citizenship and a shared commitment to democratic values.',
    28: 'The Science of Happiness\n\nWhat makes people happy? This seemingly simple question has occupied philosophers for millennia and more recently has become the subject of rigorous scientific investigation. Positive psychology, the scientific study of well-being, has yielded fascinating insights that challenge common assumptions about happiness. Research consistently shows that once basic needs are met, additional wealth has diminishing returns for happiness. The hedonic treadmill describes our tendency to quickly adapt to improvements in circumstances, returning to a baseline happiness level. This explains why lottery winners often report being no happier than before after the initial excitement fades. Conversely, people often demonstrate remarkable resilience, adapting to adverse circumstances better than expected. Social connections emerge as perhaps the most important factor in well-being. Strong relationships with family and friends consistently correlate with happiness across cultures. Loneliness, conversely, is associated with numerous negative health outcomes. Meaningful work and a sense of purpose contribute significantly to life satisfaction. The concept of flow—being fully absorbed in challenging activities—is associated with positive experiences. Gratitude practices and helping others have been shown to boost well-being. Physical health, including exercise and sleep, affects mental well-being significantly. Interestingly, pursuing happiness directly often backfires. People who prioritize happiness tend to set unrealistic standards and feel disappointed. A better approach focuses on meaning and engagement rather than pleasure. Cultural factors influence what makes people happy. Individualistic societies emphasize personal achievement, while collectivist cultures prioritize group harmony. Understanding the science of happiness can inform both personal choices and public policy aimed at promoting well-being.',
    29: 'The Future of Food\n\nThe global food system faces unprecedented challenges as the world population approaches 10 billion. Climate change, resource scarcity, and dietary shifts are transforming how we produce and consume food. Innovation across the food chain offers potential solutions, though implementing change at scale presents significant obstacles. Agriculture accounts for significant greenhouse gas emissions and uses vast amounts of fresh water. Climate change threatens crop yields through extreme weather and shifting growing seasons. Conventional farming practices have degraded soil health and biodiversity. Sustainable agriculture methods, including regenerative farming and precision agriculture using sensors and AI, offer more environmentally friendly approaches. However, transitioning requires investment and knowledge transfer. Alternative protein sources are gaining attention. Plant-based meat substitutes have improved dramatically in taste and texture. Cultured meat, grown from cells without raising and slaughtering animals, may become commercially viable. Insects, consumed in many cultures, are efficient protein sources. These alternatives could reduce the environmental impact of meat production, though consumer acceptance varies. Food waste represents an enormous problem. Approximately one-third of food produced is wasted, representing squandered resources and unnecessary environmental impact. Improvements in storage, distribution, and consumer behavior could significantly reduce waste. Urban agriculture and vertical farming could bring food production closer to consumers, reducing transportation emissions and increasing freshness. Biotechnology, including genetic modification and gene editing, offers tools for developing crops resistant to pests, drought, and disease. However, GMOs remain controversial, particularly in Europe. The future food system must balance productivity, sustainability, environmental protection, and cultural food traditions.',
    30: 'Critical Thinking in the Information Age\n\nIn an era characterized by information abundance and sophisticated manipulation techniques, critical thinking has never been more essential. The ability to analyze arguments, evaluate evidence, and distinguish reliable information from misinformation represents a crucial competency for navigating modern life. Yet educational systems often fail to adequately develop these skills, leaving citizens vulnerable to manipulation and poor decision-making. Critical thinking involves several interconnected skills. Analytical thinking requires breaking down complex information into components and understanding relationships between them. Evaluating sources demands assessing credibility, identifying bias, and recognizing conflicts of interest. Logical reasoning involves identifying fallacies and assessing argument validity. Metacognition—thinking about one\'s own thinking—helps recognize personal biases and knowledge limitations. The digital information environment presents particular challenges. Social media algorithms create echo chambers that reinforce existing beliefs. Deepfakes and sophisticated disinformation campaigns blur lines between fact and fiction. The sheer volume of information makes verification difficult. Bad actors exploit cognitive biases and emotional triggers to spread misinformation for political or financial gain. Developing critical thinking requires deliberate practice and appropriate dispositions. Intellectual humility—recognizing that one might be wrong—is essential. Curiosity drives investigation beyond surface-level understanding. Fair-mindedness involves considering alternative perspectives charitably. Educational institutions must prioritize these skills throughout curricula rather than treating them as separate subjects. Teaching critical thinking in context—analyzing real-world issues—proves more effective than abstract lessons. Media literacy programs help students navigate digital information landscapes. Encouraging questions and debate fosters critical thinking more than passive information reception. A society of critical thinkers is better equipped to address complex challenges and resist manipulation.'
  }
};



// ============================================
// إحصائيات النصوص
// ============================================
export const READING_STATS = {
  A1: {
    totalTexts: 7,
    avgWordsPerText: 95,
    totalWords: 674,
    difficulty: 'Beginner - Simple present, basic vocabulary'
  },
  A2: {
    totalTexts: 7,
    avgWordsPerText: 135,
    totalWords: 945,
    difficulty: 'Elementary - Past tenses, more complex sentences'
  },
  B1: {
    totalTexts: 8,
    avgWordsPerText: 200,
    totalWords: 1600,
    difficulty: 'Intermediate - Various tenses, topic-specific vocabulary'
  },
  B2: {
    totalTexts: 8,
    avgWordsPerText: 350,
    totalWords: 2800,
    difficulty: 'Upper-Intermediate - Complex structures, academic vocabulary'
  },
  overall: {
    totalTexts: 30,
    totalWords: 6019,
    avgWordsPerDay: 200
  }
};

const getLessonTitle = (day, level) => {
  const titles = {
    A1: [
      'التحيات والتعارف', 'الأرقام والألوان', 'العائلة والأصدقاء', 'الطعام والشراب',
      'الأماكن والاتجاهات', 'الوقت والتواريخ', 'الهوايات والاهتمامات'
    ],
    A2: [
      'الروتين اليومي', 'التسوق والملابس', 'الطقس والمواسم', 'السفر والإجازات',
      'الصحة والرياضة', 'العمل والمهن', 'التكنولوجيا والإنترنت'
    ],
    B1: [
      'التعليم والدراسة', 'الثقافة والفنون', 'البيئة والطبيعة', 'الأخبار والأحداث',
      'العلاقات الاجتماعية', 'التخطيط للمستقبل', 'حل المشكلات', 'التفاوض والإقناع'
    ],
    B2: [
      'القضايا العالمية', 'الاقتصاد والأعمال', 'العلم والتكنولوجيا', 'الفلسفة والأخلاق',
      'السياسة والحكومة', 'النقد والتحليل', 'الابتكار والإبداع', 'إتقان اللغة والطلاقة'
    ]
  }
  const levelDays = LEVELS[level]?.days || [];
  const index = levelDays.indexOf(day);
  return titles[level]?.[index] || 'درس متقدم';
}

const getLessonDescription = (day, level) => {
  const descriptions = {
    A1: 'أساسيات اللغة الإنجليزية للمبتدئين - بناء قاعدة قوية',
    A2: 'تطوير المهارات الأساسية والتواصل في مواقف يومية',
    B1: 'التعبير عن الأفكار بوضوح والمشاركة في نقاشات',
    B2: 'إتقان اللغة والتعامل مع مواضيع معقدة'
  }
  return descriptions[level]
}

const generateGrammarTopics = (level) => {
  const grammar = {
    A1: [
      { topic: 'الضمائر الشخصية', description: 'I, You, He, She, It, We, They', exercises: 5 },
      { topic: 'فعل الكون (Be)', description: 'am, is, are في المضارع', exercises: 5 },
      { topic: 'الأفعال البسيطة', description: 'الأفعال في المضارع البسيط', exercises: 5 },
      { topic: 'أدوات التعريف', description: 'a, an, the', exercises: 5 }
    ],
    A2: [
      { topic: 'الماضي البسيط', description: 'Past Simple tense', exercises: 6 },
      { topic: 'المضارع المستمر', description: 'Present Continuous', exercises: 6 },
      { topic: 'حروف الجر', description: 'in, on, at, by', exercises: 6 },
      { topic: 'الصفات المقارنة', description: 'Comparative adjectives', exercises: 6 }
    ],
    B1: [
      { topic: 'المضارع التام', description: 'Present Perfect tense', exercises: 7 },
      { topic: 'الجمل الشرطية', description: 'First and Second Conditional', exercises: 7 },
      { topic: 'المبني للمجهول', description: 'Passive Voice', exercises: 7 },
      { topic: 'الأفعال المساعدة', description: 'Modal verbs: should, must, might', exercises: 7 }
    ],
    B2: [
      { topic: 'الشرط الثالث', description: 'Third Conditional', exercises: 8 },
      { topic: 'الجمل المعقدة', description: 'Complex sentences with clauses', exercises: 8 },
      { topic: 'التعبيرات الاصطلاحية', description: 'Idiomatic expressions', exercises: 8 },
      { topic: 'الأساليب المتقدمة', description: 'Advanced sentence structures', exercises: 8 }
    ]
  }
  return grammar[level] || grammar['A1']
}

const generateExercises = (level, day) => {
  const dayKey = `day${day}`;
  if (EXERCISES_DATABASE[level] && EXERCISES_DATABASE[level][dayKey]) {
    return EXERCISES_DATABASE[level][dayKey].map((ex, i) => ({
      id: `ex${day}-${i + 1}`,
      ...ex
    }));
  }
  return [];
}

const generateListeningQuestions = (level) => {
  return [
    { question: 'ما هو الموضوع الرئيسي للمحادثة؟', options: ['العمل', 'السفر', 'الطعام', 'الرياضة'], correctAnswer: 0 },
    { question: 'أين تدور الأحداث؟', options: ['المنزل', 'المكتب', 'المطعم', 'المطار'], correctAnswer: 1 },
    { question: 'ما هو شعور المتحدث؟', options: ['سعيد', 'حزين', 'قلق', 'متحمس'], correctAnswer: 3 }
  ]
}

const generateReadingText = (level, day) => {
  if (READING_TEXTS[level]) {
    const content = READING_TEXTS[level][day];
    if (typeof content === 'string') return content;
    if (content && content.text) return content.text;
  }
  return 'Text not available.';
}

const generateReadingQuestions = (level) => {
  return [
    { question: 'ما هي الفكرة الرئيسية للنص؟', type: 'multiple-choice', options: ['أ', 'ب', 'ج', 'د'], correctAnswer: 0 },
    { question: 'ماذا يقصد الكاتب بـ...؟', type: 'multiple-choice', options: ['أ', 'ب', 'ج', 'د'], correctAnswer: 2 },
    { question: 'استنتج من النص...', type: 'multiple-choice', options: ['أ', 'ب', 'ج', 'د'], correctAnswer: 1 }
  ]
}

const generateSpeakingPrompts = (level) => {
  const prompts = {
    A1: ['عرّف عن نفسك باللغة الإنجليزية', 'تحدث عن عائلتك', 'صف يومك المعتاد', 'ماذا تحب أن تأكل؟'],
    A2: ['تحدث عن هوايتك المفضلة', 'صف رحلة قمت بها', 'ما هو عملك أو دراستك؟', 'تحدث عن خططك للعطلة'],
    B1: ['ناقش أهمية التعليم', 'ما رأيك في التكنولوجيا الحديثة؟', 'تحدث عن تجربة غيرت حياتك', 'صف مشكلة وكيف حللتها'],
    B2: ['ناقش تأثير العولمة على الثقافة', 'ما هي التحديات التي تواجه المجتمع الحديث؟', 'قدم وجهة نظرك حول قضية بيئية', 'تحدث عن مستقبل الذكاء الاصطناعي']
  }
  return prompts[level] || prompts['A1']
}

const getSkillFocus = (day) => {
  const focuses = ['الاستماع', 'القراءة', 'التحدث', 'القواعد']
  return focuses[(day - 1) % 4]
}

export const AI_SCENARIOS = [
  { id: 'coffee', title: 'طلب قهوة في مقهى', icon: '☕', level: 'A1-A2', systemPrompt: 'أنت موظف في مقهى. ساعد المستخدم في طلب القهوة باللغة الإنجليزية.' },
  { id: 'job-interview', title: 'مقابلة عمل', icon: '💼', level: 'B1-B2', systemPrompt: 'أنت مسؤول توظيف. أجرِ مقابلة عمل مع المستخدم باللغة الإنجليزية.' },
  { id: 'airport', title: 'في المطار', icon: '✈️', level: 'A2-B1', systemPrompt: 'أنت موظف في مكتب تسجيل المطار. ساعد المستخدم في إجراءات السفر.' },
  { id: 'doctor', title: 'زيارة الطبيب', icon: '🏥', level: 'A2-B1', systemPrompt: 'أنت طبيب. استمع لشكوى المريض وقدم له النصيحة باللغة الإنجليزية.' },
  { id: 'shopping', title: 'التسوق', icon: '🛍️', level: 'A1-A2', systemPrompt: 'أنت بائع في متجر. ساعد المستخدم في اختيار وشراء المنتجات.' },
  { id: 'business', title: 'اجتماع عمل', icon: '📊', level: 'B2', systemPrompt: 'أنت شريك عمل. ناقش مشروعاً جديداً بطريقة احترافية.' },
  { id: 'hotel', title: 'حجز فندق', icon: '🏨', level: 'A2', systemPrompt: 'أنت موظف استقبال في فندق. ساعد المستخدم في الحجز.' },
  { id: 'restaurant', title: 'في مطعم', icon: '🍽️', level: 'A1-A2', systemPrompt: 'أنت نادل في مطعم. خذ طلب المستخدم وقدم اقتراحات.' }
]

export const generateLearningPath = () => {
  const path = []
  Object.keys(LEVELS).forEach((levelKey) => {
    const level = LEVELS[levelKey]
    level.days.forEach((dayNum) => {
      const dayData = {
        day: dayNum,
        level: levelKey,
        levelName: level.name,
        title: `اليوم ${dayNum}: ${getLessonTitle(dayNum, levelKey)}`,
        description: getLessonDescription(dayNum, levelKey),
        isLocked: dayNum > 1,
        videoUrl: `https://www.youtube.com/watch?v=example${dayNum}`,
        videoDuration: '25 دقيقة',
        vocabulary: generateVocabulary(levelKey, 10, dayNum),
        grammar: generateGrammarTopics(levelKey)[Math.floor((dayNum - 1) % 4)],
        exercises: generateExercises(levelKey, dayNum),
        listeningExercise: {
          title: 'تمرين استماع',
          audioUrl: `https://example.com/audio/day${dayNum}.mp3`,
          duration: '5 دقائق',
          questions: generateListeningQuestions(levelKey)
        },
        readingExercise: {
          title: 'تمرين قراءة',
          text: generateReadingText(levelKey, dayNum),
          questions: generateReadingQuestions(levelKey)
        },
        speakingPrompts: generateSpeakingPrompts(levelKey),
        estimatedTime: `${30 + dayNum}` + ' دقيقة',
        skillFocus: getSkillFocus(dayNum)
      }
      path.push(dayData)
    })
  })
  return path
}

export const FLASHCARD_DATA = generateLearningPath().flatMap(day =>
  day.vocabulary.map(vocab => ({
    id: `${day.day}-${vocab.word}`,
    word: vocab.word,
    translation: vocab.translation,
    example: vocab.example,
    level: day.level,
    day: day.day
  }))
)

export default { generateLearningPath, LEVELS, AI_SCENARIOS, FLASHCARD_DATA, READING_TEXTS, READING_STATS }