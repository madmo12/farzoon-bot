const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.BOT_TOKEN;
const ADMIN_ID = 8580291786;

const bot = new TelegramBot(token, { polling: true });

// ================== DATA ==================
function loadData() {
  if (!fs.existsSync('data.json')) {
    saveData({ users: [], qa: {} });
  }
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

// ================== MENUS (KEYBOARDS) ==================

const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "📌 معلومات عن الفرز" }, { text: "👥 المسؤولين" }],
      [{ text: "📅 المواعيد" }, { text: "🎯 فرزاوي" }],
      [{ text: "ℹ️ عن البوت" }]
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
  "🛍️ المعارض يعني ايه؟": "🛍️ **المعارض**:\nهي الهدوم اللي حالتها كويسة بس اتلبست قبل كده أو محتاجة غسيل. بنعمل بيها معارض في القرى ونبيعها بأسعار رمزية (5 لـ 15 جنيه) عشان نحافظ على كرامة الأسر، وهم بيشتروا بفلوسهم.\n\n💡 العائد المادي بيروح لـ **الجمعية** عشان تدعم أنشطة الخير في رسالة.",
  "♻️ التالف بيعمل ايه؟": "♻️ **التالف**:\nهو الهدوم المقطعة أو اللي موضتها قديمة جداً ومينفعش تتلبس. دي بنبيعها بسعر رمزي لعمال بيستفيدوا من (الزراير والسوست) كمصدر رزق ليهم، والباقي بيروح مصانع يُعاد تدويره لخيوط.\n\n💡 العائد المادي بيدخل لـ **الجمعية**، يعني مفيش حاجة عندنا بتترمي أبداً!",

  // --- المسؤولين ---
  "👤 مسؤول الفرز": "مسؤول **الفرز** هو: *معاذ*",
  "📱 مسؤول الميديا": "مسؤول **الميديا** هو: *علي*",
  "🏢 مسؤول الباك يارد": "مسؤول **الباك يارد** هي: *هاجر*",
  "🤝 مسؤول HR": "مسؤول الـ **HR** هي: *ايمان*\nونائب مسؤول الـ HR هي: *ريماس*",
  "🏢 مسؤول الشماريع": "مسؤول **المشاريع** هي: *أميرة*",

  // --- المواعيد ---
  "⏰ مواعيد الفرز": "الفرز شغال كل يوم من الساعة 11 الصبح لـ 6 المغرب، **ماعدا يوم الجمعة**.\nمكان الفرز: الباك يارد.",
  "🤔 هل فيه فرزاوي؟": "حالياً فرزاوي هتقف شوية، وهترجع أقوى إن شاء الله بعد ما كل الفرزاوية يخلصوا امتحاناتهم 💪.",

  // --- فرزاوي ---
  "🗓️ فرزاوي امتى؟": "زي ما وضحتلك، فرزاوي متوقفة حالياً عشان فترة الامتحانات 📚. أول ما ترجع هنبلغكم أكيد!",
  "ℹ️ تفاصيل فرزاوي": "مسؤول **فرزاوي** هو: *مروان*\nوفرزاوي ده الحدث الكبير بتاعنا اللي بنتجمع فيه كلنا يوم الجمعة عشان نفرز كميات كبيرة ونحقق إنجازات مع بعض في جو مليان حماس 🎉.",

  // --- عن البوت ---
  "🤖 انت مين؟": "أنا فرزون 🤖\nمساعدك الذكي وصاحبك اللي هنا عشان يجاوبك على كل حاجة تخص الفرز في جمعية رسالة.",
  "⚙️ بتعمل ايه؟": "دوري إني أوفر عليك وقت وسؤال، وأرد عليك بمعلومات دقيقة ومباشرة عن مواعيدنا، مسؤولين اللجان، وتفاصيل الفرز (الكساء والمعارض والتالف). اختار اللي تحب تعرفه من القائمة!"
};

// ================== STATE ==================
const userState = {};
const userCooldown = {};

// ================== ADMIN COMMANDS ==================
bot.onText(/\/start/, (msg) => {
  registerUser(msg.chat.id);
  const welcomeMessage = `أهلاً بيك يا فرزاوي في بوت الفرز الخاص بجمعية رسالة! 👋🤖\n\nأنا هنا عشان أساعدك وتعرف أي حاجة تخص لجنة الفرز وتفاصيلها. تقدر تختار من القائمة اللي تحت عشان تعرف إجاباتي 👇`;
  bot.sendMessage(msg.chat.id, welcomeMessage, mainMenu);
});

bot.onText(/\/panel/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  bot.sendMessage(msg.chat.id, "لوحة التحكم للمسؤولين 👇", {
    reply_markup: {
      keyboard: [[{ text: "/add" }, { text: "/delete" }], [{ text: "/cancel" }]],
      resize_keyboard: true
    }
  });
});

bot.onText(/\/cancel/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  delete userState[msg.chat.id];
  bot.sendMessage(msg.chat.id, "تم إلغاء العملية ورجوعك للقائمة الرئيسية.", mainMenu);
});

bot.onText(/\/add/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  userState[msg.chat.id] = { mode: "add", step: 1, temp: {} };
  bot.sendMessage(msg.chat.id, "ابعت السؤال اللي عاوز تضيفه (أو اكتب /cancel للإلغاء):", { reply_markup: { remove_keyboard: true }});
});

bot.onText(/\/delete/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  const data = loadData();
  const keyboard = Object.keys(data.qa).map(q => [q]);
  keyboard.push(["/cancel"]);
  userState[msg.chat.id] = { mode: "delete" };
  bot.sendMessage(msg.chat.id, "اختار السؤال اللي عاوز تمسحه:", {
    reply_markup: { keyboard, resize_keyboard: true }
  });
});

// ================== MAIN MESSAGE HANDLER ==================
bot.on('message', (msg) => {
  const userId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // تجاهل الأوامر لتجنب التداخل
  if (text.startsWith('/')) return;

  const state = userState[userId];
  const data = loadData();

  // ========= ADMIN STATE HANDLING (ADD / DELETE) =========
  if (state && userId === ADMIN_ID) {
    if (state.mode === "add") {
      if (state.step === 1) {
        state.temp.question = text;
        state.step = 2;
        bot.sendMessage(userId, "عاش! ابعت الإجابة بقى:");
      } else {
        data.qa[state.temp.question] = text;
        saveData(data);
        bot.sendMessage(userId, "تمت الإضافة بنجاح ✅", mainMenu);
        delete userState[userId];
      }
      return;
    }

    if (state.mode === "delete") {
      if (data.qa[text]) {
        delete data.qa[text];
        saveData(data);
        bot.sendMessage(userId, "تم الحذف بنجاح ❌", mainMenu);
      } else {
        bot.sendMessage(userId, "السؤال ده مش موجود أصلاً 🤔");
      }
      delete userState[userId];
      return;
    }
  }

  // ========= SPAM COOLDOWN =========
  const now = Date.now();
  if (userCooldown[userId] && now - userCooldown[userId] < 1000) { 
    return bot.sendMessage(userId, "استنى شوية يا بطل 🙏");
  }
  userCooldown[userId] = now;

  // ========= MENU NAVIGATION =========
  
  // 1. هل المستخدم اختار تصنيف رئيسي لفتح قائمة فرعية؟
  if (subMenus[text]) {
    return bot.sendMessage(userId, "اختر من القائمة 👇", subMenus[text]);
  }

  // 2. هل المستخدم ضغط على رجوع؟
  if (text === "🔙 رجوع للقائمة الرئيسية") {
    return bot.sendMessage(userId, "رجعنا للقائمة الرئيسية 👇", mainMenu);
  }

  // 3. هل المستخدم ضغط على زر ليه إجابة متسجلة؟
  if (responses[text]) {
    return bot.sendMessage(userId, responses[text], { parse_mode: "Markdown" });
  }

  // 4. هل المستخدم ضغط على زر متسجل في الداتا المضافة من الإدمن؟
  if (data.qa[text]) {
    return bot.sendMessage(userId, data.qa[text], { parse_mode: "Markdown" });
  }

  // 5. في حالة كتابة نص حر أو اختيار مش موجود
  return bot.sendMessage(userId, "من فضلك اختار من القائمة 👇", mainMenu);
});

bot.on("polling_error", console.log);