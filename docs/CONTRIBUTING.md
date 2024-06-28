# Contribute

Wow, you're amazing for even considering to contribute.

It's a scary road ahead. Take this 🦄 to accompany on your adventure with us.

## Configuration

All configuration values below are populated and injected in Github actions during
deployment. During development you will need to configure your environment in the
`.env` files in `functions` and `hosting`. The files are omitted from the repository.

### Hosting

Create a `.env` file in the functions folder.

```sh
touch ./hosting/.env
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
touch ./functions/.env
```

Set the following environment variables

- `GOOGLE_GENAI_API_KEY` - Your Gemini API key. Generate the API key in [Google AI Studio](https://aistudio.google.com/app/apikey).

## Genkit with Local Emulator Suite

See the [official documentation](https://firebase.google.com/docs/genkit/firebase#developing_using_firebase_local_emulator_suite) for complete instructions.

Here's the TL;DR instructions. Copy and run these commands.

Make sure that you have firebase tools and genkit installed globally.

```sh
npm install -g firebase-tools@latest genkit@latest
```

Assuming that you're running the commands from the root of your project folder

```sh
npm --prefix functions install
npm --prefix functions run build
GENKIT_ENV=dev firebase emulators:start --inspect-functions
```

Make sure that the emulators are fully started before running the following command.

```sh
genkit start --attach http://localhost:3100 --port 4001
```
