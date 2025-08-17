const twilio = require('twilio');
const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber } = require('../config/env');
const { saveSmsRecord } = require('./supabase');

// Crear cliente de Twilio
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

/**
 * Envía un mensaje SMS a través de Twilio y guarda el registro en Supabase
 * @param {Object} smsData - Datos del SMS a enviar
 * @param {string} smsData.to - Número de teléfono del destinatario (formato internacional: +123456789)
 * @param {string} smsData.message - Contenido del mensaje
 * @param {number} smsData.userId - ID del usuario de Telegram que envía el mensaje
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function sendSms(smsData) {
  try {
    // Validar el número de teléfono (formato básico)
    if (!smsData.to.startsWith('+')) {
      throw new Error('El número de teléfono debe tener formato internacional (comenzar con +)');
    }

    // Enviar SMS con Twilio
    const message = await twilioClient.messages.create({
      body: smsData.message,
      from: twilioPhoneNumber,
      to: smsData.to
    });

    // Guardar registro en Supabase
    await saveSmsRecord({
      from: twilioPhoneNumber,
      to: smsData.to,
      message: smsData.message,
      status: 'enviado',
      userId: smsData.userId
    });

    return {
      success: true,
      messageId: message.sid,
      status: message.status
    };
  } catch (error) {
    console.error('Error al enviar SMS:', error);

    // Guardar registro de error en Supabase
    await saveSmsRecord({
      from: twilioPhoneNumber,
      to: smsData.to || 'desconocido',
      message: smsData.message || '',
      status: 'fallido',
      userId: smsData.userId
    });

    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendSms
};