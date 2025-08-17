import { createClient } from "@supabase/supabase-js";

// Variables de entorno
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_KEY") || "";

// Crear cliente de Supabase
const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Obtiene el historial de mensajes SMS enviados por un usuario
 * @param {number} telegramUserId - ID del usuario de Telegram
 * @returns {Promise<Array>} - Lista de mensajes enviados
 */
export async function getSmsHistory(telegramUserId: number) {
  try {
    const { data, error } = await supabaseClient
      .from('sms_messages')
      .select('*')
      .eq('telegram_user_id', telegramUserId)
      .order('sent_at', { ascending: false });
    
    if (error) {
      console.error('Error al obtener historial:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error al consultar Supabase:', error);
    throw error;
  }
}