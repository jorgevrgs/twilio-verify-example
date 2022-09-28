# Twilio Verify

App to register and log in an user using the Twilio Verify service.

## Getting Started

### Env Files

Copy the env file:

```sh
cp .env.docker.example .env
```

Generate a session string, example using your terminal:

```sh
echo "API_SESSION_SECRET=$(openssl rand -hex 32)" >> .env
```

### Docker

Start the containers:

```sh
sh .bin/docker/build.sh
```

Now you it is possible to access the user interface: [Frontend](http://localhost:3000) and [Backend](http://localhost:1337).

### Local

Alternatively, it's possible to lift the servers locally using a connection to MongoDB.

Create `env.local` files:

```sh
npm run build:env
```

It generates two files: `packages/api/.env.local` and `packages/ui/.env.local`.

After updating the env files run:

```sh
npm run dev
```

## Future

- [security] Move session string to AWS SSM or Secrets Manager
- [improvement] Validate login form before creating a validation
- [feature] Add Verify Push
- [feature] Activate Swagger
