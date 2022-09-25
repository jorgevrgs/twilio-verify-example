set -x

## Load the environment variables
set -a
. .env
set +a

docker build -t twilio_api:latest -f Dockerfile.api .
docker build -t twilio_ui:latest -f Dockerfile.ui .
docker-compose up -d
