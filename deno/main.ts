import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import TelegramBot from "npm:node-telegram-bot-api@0.64.0";

// Importar controladores y servicios
import { sendSms } from "../src/services/sms.js";
import { getSmsHistory } from "../src/services/supabase.js";
import { isAuthorizedUser } from "../src/utils/auth.js";

// Variables de entorno
const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY");
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

// Verificar configuración
function checkConfiguration() {
  const missingVars = [];
  
  if (!telegramToken) missingVars.push('TELEGRAM_BOT_TOKEN');
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseKey) missingVars.push('SUPABASE_KEY');
  if (!twilioAccountSid) missingVars.push('TWILIO_ACCOUNT_SID');
  if (!twilioAuthToken) missingVars.push('TWILIO_AUTH_TOKEN');
  if (!twilioPhoneNumber) missingVars.push('TWILIO_PHONE_NUMBER');
  
  if (missingVars.length > 0) {
    console.error('Error: Faltan las siguientes variables de entorno:');
    missingVars.forEach(variable => console.error(`- ${variable}`));
    return false;
  }
  
  return true;
}

// Comandos disponibles
const COMMANDS = {
  START: '/start',
  HELP: '/help',
  SEND_SMS: '/sms',
  HISTORY: '/history'
};

// Crear instancia del bot
const bot = new TelegramBot(telegramToken || "");

// Configurar webhook
const WEBHOOK_PATH = `/${telegramToken}`;

/**
 * Maneja el comando /start
 */
async function handleStart(msg: any) {
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
 */
async function handleHelp(msg: any) {
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
 */
async function handleSendSms(msg: any) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  // Obtener el texto completo después del comando
  const text = msg.text.replace(/\/sms\s+/, '').trim();
  
  // Buscar el primer espacio para separar número y mensaje
  const firstSpaceIndex = text.indexOf(' ');
  
  if (firstSpaceIndex === -1) {
    return bot.sendMessage(chatId, '❌ Formato incorrecto. Usa: /sms <número> <mensaje>');
  }
  
  const phoneNumber = text.substring(0, firstSpaceIndex).trim();
  const message = text.substring(firstSpaceIndex + 1).trim();
  
  if (!phoneNumber || !message) {
    return bot.sendMessage(chatId, '❌ Formato incorrecto. Usa: /sms <número> <mensaje>');
  }
  
  // Enviar mensaje de espera
  const waitingMsg = await bot.sendMessage(chatId, '⏳ Enviando SMS...');
  
  try {
    // Enviar SMS
    const result = await sendSms(phoneNumber, message, userId);
    
    if (result.success) {
      await bot.editMessageText('✅ SMS enviado correctamente', {
        chat_id: chatId,
        message_id: waitingMsg.message_id
      });
    } else {
      await bot.editMessageText(`❌ Error al enviar SMS: ${result.error}`, {
        chat_id: chatId,
        message_id: waitingMsg.message_id
      });
    }
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    await bot.editMessageText(`❌ Error al enviar SMS: ${error.message || 'Error desconocido'}`, {
      chat_id: chatId,
      message_id: waitingMsg.message_id
    });
  }
}

/**
 * Maneja el comando /history
 */
async function handleHistory(msg: any) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorizedUser(userId)) {
    return bot.sendMessage(chatId, '⛔ No estás autorizado para usar este bot.');
  }

  // Enviar mensaje de espera
  const waitingMsg = await bot.sendMessage(chatId, '⏳ Obteniendo historial...');
  
  try {
    // Obtener historial
    const history = await getSmsHistory(userId);
    
    if (history.length === 0) {
      await bot.editMessageText('📭 No hay mensajes en tu historial', {
        chat_id: chatId,
        message_id: waitingMsg.message_id
      });
      return;
    }
    
    // Formatear historial
    let historyMessage = '📋 *Historial de mensajes enviados:*\n\n';
    
    history.forEach((sms, index) => {
      historyMessage += `*${index + 1}.* ${sms.to_number}\n`;
      historyMessage += `📝 ${sms.message_content}\n`;
      historyMessage += `📅 ${new Date(sms.sent_at).toLocaleString()}\n`;
      historyMessage += `📊 Estado: ${sms.status}\n\n`;
    });
    
    await bot.editMessageText(historyMessage, {
      chat_id: chatId,
      message_id: waitingMsg.message_id,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    await bot.editMessageText(`❌ Error al obtener historial: ${error.message || 'Error desconocido'}`, {
      chat_id: chatId,
      message_id: waitingMsg.message_id
    });
  }
}

/**
 * Procesa los mensajes entrantes y ejecuta los comandos correspondientes
 */
async function processUpdate(update: any) {
  if (!update.message) return;
  
  const msg = update.message;
  const text = msg.text || '';
  
  if (text.startsWith(COMMANDS.START)) {
    await handleStart(msg);
  } else if (text.startsWith(COMMANDS.HELP)) {
    await handleHelp(msg);
  } else if (text.startsWith(COMMANDS.SEND_SMS)) {
    await handleSendSms(msg);
  } else if (text.startsWith(COMMANDS.HISTORY)) {
    await handleHistory(msg);
  } else {
    // Mensaje que no es un comando reconocido
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAuthorizedUser(userId)) {
      return;
    }
    
    await bot.sendMessage(chatId, 
      '❓ Comando no reconocido. Usa /help para ver los comandos disponibles.');
  }
}

// Configurar el servidor HTTP para recibir actualizaciones de Telegram
serve(async (req) => {
  // Verificar configuración
  if (!checkConfiguration()) {
    return new Response("Error: Configuración incompleta", { status: 500 });
  }
  
  const url = new URL(req.url);
  
  // Ruta para el webhook de Telegram
  if (req.method === "POST" && url.pathname === WEBHOOK_PATH) {
    try {
      const update = await req.json();
      // Procesar la actualización de forma asíncrona
      processUpdate(update);
      return new Response("OK");
    } catch (error) {
      console.error("Error al procesar la actualización:", error);
      return new Response("Error al procesar la actualización", { status: 500 });
    }
  }
  
  // Ruta para verificar que el bot está funcionando
  if (req.method === "GET" && url.pathname === "/") {
    return new Response("Bot de Telegram funcionando correctamente");
  }
  
  return new Response("Not found", { status: 404 });
});

console.log("Servidor iniciado. Esperando actualizaciones de Telegram...");