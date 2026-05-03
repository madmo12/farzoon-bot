const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// ================== MENUS (KEYBOARDS) ==================

const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "📌 معلومات عن الفرز" }, { text: "👥 المسؤولين" }],
      [{ text: "📅 المواعيد" }, { text: "🎯 فرزاوي" }],
      [{ text: "ℹ️ عن البوت" }, { text: "❓ أسئلة أخرى" }]
    ],
    resize_keyboard: true
  }
};

const subMenus = {
  "📌 معلومات عن الفرز": {
    reply_markup: {
      keyboard: [
        [{ text: "📦 الفرز بيعمل ايه؟" }],
        [{ text: "👕 يعني ايه كساء؟" }, { text: "🛍️ المعارض يعني ايه؟" }],
        [{ text: "♻️ التالف بيعمل ايه؟" }],
        [{ text: "🔙 رجوع للقائمة الرئيسية" }]
      ],
      resize_keyboard: true
    }
  },
  "👥 المسؤولين": {
    reply_markup: {
      keyboard: [
        [{ text: "👤 مسؤول الفرز" }, { text: "📱 مسؤول الميديا" }],
        [{ text: "🏢 مسؤول الباك يارد" }, { text: "🤝 مسؤول HR" }],
        [{ text: "🏢 مسؤول المشاريع" }],
        [{ text: "🏢 مسؤول المخازن" }],
        [{ text: "🔙 رجوع للقائمة الرئيسية" }]
      ],
      resize_keyboard: true
    }
  },
  "📅 المواعيد": {
    reply_markup: {
      keyboard: [
        [{ text: "⏰ مواعيد الفرز" }, { text: "🤔 هل فيه فرزاوي؟" }],
        [{ text: "🔙 رجوع للقائمة الرئيسية" }]
      ],
      resize_keyboard: true
    }
  },
  "🎯 فرزاوي": {
    reply_markup: {
      keyboard: [
        [{ text: "🗓️ فرزاوي امتى؟" }, { text: "ℹ️ تفاصيل فرزاوي" }],
        [{ text: "🔙 رجوع للقائمة الرئيسية" }]
      ],
      resize_keyboard: true
    }
  },
  "ℹ️ عن البوت": {
    reply_markup: {
      keyboard: [
        [{ text: "🤖 انت مين؟" }, { text: "⚙️ بتعمل ايه؟" }],
        [{ text: "🔙 رجوع للقائمة الرئيسية" }]
      ],
      resize_keyboard: true
    }
  }
};

// ================== RESPONSES ==================
const responses = {
  // --- معلومات عن الفرز ---
  "📦 الفرز بيعمل ايه؟": "فكرة الفرز إن الهدوم بتيجي للفرع في شكاير، وبنفرزها ونصنفها لـ 3 أنواع (كساء، معارض، تالف) عشان كل حاجة تروح مكانها الصح وتفيد الناس بأفضل شكل ✌️.",
  "👕 يعني ايه كساء؟": "👕 **الكساء**:\nهي الهدوم اللي جودتها ممتازة وشبه الجديدة. بتتوزع **مجاناً** على الأسر المسجلة في الجمعية مرتين في السنة عشان تفرحهم في المناسبات.",
  "🛍️ المعارض يعني ايه؟": "🛍️ **المعارض**:\nهي الهدوم اللي حالتها كويسة بس اتلبست قبل كده أو محتاجة غسيل. بنعمل بيها معارض في القرى ونبيعها بأسعار رمزية (5 لـ 15 جنيه) عشان نحافظ على كرامة الأسر، وهم بيشتروا بفلوسهم.\n\n💡 العائد المادي بيروح لـ **الجمعية** داخل بند الملابس عشان نقدر نشتري ملابس جديدة للاسر.",
  "♻️ التالف بيعمل ايه؟": "♻️ **التالف**:\nهو الهدوم المقطعة أو اللي موضتها قديمة جداً ومينفعش تتلبس. دي بنبيعها بسعر رمزي لعمال بيستفيدوا من (الزراير والسوست) كمصدر رزق ليهم، والباقي بيروح مصانع يُعاد تدويره لخيوط.\n\n💡 العائد المادي بيدخل لـ **الجمعية**،تحت بند الملابس يعني مفيش حاجة عندنا بتترمي أبداً!",

  // --- المسؤولين ---
  "👤 مسؤول الفرز": "مسؤول **الفرز** هو: *معاذ*",
  "📱 مسؤول الميديا": "مسؤول **الميديا** هو: *علي*",
  "🏢 مسؤول الباك يارد": "مسؤول **الباك يارد** هي: *هاجر*",
  "🤝 مسؤول HR": "مسؤول الـ **HR** هي: *ايمان*\nونائب مسؤول الـ HR هي: *ريماس*",
  "🏢 مسؤول المشاريع": "مسؤول **المشاريع** هي: *أميرة *",
  "🏢 مسؤول المخازن": "مسؤول **المخازن** هو: *يس*",

  // --- المواعيد ---
  "⏰ مواعيد الفرز": "الفرز شغال كل يوم من الساعة 11 الصبح لـ 6 المغرب، **ماعدا يوم الجمعة**.\nمكان الفرز: الباك يارد.",
  "🤔 هل فيه فرزاوي؟": "حالياً فرزاوي هتقف شوية، وهترجع أقوى إن شاء الله بعد ما كل الفرزاوية يخلصوا امتحاناتهم 💪.",

  // --- فرزاوي ---
  "🗓️ فرزاوي امتى؟": "حالياً فرزاوي هتقف شوية، وهترجع أقوى إن شاء الله بعد ما كل الفرزاوية يخلصوا امتحاناتهم 💪.!",
  "ℹ️ تفاصيل فرزاوي": "مسؤول **فرزاوي** هو: *مروان*\nوفرزاوي ده الحدث الكبير بتاعنا اللي بنتجمع فيه كلنا يوم الجمعة عشان نفرز كميات كبيرة ونحقق إنجازات مع بعض في جو مليان حماس 🎉.",

  // --- عن البوت ---
  "🤖 انت مين؟": "أنا فرزون 🤖\nمساعدك الذكي وصاحبك اللي هنا عشان يجاوبك على كل حاجة تخص الفرز في جمعية رسالة.",
  "⚙️ بتعمل ايه؟": "دوري إني أوفر عليك وقت وسؤال، وأرد عليك بمعلومات دقيقة ومباشرة عن مواعيدنا، مسؤولين اللجان، وتفاصيل الفرز (الكساء والمعارض والتالف). اختار اللي تحب تعرفه من القائمة!"
};

// ================== STATE ==================
const userCooldown = {};
const adminState = {};
let customQuestions = {};

const adminPanelMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "➕ إضافة سؤال" }, { text: "❌ حذف سؤال" }],
      [{ text: "📋 عرض الأسئلة" }],
      [{ text: "🔙 خروج من اللوحة" }]
    ],
    resize_keyboard: true
  }
};

function updateCustomMenu() {
  const keys = Object.keys(customQuestions);
  const keyboard = keys.map(k => [{ text: k }]);
  keyboard.push([{ text: "🔙 رجوع للقائمة الرئيسية" }]);
  
  subMenus["❓ أسئلة أخرى"] = {
    reply_markup: {
      keyboard,
      resize_keyboard: true
    }
  };
}
updateCustomMenu();

// ================== COMMANDS ==================
bot.onText(/\/start/, (msg) => {
  const welcomeMessage = `أهلاً بيك في فرزون 🤖 اختار من القائمة اللي تحت 👇`;
  bot.sendMessage(msg.chat.id, welcomeMessage, mainMenu);
});

bot.onText(/\/panel/, (msg) => {
  const userId = msg.chat.id;
  adminState[userId] = { step: 'IDLE' };
  bot.sendMessage(userId, "مرحباً بيك في لوحة التحكم ⚙️", adminPanelMenu);
});

// ================== MAIN MESSAGE HANDLER ==================
bot.on('message', (msg) => {
  const userId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // تجاهل الأوامر لتجنب التداخل
  if (text.startsWith('/')) return;

  // ========= SPAM COOLDOWN =========
  const now = Date.now();
  if (userCooldown[userId] && now - userCooldown[userId] < 1000) { 
    return bot.sendMessage(userId, "استنى شوية يا بطل 🙏");
  }
  userCooldown[userId] = now;

  // ========= ADMIN FLOW =========
  if (adminState[userId]) {
    const state = adminState[userId].step;

    if (text === "🔙 خروج من اللوحة") {
      delete adminState[userId];
      return bot.sendMessage(userId, "رجعنا للقائمة الرئيسية 👇", mainMenu);
    }

    if (text === "➕ إضافة سؤال") {
      adminState[userId] = { step: 'AWAITING_QUESTION' };
      return bot.sendMessage(userId, "اكتب السؤال ✏️", { reply_markup: { remove_keyboard: true } });
    }

    if (text === "❌ حذف سؤال") {
      const keys = Object.keys(customQuestions);
      if (keys.length === 0) {
        return bot.sendMessage(userId, "مفيش أسئلة مضافة حالياً 🤷‍♂️", adminPanelMenu);
      }
      adminState[userId] = { step: 'AWAITING_DELETE' };
      const keyboard = keys.map(k => [{ text: k }]);
      keyboard.push([{ text: "🔙 خروج من اللوحة" }]);
      return bot.sendMessage(userId, "اختار السؤال اللي عايز تحذفه 👇", {
        reply_markup: { keyboard, resize_keyboard: true }
      });
    }

    if (text === "📋 عرض الأسئلة") {
      const keys = Object.keys(customQuestions);
      if (keys.length === 0) {
        return bot.sendMessage(userId, "مفيش أسئلة مضافة حالياً 🤷‍♂️", adminPanelMenu);
      }
      let msgText = "📋 *الأسئلة الحالية:*\n\n";
      keys.forEach((k, i) => {
        msgText += `${i + 1}. *${k}*\n${customQuestions[k]}\n\n`;
      });
      return bot.sendMessage(userId, msgText, { parse_mode: "Markdown" });
    }

    if (state === 'AWAITING_QUESTION') {
      adminState[userId] = { step: 'AWAITING_ANSWER', tempQuestion: text };
      return bot.sendMessage(userId, "اكتب الإجابة ✏️");
    }

    if (state === 'AWAITING_ANSWER') {
      const q = adminState[userId].tempQuestion;
      customQuestions[q] = text;
      adminState[userId] = { step: 'IDLE' };
      updateCustomMenu();
      return bot.sendMessage(userId, "تمت الإضافة ✅", adminPanelMenu);
    }

    if (state === 'AWAITING_DELETE') {
      if (customQuestions[text]) {
        delete customQuestions[text];
        adminState[userId] = { step: 'IDLE' };
        updateCustomMenu();
        return bot.sendMessage(userId, "تم الحذف ❌", adminPanelMenu);
      } else {
        return bot.sendMessage(userId, "السؤال ده مش موجود، اختار من القائمة 👇");
      }
    }
    
    return bot.sendMessage(userId, "اختار من القائمة 👇", adminPanelMenu);
  }

  // ========= MENU NAVIGATION =========
  
  // 1. هل المستخدم اختار تصنيف رئيسي لفتح قائمة فرعية؟
  if (subMenus[text]) {
    return bot.sendMessage(userId, "اختار من القائمة 👇", subMenus[text]);
  }

  // 2. هل المستخدم ضغط على رجوع؟
  if (text === "🔙 رجوع للقائمة الرئيسية") {
    return bot.sendMessage(userId, "رجعنا للقائمة الرئيسية 👇", mainMenu);
  }

  // 3. هل المستخدم ضغط على زر ليه إجابة متسجلة؟
  if (responses[text]) {
    return bot.sendMessage(userId, responses[text], { parse_mode: "Markdown" });
  }

  if (customQuestions[text]) {
    return bot.sendMessage(userId, customQuestions[text], { parse_mode: "Markdown" });
  }

  // 4. في حالة كتابة نص حر أو اختيار مش موجود
  return bot.sendMessage(userId, "اختار من القائمة 👇", mainMenu);
});

bot.on("polling_error", console.log);