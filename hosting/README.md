# Hosting

## Configuration

Make sure that you are configuring a `.env` file in the hosting folder.

Take the configuration from your Firebase project web application settings.
There is a JSON configuration that you should add to the `.env` file as
displayed below.

```
https://console.firebase.google.com/project/<your_project>/settings/general/
```

### `hosting/.env`

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Github actions

The `.env` file contents should be stored in a github varialbes as specified by
the github actions deployment scripts.

## Get up and running

Start the application locally by simply running

```sh
npm run dev
```
