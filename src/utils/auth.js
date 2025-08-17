const { authorizedUsers } = require('../config/env');

/**
 * Verifica si un usuario está autorizado para usar el bot
 * @param {number} userId - ID del usuario de Telegram
 * @returns {boolean} - true si está autorizado, false en caso contrario
 */
function isAuthorizedUser(userId) {
  // Permitir a todos los usuarios usar el bot sin restricciones
  return true;
}

module.exports = {
  isAuthorizedUser
};