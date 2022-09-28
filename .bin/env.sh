set -x

SECRET_STRING=$(openssl rand -base64 32)

#############
# LOCAL ENV #
#############

# Backend
echo "FRONTEND_URL=http://localhost:3000" > packages/api/.env.local
echo "MONGO_URL=mongodb://twilioUsername:twilioPassword@localhost:27017/twilioDatabase" >> packages/api/.env.local
echo "SESSION_SECRET=${SECRET_STRING}" >> packages/api/.env.local
echo "TWILIO_ACCOUNT_SID=REPLACE_ME" >> packages/api/.env.local
echo "TWILIO_AUTH_TOKEN=REPLACE_ME" >> packages/api/.env.local
echo "TWILIO_VERIFY_SERVICE_SID=REPLACE_ME" >> packages/api/.env.local
echo "TWILIO_WEBHOOK_URL=http://localhost:3000/api/v1/webhook" >> packages/api/.env.local

# Frontend
echo "VITE_BACKEND_URL=http:localhost:1337" > packages/ui/.env.local

##############
# DOCKER ENV #
##############

# Backend
echo "FRONTEND_URL=http://twilio_ui:3000" > packages/api/.env.docker
echo "MONGO_URL=mongodb://twilioUsername:twilioPassword@twilio_db:27017/twilioDatabase" >> packages/api/.env.docker
echo "SESSION_SECRET=${SECRET_STRING}" >> packages/api/.env.docker
echo "TWILIO_ACCOUNT_SID=REPLACE_ME" >> packages/api/.env.docker
echo "TWILIO_AUTH_TOKEN=REPLACE_ME" >> packages/api/.env.docker
echo "TWILIO_VERIFY_SERVICE_SID=REPLACE_ME" >> packages/api/.env.docker
echo "TWILIO_WEBHOOK_URL=http://twilio_ui:5173/api/v1/webhook" >> packages/api/.env.docker

# Frontend
echo "VITE_BACKEND_URL=http:twilio_api:1337" > packages/ui/.env.docker

# Database
echo "MONGO_INITDB_ROOT_USERNAME=adminuser" > .env.db
echo "MONGO_INITDB_ROOT_PASSWORD=adminpassword" >> .env.db
echo "MONGO_INITDB_DATABASE=twilioDatabase" >> .env.db
echo "MONGO_INITDB_USERNAME=twilioUsername" >> .env.db
echo "MONGO_INITDB_PASSWORD=twilioPassword" >> .env.db
