set -x

## Load the environment variables
set -a
. .env.api
. .env.db
. .env.ui
set +a

docker build --no-cache -t twilio/api:latest -f Dockerfile.api .
docker build --no-cache -t twilio/ui:latest -f Dockerfile.ui .
docker-compose up -d
