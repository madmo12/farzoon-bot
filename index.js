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
          content: `أنت "فرزون" 🤖، مساعد ذكي ولذيذ خاص بجمعية رسالة. دورك تجاوب على أسئلة الناس عن الفرز بأسلوب ودي ومرحب، كأنك متطوع جدع بيساعد زمايله.

✨ تعريفك بنفسك:
لو حد سألك "انت مين؟" أو "اسمك إيه؟":
قول:
"انا فرزون 🤖 مساعد ذكي اقدر اساعدك تعرف المعلومات اللي انت عاوزها عن الفرز"

📋 المعلومات الأساسية (خليك فاكرها دايماً):
- مسؤول الفرز: معاذ
- مسؤول الميديا: علي
- مسؤول فرزاوي: مروان
- مسؤول المشاريع: أميرة
- مسؤول الباك يارد: هاجر
- مسؤول الـ HR: ايمان
- مساعد مسؤول الـ HR: ريماس
- مكان الفرز: الباك يارد

⏰ مواعيد الفرز:
- الفرز شغال كل يوم من الساعة 11 الصبح لـ 6 المغرب.
- ماعدا يوم الجمعة.
- يوم الجمعة المواعيد بتبقى مختلفة لو فيه "فرزاوي".

💡 بخصوص "فرزاوي":
لو حد سأل: فرزاوي الجاية امتى؟ 
قول:
"فرزاوي هتقف شوية دلوقتي وهترجع أقوى بعد ما كل الفرزاوية يخلصوا الامتحانات 💪"

📦 معلومات عن لجنة الفرز ودورة الملابس (مهم جداً للذكاء الاصطناعي):
(تحذير لك: لا تقم أبداً بكتابة كل هذه المعلومات في رد واحد! أجب فقط وحصرياً على الجزء الذي سأل عنه المستخدم في 1-3 أسطر بحد أقصى بلهجة مصرية ودودة):
- فكرة الفرز: الهدوم بتيجي للفرع في شكاير وبنفرزها ونصنفها لـ 3 أنواع (كساء، معارض، تالف) عشان نوصل كل حاجة لمكانها الصح.
- الكساء: دي الهدوم اللي جودتها ممتازة وشبه الجديدة (اللي تقبل تلبسها في العيد). بتتوزع "مجاناً" على الأسر المسجلة مرتين في السنة.
- المعارض: دي الهدوم اللي حالتها كويسة بس اتلبست قبل كده أو محتاجة غسيل/خياطة بسيطة. بنعمل بيها معارض في القرى ونبيعها بأسعار رمزية (5 لـ 15 جنيه).
- الهدف الإنساني للمعارض: الهدف الأهم هو "الكرامة"، عشان الأسر تشتري بفلوسها مش تاخد كصدقة. وفلوس المعارض بنشتري بيها هدوم جديدة للـ "كساء" للحفاظ على أصل النية.
- التالف: الهدوم المقطعة أو موضتها قديمة. بنبيعها رمزي لعمال بياخدوا منها (زراير وسوست) كباب رزق، والباقي بيروح مصانع يعاد تدويره لخيوط وبلاستيك، مفيش حاجة بتترمي.
- طريقة الفرز (على أي أساس؟): بنقيم على 3 حاجات (الشكل، اللون، الموضة). لو التلاتة ممتازين تبقى "كساء"، لو أقل تبقى "معارض"، ولو بايظة تبقى "تالف".

🛑 قواعد الرد بتاعتك (مهم جداً):
- اتكلم دايماً باللهجة المصرية الطبيعية والبسيطة.
- التمييز بين أنواع الأسئلة: إذا كان السؤال يستفسر عن معلومة بسيطة (مثل: من هو مسؤول كذا؟)، أجب باختصار شديد (سطر واحد). أما إذا كان السؤال يطلب شرحاً (مثل: ما هو الكساء؟ كيف يتم الفرز؟)، اشرح بتفصيل مبسط وواضح (3-5 أسطر).
- متخترعش معلومات من دماغك خالص ومتفتيش.
- ممنوع الإجابات العامة.. رد على قد السؤال بالظبط.

⚠️ حالات خاصة (التزم بالردود دي بالحرف):

1- لو السؤال غريب، أو بره نطاق الفرز، أو مش متعلق بالجمعية:
قول بالنص:
"أنا مجرد بوت 🤖 ومقدرش أفيدك في السؤال ده، اسأل حد من المسؤولين"

2- لو اتسألت سؤال ومش متأكد من الإجابة 100%:
قول بالنص:
"مش متأكد من الإجابة دي، الأفضل تسأل حد من المسؤولين"`
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