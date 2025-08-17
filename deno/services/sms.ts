import { Twilio } from "twilio";
import { createClient } from "@supabase/supabase-js";

// Variables de entorno
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_KEY") || "";

// Crear cliente de Twilio
const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);

// Crear cliente de Supabase
const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Valida un número de teléfono
 * @param {string} phoneNumber - Número de teléfono a validar
 * @returns {boolean} - true si el número es válido, false en caso contrario
 */
function isValidPhoneNumber(phoneNumber: string): boolean {
  // Expresión regular para validar números de teléfono internacionales
  // Acepta formato +123456789 (código de país + número)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * Envía un mensaje SMS y guarda el registro en Supabase
 * @param {string} to - Número de teléfono de destino
 * @param {string} message - Contenido del mensaje
 * @param {number} telegramUserId - ID del usuario de Telegram que envía el mensaje
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function sendSms(to: string, message: string, telegramUserId: number) {
  try {
    // Validar número de teléfono
    if (!isValidPhoneNumber(to)) {
      return {
        success: false,
        error: 'Número de teléfono inválido. Debe incluir el código de país (ej: +123456789)'
      };
    }
    
    // Enviar SMS con Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });
    
    // Guardar registro en Supabase
    const { error } = await supabaseClient
      .from('sms_messages')
      .insert({
        from_number: twilioPhoneNumber,
        to_number: to,
        message_content: message,
        status: result.status,
        telegram_user_id: telegramUserId,
        sent_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error al guardar en Supabase:', error);
    }
    
    return {
      success: true,
      messageId: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    
    // Guardar registro de error en Supabase
    try {
      await supabaseClient
        .from('sms_messages')
        .insert({
          from_number: twilioPhoneNumber,
          to_number: to,
          message_content: message,
          status: 'failed',
          telegram_user_id: telegramUserId,
          sent_at: new Date().toISOString(),
          error_message: error.message || 'Error desconocido'
        });
    } catch (dbError) {
      console.error('Error al guardar registro de error:', dbError);
    }
    
    return {
      success: false,
      error: error.message || 'Error desconocido'
    };
  }
}