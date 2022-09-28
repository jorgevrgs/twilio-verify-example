set -x

cd packages/api
set -a
. .env.docker
set +a
docker build --no-cache -t twilio/api:latest -f Dockerfile .
cd -

cd packages/ui
set -a
. .env.docker
set +a
docker build --no-cache -t twilio/ui:latest -f Dockerfile .
cd -
