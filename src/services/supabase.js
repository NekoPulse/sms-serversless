const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey } = require('../config/env');

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Guarda un registro de mensaje SMS en Supabase
 * @param {Object} smsData - Datos del SMS
 * @param {string} smsData.from - Número de teléfono del remitente
 * @param {string} smsData.to - Número de teléfono del destinatario
 * @param {string} smsData.message - Contenido del mensaje
 * @param {string} smsData.status - Estado del envío (enviado, fallido)
 * @param {number} smsData.userId - ID del usuario de Telegram que envió el mensaje
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function saveSmsRecord(smsData) {
  try {
    const { data, error } = await supabase
      .from('sms_messages')
      .insert([
        {
          from_number: smsData.from,
          to_number: smsData.to,
          message_content: smsData.message,
          status: smsData.status,
          telegram_user_id: smsData.userId,
          sent_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al guardar registro de SMS en Supabase:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene el historial de mensajes SMS enviados por un usuario
 * @param {number} userId - ID del usuario de Telegram
 * @param {number} limit - Número máximo de registros a devolver
 * @returns {Promise<Array>} - Registros de mensajes
 */
async function getSmsHistory(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('sms_messages')
      .select('*')
      .eq('telegram_user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener historial de SMS:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  supabase,
  saveSmsRecord,
  getSmsHistory
};