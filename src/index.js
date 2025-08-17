const { initBot } = require('./controllers/botController');

// Verificar variables de entorno requeridas
const { telegramToken, supabaseUrl, supabaseKey, twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = require('./config/env');

// Función para verificar configuración
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
    console.error('\nCrea un archivo .env basado en .env.example con los valores correctos.');
    process.exit(1);
  }
}

// Función principal
function main() {
  try {
    // Verificar configuración
    checkConfiguration();
    
    // Iniciar el bot
    initBot();
    
    console.log('Aplicación iniciada correctamente');
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Ejecutar la aplicación
main();