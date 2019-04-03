# Tanam 🌱 A pluggable CMS for Firebase
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/nexudus-js)

# Tanam is a free CMS; both free as in FOSS and as in free ice cream 🍦

![Login screen](/docs/images/login.png)


```
DISCLAIMER

Tanam is currently in a very early development stage. It is NOT production ready.

Get involved if something isn't working. We are happily receiving pull requests.

Create an issue if you find a bug. But no feature requests please.

Use at your own risk.
```


# Problem statement
Building a website for content creation such as personal blog or even for a business with regular
updates can be unnecessary complicated or expensive.

Some of the most popular CMS platforms requires to be hosted on a VPS or a cloud hosting offer
that both will set you back a few dollars per month and in the case of VPS it will probably come
with a fairly poor performance.

Static websites are increasingly popular for the of performance of serving time. But they are on
the other hand relatively difficult to maintain for a non-technical content creators.

Firebase is a suite of services that offers all elements necessary to serve a CMS... and at
virtually infinitly high performance.

# What is Tanam
Tanam is built and fully powered by Firebase. It allows you to host your own CMS completely free
both free as in FOSS and as in free ice cream 🍦

Tanam is providing a platform with dynamic content (server side rendered) with static site performance
straight out of the box. It's a auto-scaling platform that will work just as well for small personal
sites as it will also be able to serve heavy load without breaking a sweat.

Tanam is leveraging Google's global CDN to deliver pre-built versions of your dynamic content.
All cached content is immediately replaced as you update it. Since we are pre-building
the content, all your URLs will serve instantly as a static website would. Performance only depends
on the size of your page.


The word *tanam* means "to plant" in Indonesian language. The name comes from the seed of thought that
this project was for about a year before inception. Also because the leading design guidelines for
building Tanam is: using the CMS should be as easy as planting the seed and then nurture your site
with good content and just watch it grow and scale by itself.

For anyone exposed to use Tanam, either as a developer that is building a site or a content creator who is sharing creative works,
we want to provide an easy to use platform that allows you to simply create a platform for sharing your thoughts.

# Does it really cost nothing?
Hosting Tanam can cost you as little as nothing. Firebase has a very generous
[pricing model](https://firebase.google.com/pricing/) with a free tier that is more than enough for most
 Tanam sites.

You must still put your project into the *Blaze plan*, since we're using outgoing HTTP requests to
pre-heat your website's cache. The good thing about the Blaze plan is that it still won't cost you
anythingi unless you go over the free tier quotas.

Tanam is using fairly little database and cloud function resources since content is only updated
on demand, and as the owner of your website you and your team are the only users that create content.

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


 5. Add NPM dependency `tanam@latest`
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
