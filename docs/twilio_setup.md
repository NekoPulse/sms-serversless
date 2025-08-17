# Configuración de Twilio para el envío de SMS

Este documento proporciona instrucciones detalladas sobre cómo configurar Twilio para habilitar el envío de SMS desde el bot de Telegram.

## Paso 1: Crear una cuenta en Twilio

1. Ve a [twilio.com](https://www.twilio.com/) y haz clic en "Sign up"
2. Completa el formulario de registro con tu información
3. Verifica tu dirección de correo electrónico y número de teléfono

## Paso 2: Configurar tu cuenta de Twilio

1. Una vez que hayas iniciado sesión, serás dirigido al panel de control de Twilio
2. Completa la verificación de tu cuenta si es necesario (puede requerir información adicional)

## Paso 3: Obtener un número de teléfono de Twilio

1. En el panel de control, navega a "Phone Numbers" > "Manage" > "Buy a number"
2. Selecciona tu país y asegúrate de que el número tenga capacidades de SMS marcadas
3. Haz clic en "Search" para encontrar números disponibles
4. Selecciona un número y haz clic en "Buy"

## Paso 4: Obtener las credenciales de API

1. En el panel de control de Twilio, busca la sección "Account Info"
2. Anota tu "Account SID" y "Auth Token"
3. También anota el número de teléfono que acabas de comprar (en formato E.164, por ejemplo: +12345678901)

## Paso 5: Configurar el archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Actualiza las siguientes variables con las credenciales obtenidas:

```
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=tu_numero_de_telefono_twilio
```

## Paso 6: Consideraciones importantes

### Límites de la cuenta de prueba

Si estás utilizando una cuenta de prueba (trial) de Twilio:

1. Solo podrás enviar mensajes a números de teléfono verificados
2. Para verificar un número, ve a "Phone Numbers" > "Verified Caller IDs" > "Add a new Caller ID"
3. Ingresa el número que deseas verificar y sigue las instrucciones

### Actualización a una cuenta pagada

Para enviar mensajes a cualquier número sin restricciones:

1. Actualiza tu cuenta de Twilio a una cuenta pagada
2. Agrega un método de pago en la sección "Billing"
3. Completa cualquier requisito adicional de verificación

### Cumplimiento normativo

Recuerda que el envío de SMS está sujeto a regulaciones que varían según el país:

1. Asegúrate de cumplir con las leyes locales sobre mensajería
2. No envíes mensajes no solicitados (spam)
3. Proporciona una forma para que los destinatarios puedan darse de baja

## Paso 7: Probar el envío de SMS

1. Inicia tu aplicación con `npm start`
2. Usa el bot de Telegram para enviar un mensaje de prueba
3. Verifica que el mensaje se reciba correctamente en el número de destino

## Solución de problemas

- Si los mensajes no se envían, verifica que las credenciales en el archivo `.env` sean correctas
- Asegúrate de que el número de teléfono de Twilio tenga capacidades de SMS
- Si usas una cuenta de prueba, verifica que estés enviando mensajes solo a números verificados
- Revisa los logs de la aplicación para detectar posibles errores
- Consulta el panel de Twilio para ver el estado de los mensajes enviados