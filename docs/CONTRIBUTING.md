# Contribute

Wow, you're amazing for even considering to contribute.

It's a scary road ahead. Take this 🦄 to accompany on your adventure with us.

## Architecture

The project is using [NX monorepo](https://nx.dev/) for its architecture.

You will find the code structured like this

- Cloud functions: `./apps/cloud-functions`
- App Hosting CMS application: `./apps/cms`
- UI components: `./libs/ui-components`
- Shared definitions and base classes: `./libs/domain-shared`
- Backend classes: `./libs/domain-backend`
- Frontend client classes: `./libs/domain-frontend`

## Configuration

All configuration values below are populated and injected in Github actions during
deployment. During development you will need to configure your environment in the
`.env` files for `cloud-functions` and `hosting` apps.

The files are omitted from the repository.

### CMS app

Create a `.env` file in the CMS app folder.

```sh
touch ./apps/cms/.env
```

Set the following environment variables from your Firebase project web app configuration.

- `NEXT_PUBLIC_FIREBASE_API_KEY` -
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Cloud functions

Create a `.env` file in the functions folder.

```sh
touch ./apps/cloud-functions/.env
```

Set the following environment variables

- `GEMINI_API_KEY` - Your Gemini API key. Generate the API key in [Google AI Studio](https://aistudio.google.com/app/apikey).

## Genkit with Local Emulator Suite

See the [official documentation](https://firebase.google.com/docs/genkit/firebase#developing_using_firebase_local_emulator_suite) for complete instructions.

Here's the TL;DR instructions. Copy and run these commands.

Make sure that you have firebase tools and genkit installed globally.

```sh
npm install -g firebase-tools@latest genkit@latest
```

Assuming that you're running the commands from the root of your project folder

```sh
npm install
npm build:functions
GENKIT_ENV=dev firebase emulators:start --inspect-functions
```

Make sure that the emulators are fully started before running the following command.

```sh
genkit start --attach http://localhost:3100 --port 4001
```
