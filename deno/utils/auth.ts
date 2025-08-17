/**
 * Verifica si un usuario está autorizado para usar el bot
 * @param {number} userId - ID del usuario de Telegram
 * @returns {boolean} - true si el usuario está autorizado, false en caso contrario
 */
export function isAuthorizedUser(userId: number): boolean {
  // Permitir a todos los usuarios usar el bot
  return true;
}