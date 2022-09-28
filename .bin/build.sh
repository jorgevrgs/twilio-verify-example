set -x

cd packages/api
set -a
. ./.env.docker
set +a
docker build --no-cache -t twilio/api:latest -f Dockerfile .
cd -

cd packages/ui
set -a
. ./.env.docker
set +a
docker build --no-cache -t twilio/ui:latest -f Dockerfile --build-args VITE_BACKEND_URL=http://twilio_api:1337 .
cd -
