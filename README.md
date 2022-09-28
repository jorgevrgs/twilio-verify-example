# Twilio Verify

App to register and log in an user using the Twilio Verify service. See it in action below:

[Docker without MFA](https://www.loom.com/share/a19dd125937344d69d0aa31a46b15cb2)

[Local with MFA](https://www.loom.com/share/b43ed46fdedf4b18a44e5939770accec)

## Getting Started

### Env Files

Generate the env files:

```sh
npm run init:env
```

This command create a dummy `.env.local` and `.env.docker` file.

**Edit the content of the `.env.*` file before starting the server.**

## Serve

Find below two options to start a server: Docker and Local. After starting the server, it is possible to access the user interfaces: [Frontend](http://localhost:3000) and [Backend](http://localhost:1337).

### Docker

Start the containers:

```sh
npm run build # optional to build the container
npm start     # starts the database, backend, and frontend
```

### Local

Alternatively, it's possible to lift the servers locally using an external connection to MongoDB.

```sh
npm run local
```

## Future

- [security] Move both session and connection strings to AWS SSM or Secrets Manager
- [improvement] Validate login form before creating a verification request
- [feature] Add Verify Push
- [feature] Activate Swagger
