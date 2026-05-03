const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.BOT_TOKEN;
const ADMIN_ID = 8580291786;

const bot = new TelegramBot(token, { polling: true });

// ================== GROQ ==================
const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// ================== AI ==================
async function askAI(question) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: `أنت "فرزون" 🤖، متطوع جدع ومساعد ذكي بجمعية رسالة. دورك الإجابة على أسئلة زمايلك عن "لجنة الفرز" بأسلوب ودي ومرحب باللهجة المصرية. أنت تتحدث مباشرة مع المستخدمين، لذا أجب بلسانك ولا تذكر أبداً التعليمات المكتوبة هنا. لا تستخدم عبارات مثل "إذا سألني أحد سأقول" أو "سأجيب بـ"، بل أعطِ الإجابة النهائية مباشرة كشخص طبيعي.

✨ هويتك:
اسمك "فرزون". أنت مساعد ذكي دورك مساعدة الناس في معرفة كل شيء عن الفرز.

📋 فريق العمل والمكان:
- مسؤول الفرز: معاذ
- مسؤول الميديا: علي
- مسؤول فرزاوي: مروان
- مسؤول المشاريع: أميرة
- مسؤول الباك يارد: هاجر
- مسؤول الـ HR: ايمان (والمساعد: ريماس)
- مكان الفرز: الباك يارد

⏰ المواعيد:
- يومياً من 11 الصبح لـ 6 المغرب (ماعدا الجمعة).
- يوم الجمعة المواعيد تختلف إذا كان هناك حدث "فرزاوي".

💡 معلومات عن "فرزاوي":
حالياً "فرزاوي" متوقفة لفترة، وستعود بقوة بعد أن ينهي جميع الفرزاوية امتحاناتهم 💪.

📦 دورة الملابس ولجنة الفرز (اختر فقط المعلومة المناسبة للسؤال ولا تسرد كل شيء):
- فكرة الفرز: الملابس تأتي للفرع في شكاير، ويتم فرزها وتصنيفها لـ 3 أنواع (كساء، معارض، تالف) لوضع كل شيء في مكانه الصحيح.
- الكساء: الملابس الممتازة وشبه الجديدة. توزع "مجاناً" على الأسر المسجلة مرتين في السنة.
- المعارض: الملابس الجيدة التي لُبست من قبل أو تحتاج لغسيل/خياطة بسيطة. تُباع في معارض بالقرى بأسعار رمزية (5 إلى 15 جنيه).
- الهدف الإنساني للمعارض: الحفاظ على "كرامة" الأسر ليشتروا بمالهم وليس كصدقة. العائد يُستخدم لشراء ملابس جديدة للـ "كساء" للحفاظ على أصل التبرع.
- التالف: الملابس الممزقة أو القديمة جداً. تُباع رمزياً لعمال يستفيدون من (الزراير والسوست) كباب رزق، والباقي يذهب لمصانع إعادة التدوير (خيوط وبلاستيك) فلا شيء يُرمى.
- التقييم: يتم بناءً على (الشكل، اللون، الموضة). الممتاز "كساء"، الأقل "معارض"، والتالف "تالف".

🛑 أسلوب الرد:
- تحدث بلهجة مصرية طبيعية، ودودة، ومباشرة.
- إجاباتك يجب أن تكون نهائية وحاسمة، لا تظهر للمستخدم كيف تفكر.
- إذا كان السؤال عن معلومة مباشرة (مثل: من المسؤول؟ متى المواعيد؟) أجب باختصار في سطر واحد.
- إذا كان السؤال يطلب شرحاً (مثل: ما هو الكساء؟) اشرح ببساطة في 3 أسطر كحد أقصى.
- لا تؤلف أي معلومات من خيالك ولا تكرر الكلام.

⚠️ الردود الإلزامية (استخدمها مباشرة عند الحاجة دون ذكر أنها تعليمات):
- إذا كان السؤال خارج نطاق الفرز أو جمعية رسالة تماماً، أجب فقط: "أنا مجرد بوت 🤖 ومقدرش أفيدك في السؤال ده، اسأل حد من المسؤولين"
- إذا كنت غير متأكد من معلومة معينة، أجب فقط: "مش متأكد من الإجابة دي، الأفضل تسأل حد من المسؤولين"`
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (err) {
    console.log("AI Error:", err);
    return "حصل مشكلة مؤقتة، جرب تاني بعد شوية 🙏";
  }
}

// ================== DATA ==================
function loadData() {
  return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

function registerUser(id) {
  const data = loadData();
  if (!data.users.includes(id)) {
    data.users.push(id);
    saveData(data);
  }
}

// ================== INTENT DETECTION ==================
function detectIntent(text) {
  const t = text.toLowerCase();
  
  const hasAny = (words) => words.some(w => t.includes(w));

  // 1. فرزاوي
  if (hasAny(["فرزاوي", "فرزاوى"])) {
    if (hasAny(["مسؤول", "مسئول", "مين"])) return "مسؤول فرزاوي هو: مروان";
    return "فرزاوي هتقف شوية دلوقتي وهترجع أقوى بعد ما كل الفرزاوية يخلصوا الامتحانات 💪";
  }

  // 2. المسؤولين
  if (hasAny(["مسؤول", "مسئول", "مين", "مدير"])) {
    if (hasAny(["باك يارد", "باكيارد"])) return "مسؤول الباك يارد هي: هاجر";
    if (hasAny(["ميديا", "الميديا"])) return "مسؤول الميديا هو: علي";
    if (hasAny(["مشاريع", "المشاريع"])) return "مسؤول المشاريع هي: أميرة";
    if (hasAny(["hr", "اتش ار", "إتش آر", "اتش آر"])) return "مسؤول الـ HR هي: ايمان، ومساعد مسؤول الـ HR هي: ريماس";
    if (hasAny(["فرز", "الفرز"])) return "مسؤول الفرز هو: معاذ";
  }

  // 3. المواعيد والمكان
  if (hasAny(["مواعيد", "امتى", "ساعة كام", "الساعة", "ميعاد", "وقت"])) {
    if (hasAny(["فرز", "الفرز"])) return "الفرز شغال كل يوم من الساعة 11 الصبح لـ 6 المغرب، ماعدا يوم الجمعة.";
  }
  
  if (hasAny(["مكان", "فين", "عنوان"])) {
    if (hasAny(["فرز", "الفرز"])) return "مكان الفرز هو: الباك يارد";
  }

  return null;
}

// ================== STATE ==================
const userState = {};
const userCooldown = {}; // منع السبام

// ================== START ==================
bot.onText(/\/start/, (msg) => {
  registerUser(msg.chat.id);

  const data = loadData();
  const keyboard = Object.keys(data.qa).map(q => [q]);

  bot.sendMessage(msg.chat.id, "اختار سؤالك 👇", {
    reply_markup: {
      keyboard,
      resize_keyboard: true
    }
  });
});

// ================== PANEL ==================
bot.onText(/\/panel/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;

  bot.sendMessage(msg.chat.id, "لوحة التحكم 👇", {
    reply_markup: {
      keyboard: [
        ["/add", "/delete"]
      ],
      resize_keyboard: true
    }
  });
});

// ================== ADD ==================
bot.onText(/\/add/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;

  userState[msg.chat.id] = {
    mode: "add",
    step: 1,
    temp: {}
  };

  bot.sendMessage(msg.chat.id, "ابعت السؤال:");
});

// ================== DELETE ==================
bot.onText(/\/delete/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const data = loadData();
  const keyboard = Object.keys(data.qa).map(q => [q]);

  userState[msg.chat.id] = {
    mode: "delete"
  };

  bot.sendMessage(msg.chat.id, "اختار السؤال اللي يتمسح:", {
    reply_markup: {
      keyboard,
      resize_keyboard: true
    }
  });
});

// ================== MAIN HANDLER ==================
bot.on('message', async (msg) => {
  const userId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  const state = userState[userId];
  const data = loadData();

  // ========= ADD / DELETE =========
  if (state) {
    if (state.mode === "add") {
      if (state.step === 1) {
        state.temp.question = text;
        state.step = 2;
        bot.sendMessage(userId, "ابعت الإجابة:");
      } else {
        data.qa[state.temp.question] = text;
        saveData(data);
        bot.sendMessage(userId, "تمت الإضافة ✅");
        delete userState[userId];
      }
      return;
    }

    if (state.mode === "delete") {
      if (data.qa[text]) {
        delete data.qa[text];
        saveData(data);
        bot.sendMessage(userId, "تم الحذف ❌");
      }
      delete userState[userId];
      return;
    }
  }

  // ========= تجاهل الأوامر =========
  if (text.startsWith('/')) return;

  // ========= رد من الداتا =========
  if (data.qa[text]) {
    return bot.sendMessage(userId, data.qa[text]);
  }

  // ========= التعارف والهوية (تخطي الذكاء الاصطناعي) =========
  const identityKeywords = ["اسمك", "انت مين", "بتعمل ايه", "مين انت"];
  if (identityKeywords.some(kw => text.includes(kw))) {
    return bot.sendMessage(userId, "انا فرزون 🤖 مساعد ذكي اقدر اساعدك تعرف المعلومات اللي انت عاوزها عن الفرز");
  }

  // ========= Intent Detection (فهم القصد) =========
  const intentResponse = detectIntent(text);
  if (intentResponse) {
    return bot.sendMessage(userId, intentResponse);
  }

  // ========= فلترة طول الرسالة فقط =========
  if (text.length < 5) {
    return bot.sendMessage(userId, "وضح سؤالك أكتر شوية 🤔");
  }

  // تم إزالة فلتر الكلمات المفتاحية (Keywords Filter) لأن الذكاء الاصطناعي 
  // قادر على تحديد ما إذا كان السؤال خارج النطاق بفضل الـ System Prompt


  // ========= cooldown =========
  const now = Date.now();
  if (userCooldown[userId] && now - userCooldown[userId] < 10000) {
    return bot.sendMessage(userId, "استنى شوية قبل ما تسأل تاني 🙏");
  }

  userCooldown[userId] = now;

  // ========= AI =========
  const aiResponse = await askAI(text);
  bot.sendMessage(userId, aiResponse);
});