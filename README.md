# Tanam 🌱 Plug-n-play CMS for websites on Firebase

![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)

Our aim is to provide a self hosted publishing platform for Firebase.

TanamCMS is the easiest way to build a website for dynamic content such as a blogging platform where you easily can publish and manage your content, even schedule posts to be published.

Tanam also has a built in AI ghostwriter that can help you generate articles in your own writing style. You provide the draft or voice transcript and the ghostwriter will make it into a well written article for you.

# Set up

You will need to configure the Next app in the dot-env file `apps/cms/.env`. You can find an template file named `apps/cms/.env.local.example` to rename and populate with values.

## Build and run locally

Install all dependencies and serve locally.

```sh
npm install
npm serve
```

## Deploy to Firebase

Follow the [documentation for Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
on how to set up your application for automatic deployment.

### Configure Firebase cloud

In order to deploy to Firebase App Hosting you will need to set up some secrets on GCP Secrets Manager.

Follow the steps below to configure it from command line.

Read the environment variables from the CMS configuration

```sh
source apps/cms/.env
```

Copy and paste all these to set up. Be patient, it will take a little while to complete all variable configuration.

```sh
echo $NEXT_PUBLIC_FIREBASE_API_KEY | firebase apphosting:secrets:set --force --data-file - tanamApiKey
echo $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | firebase apphosting:secrets:set --force --data-file - tanamAuthDomain
echo $NEXT_PUBLIC_FIREBASE_DATABASE_URL | firebase apphosting:secrets:set --force --data-file - tanamDatabaseUrl
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID | firebase apphosting:secrets:set --force --data-file - tanamProjectId
echo $NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | firebase apphosting:secrets:set --force --data-file - tanamStorageBucket
echo $NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | firebase apphosting:secrets:set --force --data-file - tanamMessagingSenderId
echo $NEXT_PUBLIC_FIREBASE_APP_ID | firebase apphosting:secrets:set --force --data-file - tanamAppId
```

You will need to grant access to your app-hosting backend if this is the first time you are setting the variables
and if you didn't enable access to all variables in the `apphosting:secrets:set` step.

```sh
export APP_HOSTING_BACKEND=<your app-hosting-backend>
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamApiKey
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamAuthDomain
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamDatabaseUrl
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamProjectId
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamStorageBucket
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamMessagingSenderId
firebase apphosting:secrets:grantaccess --backend $APP_HOSTING_BACKEND tanamAppId
```

# License

```
Copyright oddbit

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
