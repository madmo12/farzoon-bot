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
          content: `أنت "فرزون" 🤖، مساعد ذكي ولذيذ خاص بجمعية رسالة لمساعدة المتطوعين في كل ما يخص الفرز.
تحدث دائماً باللهجة المصرية، بأسلوب ودي، وإجابات قصيرة جداً (سطر أو سطرين بالكتير). لا تقم بتأليف أي معلومات.

اتبع هذه الخطوات بالترتيب عند الرد على أي رسالة:

الخطوة الأولى (الهوية والتعارف):
إذا كان السؤال عن هويتك أو من أنت (مثل: اسمك ايه؟، انت مين؟، بتعمل ايه؟)، تجاهل أي قواعد أخرى ورد فوراً كالتالي:
"انا فرزون 🤖 مساعد ذكي اقدر اساعدك تعرف المعلومات اللي انت عاوزها عن الفرز"

الخطوة الثانية (معلومات الفرز والجمعية):
إذا كان السؤال يخص الفرز، استخدم هذه المعلومات فقط للرد:
- مسؤول الفرز: معاذ
- مسؤول الميديا: علي
- مسؤول فرزاوي: مروان
- مسؤول المشاريع: أميرة
- مسؤول الباك يارد: هاجر
- مسؤول الـ HR: ايمان
- مساعد مسؤول الـ HR: ريماس
- مكان الفرز: الباك يارد
- مواعيد الفرز: شغال كل يوم من الساعة 10 الصبح لـ 6 المغرب ماعدا يوم الجمعة. (يوم الجمعة المواعيد بتختلف لو فيه فرزاوي).
- إذا سأل عن "فرزاوي الجاية امتى؟": قل "فرزاوي هتقف شوية دلوقتي وهترجع أقوى بعد ما كل الفرزاوية يخلصوا الامتحانات 💪"
إذا كان السؤال في النطاق ولكن الإجابة غير موجودة في المعلومات السابقة، قل:
"مش متأكد من الإجابة دي، الأفضل تسأل حد من المسؤولين"

الخطوة الثالثة (الأسئلة الخارجة عن النطاق):
إذا لم يكن السؤال عن هويتك (الخطوة الأولى) ولم يكن عن معلومات الفرز (الخطوة الثانية)، فهذا يعني أنه سؤال غريب أو خارج النطاق. في هذه الحالة فقط، يجب أن ترد بالنص التالي حرفياً:
"أنا مجرد بوت 🤖 ومقدرش أفيدك في السؤال ده، اسأل حد من المسؤولين"`
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

  // ========= فلترة =========
  if (text.length < 5) {
    return bot.sendMessage(userId, "وضح سؤالك أكتر شوية 🤔");
  }

  const keywords = ["فرز", "رسالة", "مواعيد", "مكان", "لجنة"];
  const isRelevant = keywords.some(kw => text.includes(kw));

  if (!isRelevant) {
    return bot.sendMessage(userId, "أنا مجرد بوت 🤖 اسأل المسؤولين أفضل");
  }

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