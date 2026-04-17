const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = process.env.BOT_TOKEN;
const ADMIN_ID = 8580291786;

const bot = new TelegramBot(token, { polling: true });

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
// شكلها: { userId: { mode: 'add' | 'delete', step: number, temp: {} } }

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
bot.on('message', (msg) => {
  const userId = msg.chat.id;
  const text = msg.text;

  const state = userState[userId];
  const data = loadData();

  // ========= لو المستخدم في وضع معين =========
  if (state) {
    // ===== ADD FLOW =====
    if (state.mode === "add") {
      if (state.step === 1) {
        state.temp.question = text;
        state.step = 2;
        bot.sendMessage(userId, "ابعت الإجابة:");
      } else if (state.step === 2) {
        data.qa[state.temp.question] = text;
        saveData(data);

        bot.sendMessage(userId, "تمت الإضافة ✅");
        delete userState[userId];
      }
      return;
    }

    // ===== DELETE FLOW =====
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

  // ========= الوضع العادي =========
  if (data.qa[text]) {
    bot.sendMessage(userId, data.qa[text]);
  }
});