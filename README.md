# Twilio Verify

App to register and log in an user using the Twilio Verify service.

## Getting Started

Copy the env file:

```sh
cp .env.docker.example .env
```

Generate a session string, example using your terminal:

```sh
echo "API_SESSION_SECRET=$(openssl rand -hex 32)" >> .env
```

Start the containers:

```sh
sh .bin/docker/build.sh
```

Now you can access the following urls:

- [Backend](http://localhost:1337)
- [Frontend](http://localhost:3000)
