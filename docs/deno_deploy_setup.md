# Guía de Despliegue en Deno Deploy

Esta guía te explicará paso a paso cómo desplegar tu Bot de Telegram SMS en Deno Deploy, un servicio gratuito para alojar aplicaciones Deno.

## ¿Qué es Deno Deploy?

Deno Deploy es una plataforma serverless para aplicaciones Deno que ofrece:

- Despliegue gratuito para proyectos personales
- Integración con GitHub
- Escalado automático
- Soporte global con baja latencia

## Requisitos previos

1. Una cuenta de GitHub
2. Tu bot de Telegram ya configurado con BotFather
3. Tu proyecto Supabase configurado
4. Tu cuenta de Twilio configurada

## Paso 1: Preparar tu repositorio en GitHub

1. Crea un nuevo repositorio en GitHub o usa uno existente
2. Asegúrate de que la carpeta `deno` de este proyecto esté en la raíz de tu repositorio

## Paso 2: Crear una cuenta en Deno Deploy

1. Ve a [Deno Deploy](https://dash.deno.com/)
2. Haz clic en "Sign Up" y autoriza con tu cuenta de GitHub

## Paso 3: Crear un nuevo proyecto

1. En el dashboard de Deno Deploy, haz clic en "New Project"
2. Selecciona "Deploy from GitHub"
3. Autoriza a Deno Deploy para acceder a tus repositorios si es necesario
4. Selecciona el repositorio donde está tu bot
5. Configura el proyecto:
   - **Name**: Elige un nombre para tu proyecto (será parte de la URL)
   - **Production Branch**: Selecciona la rama principal (main o master)
   - **Entry Point**: Selecciona `deno/main.ts`

## Paso 4: Configurar variables de entorno

1. Una vez creado el proyecto, ve a la pestaña "Settings"
2. Desplázate hasta la sección "Environment Variables"
3. Añade las siguientes variables:

```
TELEGRAM_BOT_TOKEN=tu_token_de_telegram_aquí
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_clave_anónima_de_supabase_aquí
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio_aquí
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio_aquí
TWILIO_PHONE_NUMBER=tu_número_de_teléfono_de_twilio_aquí
```

## Paso 5: Configurar el webhook de Telegram

Una vez desplegada tu aplicación, necesitas configurar Telegram para que envíe las actualizaciones a tu bot en Deno Deploy:

1. Abre tu navegador y visita la siguiente URL (reemplaza las variables):

```
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<TU_PROYECTO>.deno.dev/<TELEGRAM_BOT_TOKEN>
```

Por ejemplo, si tu token es `123456:ABC-DEF` y tu proyecto se llama `mi-bot-sms`, la URL sería:

```
https://api.telegram.org/bot123456:ABC-DEF/setWebhook?url=https://mi-bot-sms.deno.dev/123456:ABC-DEF
```

2. Deberías recibir una respuesta como esta:

```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

## Paso 6: Verificar que todo funciona

1. Abre tu chat con el bot en Telegram
2. Envía el comando `/start`
3. El bot debería responder con el mensaje de bienvenida

## Solución de problemas

### El bot no responde

1. Verifica los logs en el dashboard de Deno Deploy
2. Asegúrate de que todas las variables de entorno estén correctamente configuradas
3. Verifica que el webhook esté correctamente configurado visitando:

```
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

### Error en las variables de entorno

Si ves errores relacionados con variables de entorno faltantes, asegúrate de que todas las variables estén correctamente configuradas en la sección "Environment Variables" de tu proyecto en Deno Deploy.

## Ventajas de usar Deno Deploy

- **Gratuito**: El plan gratuito es suficiente para la mayoría de los bots personales
- **Sin mantenimiento**: No necesitas preocuparte por servidores o infraestructura
- **Escalable**: Se adapta automáticamente al tráfico
- **Rápido**: Despliegue global con baja latencia
- **Integración con GitHub**: Despliegue automático cuando haces push a tu repositorio

## Limitaciones del plan gratuito

- 100,000 solicitudes por día
- 100 GB de transferencia por mes
- 10 ms de CPU por solicitud (promedio)
- Sin garantía de disponibilidad

Estas limitaciones son más que suficientes para un bot personal con uso moderado.