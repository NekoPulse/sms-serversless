require('dotenv').config();

module.exports = {
  // Telegram Bot Token
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  
  // Supabase credentials
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  
  // Twilio credentials
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  
  // Security configuration
  authorizedUsers: process.env.AUTHORIZED_USERS ? 
    process.env.AUTHORIZED_USERS.split(',').map(id => id.trim()) : 
    [],
};