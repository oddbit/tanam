# How do I get Tanam
Setting up Tanam for the first time requires a bit of Firebase knowledge.

## Firebase console
First, you need to set some things up in the [Firebase console](https://console.firebase.google.com/).
Create a Firebase project for your new CMS site (or choose an existing).

1. **Enable Google Auth** - Enable Google Authentication and follow the instructions.
2. **Enable Firestore** - the first time after you have created a Firebase project, you need to create a Firestore database for Tanam. Go to "Database" in the Firebase console and click "Create Database"
3. **Set up hosting** - this step is optional, but you will most likely want to connect you own domain to your Firebase project. Go to "Hosting" in the Firebase console and click "Get started" and follow the instructions.
4. **Switch to Blaze Plan** - Tanam requires the project to be on Blaze plan for the cache management.
5. **Add web app** - get the Firebase web config by adding a web app from the project dashboard or
 go ot the settings page. You will need this configuration later when you setup your project.

If you choose to not connect a custom domain, your website will only be available on the default
hosting domain: https://your-project-id.firebaseapp.com/



## Setting up your project and its code
This section explains how you can set up a new Tanam project from scratch. You can also
fork the [tanam-starter](https://github.com/oddbit/tanam-starter) project and skip most
of the steps that are already preconfigured for you. If you do that, you can practically
skip directly to step 6.

 1. Install [Firebase CLI: `firebase-tools`](https://firebase.google.com/docs/cli/)
 2. Run `firebase init` and follow the instructions
    1. Enable all features (realtime database, firestore, hosting, functions, cloud storage)
    2. Use TypeScript for your functions
    3. Rewrite all URLs to `index.html`
 3. Delete all files in your `public/` folder. You can put a `.gitkeep` there to make sure it exists
 4. Edit `firebase.json` and replace the rewrite to `index.html` with a rewrite to the `tanam` cloud function.
```json
"rewrites": [
    {
    "source": "**",
    "function": "tanam"
    }
]

```


 5. Add NPM dependency [`tanam@latest`](https://www.npmjs.com/package/tanam)
 6. Copy paste the code below into your `index.ts` file.
    1. Replace (and add any) email that should have access to the site. You can assign the roles (owner, admin, publisher) for different access of content. Make sure that at least someone is the "owner".
    2. Replace the `firebaseApp` with your own web configuration that you got when adding a web app in the  Firebase console


```typescript
import * as tanam from 'tanam';

tanam.initializeApp({
    users: {
        "your.email@gmail.com": "owner",
    },
    firebaseApp: {
        apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        authDomain: "your-project-id.firebaseapp.com",
        databaseURL: "https://your-project-id.firebaseio.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "0123456789"
    },
});

export * from 'tanam';
```
