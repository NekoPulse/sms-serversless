const TelegramBot = require('node-telegram-bot-api');
const { telegramToken } = require('../config/env');
const { isAuthorizedUser } = require('../utils/auth');
const { sendSms } = require('../services/sms');
const { getSmsHistory } = require('../services/supabase');

// Crear instancia del bot
const bot = new TelegramBot(telegramToken, { polling: true });

// Comandos disponibles
const COMMANDS = {
  START: '/start',
  HELP: '/help',
  SEND_SMS: '/sms',
  HISTORY: '/history'
};

/**
 * Inicializa el bot y configura los manejadores de comandos
 */
function initBot() {
  // Comando /start
  bot.onText(/\/start/, handleStart);

  // Comando /help
  bot.onText(/\/help/, handleHelp);

  // Comando /sms
  bot.onText(/\/sms (.+)/, handleSendSms);

  // Comando /history
  bot.onText(/\/history/, handleHistory);

  // Manejar mensajes que no son comandos
  bot.on('message', handleMessage);

  console.log('Bot de Telegram iniciado correctamente');
}

/**
 * Maneja el comando /start
 * @param {Object} msg - Mensaje de Telegram
 */
async function handleStart(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const firstName = msg.from.first_name;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  const welcomeMessage = `¡Hola ${firstName}! 👋\n\n` +
    `Bienvenido al Bot de SMS. Puedes usar este bot para enviar mensajes SMS a números telefónicos.\n\n` +
    `Usa ${COMMANDS.HELP} para ver los comandos disponibles.`;

  await bot.sendMessage(chatId, welcomeMessage);
}

/**
 * Maneja el comando /help
 * @param {Object} msg - Mensaje de Telegram
 */
async function handleHelp(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  const helpMessage = `📋 *Comandos disponibles:*\n\n` +
    `${COMMANDS.START} - Inicia el bot\n` +
    `${COMMANDS.HELP} - Muestra esta ayuda\n` +
    `${COMMANDS.SEND_SMS} <número> <mensaje> - Envía un SMS\n` +
    `  Ejemplo: ${COMMANDS.SEND_SMS} +123456789 Hola, ¿cómo estás?\n` +
    `${COMMANDS.HISTORY} - Muestra tu historial de mensajes enviados`;

  await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
}

/**
 * Maneja el comando /sms para enviar mensajes SMS
 * @param {Object} msg - Mensaje de Telegram
 * @param {Array} match - Resultado de la expresión regular
 */
async function handleSendSms(msg, match) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  // Obtener el texto completo después del comando
  const text = match[1].trim();
  
  // Buscar el primer espacio para separar número y mensaje
  const firstSpaceIndex = text.indexOf(' ');
  
  if (firstSpaceIndex === -1) {
    return bot.sendMessage(
      chatId, 
      `⚠️ Formato incorrecto. Usa: ${COMMANDS.SEND_SMS} <número> <mensaje>\n` +
      `Ejemplo: ${COMMANDS.SEND_SMS} +123456789 Hola, ¿cómo estás?`
    );
  }

  // Separar número y mensaje
  const phoneNumber = text.substring(0, firstSpaceIndex).trim();
  const message = text.substring(firstSpaceIndex + 1).trim();

  if (!phoneNumber || !message) {
    return bot.sendMessage(
      chatId, 
      `⚠️ Debes proporcionar un número y un mensaje.\n` +
      `Ejemplo: ${COMMANDS.SEND_SMS} +123456789 Hola, ¿cómo estás?`
    );
  }

  // Enviar mensaje de procesamiento
  await bot.sendMessage(chatId, `🔄 Enviando SMS a ${phoneNumber}...`);

  try {
    // Enviar SMS
    const result = await sendSms({
      to: phoneNumber,
      message: message,
      userId: userId
    });

    if (result.success) {
      await bot.sendMessage(
        chatId, 
        `✅ SMS enviado correctamente a ${phoneNumber}\n` +
        `ID del mensaje: ${result.messageId}\n` +
        `Estado: ${result.status}`
      );
    } else {
      await bot.sendMessage(
        chatId, 
        `❌ Error al enviar SMS: ${result.error}`
      );
    }
  } catch (error) {
    console.error('Error en handleSendSms:', error);
    await bot.sendMessage(chatId, `❌ Error inesperado: ${error.message}`);
  }
}

/**
 * Maneja el comando /history para mostrar el historial de mensajes
 * @param {Object} msg - Mensaje de Telegram
 */
async function handleHistory(msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  await bot.sendMessage(chatId, '🔄 Obteniendo historial de mensajes...');

  try {
    const result = await getSmsHistory(userId);

    if (result.success && result.data.length > 0) {
      let historyMessage = '📋 *Historial de mensajes enviados:*\n\n';
      
      result.data.forEach((record, index) => {
        historyMessage += `*${index + 1}.* ${record.to_number} - ${record.status}\n` +
          `📝 ${record.message_content.substring(0, 30)}${record.message_content.length > 30 ? '...' : ''}\n` +
          `🕒 ${new Date(record.sent_at).toLocaleString()}\n\n`;
      });

      await bot.sendMessage(chatId, historyMessage, { parse_mode: 'Markdown' });
    } else if (result.success && result.data.length === 0) {
      await bot.sendMessage(chatId, '📭 No tienes mensajes enviados en tu historial.');
    } else {
      await bot.sendMessage(chatId, `❌ Error al obtener historial: ${result.error}`);
    }
  } catch (error) {
    console.error('Error en handleHistory:', error);
    await bot.sendMessage(chatId, `❌ Error inesperado: ${error.message}`);
  }
}

/**
 * Maneja mensajes que no son comandos
 * @param {Object} msg - Mensaje de Telegram
 */
async function handleMessage(msg) {
  // Ignorar comandos, ya que tienen sus propios manejadores
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  // Mensaje de ayuda para usuarios que no usan comandos
  await bot.sendMessage(
    chatId,
    `Para enviar un SMS, usa el comando ${COMMANDS.SEND_SMS} seguido del número y el mensaje.\n` +
    `Ejemplo: ${COMMANDS.SEND_SMS} +123456789 Hola, ¿cómo estás?\n\n` +
    `Usa ${COMMANDS.HELP} para ver todos los comandos disponibles.`
  );
}

module.exports = {
  initBot
};