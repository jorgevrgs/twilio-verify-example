set -x

## Load the environment variables
set -a
. .env
set +a

echo FRONTEND_URL="http://localhost:5173" > packages/api/.env.xxx
echo MONGO_URL="mongodb://twilioUsername:twilioPassword@localhost:27017/twilioDatabase" >> packages/api/.env.xxx
echo SESSION_SECRET="${API_SESSION_SECRET}" >> packages/api/.env.xxx
echo TWILIO_ACCOUNT_SID="${API_TWILIO_ACCOUNT_SID}" >> packages/api/.env.xxx
echo TWILIO_AUTH_TOKEN="${API_TWILIO_AUTH_TOKEN}" >> packages/api/.env.xxx
echo TWILIO_VERIFY_SERVICE_SID="${API_TWILIO_VERIFY_SERVICE_SID}" >> packages/api/.env.xxx
echo TWILIO_WEBHOOK_URL="http://localhost:3000/api/v1/webhook" >> packages/api/.env.xxx

echo VITE_BACKEND_URL="http:localhost:1337" > packages/ui/.env.xxx