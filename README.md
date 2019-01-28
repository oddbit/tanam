# Tanam 🌱 A pluggable CMS for Firebase
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/nexudus-js)

![Login screen](/docs/images/login.png)


```
DISCLAIMER

Tanam is currently in a very early development stage. It is NOT production ready.

Get involved if something isn't working. We are happily receiving pull requests.

Create an issue if you find a bug. But no feature requests please.

Use at your own risk.
```


## About
The word *tanam* means "to plant" in Indonesian language. The name comes from the seed of thought that
this project was for about a year before inception. Also because the leading design guidelines for
building Tanam is: using the CMS should be as easy as planting a seed and then nurture your site
with good content and just watch it grow and scale by itself.

For anyone exposed to use Tanam, either as a developer that is building a site or a content creator who is sharing creative works,
we want to provide an easy to use platform that allows you to simply create a platform for sharing your thoughts.

We want to remove the need of understanding the technical complexity on which Tanam is fuelling its power.

### What makes Tanam special
Tanam is built and fully powered by Firebase. It allows you to host your own CMS completely free
both free as in FOSS and as in free ice cream 🍦

Tanam is providing a platform with dynamic content (server side rendered) with static site performance
straight out of the box. It's a auto-scaling platform that will work just as well for small personal
sites as it will also be able to serve heavy load without breaking a sweat.

Tanam is leveraging Google's global CDN to deliver pre-built versions of your dynamic content.
All cached content is immediately replaced as you update it. Since we are pre-building
the content, all your URLs will serve instantly as a static website would. Performance only depends
on the size of your page.

Hosting Tanam can cost you as little as nothing. Firebase has a very generous
[pricing model](https://firebase.google.com/pricing/) with
a free tier that most likely will be all you need. The platform automatically supports custom
domain linking and serves all content over secure HTTPS connection. You can have a publishing
platform to the cost of only your yearly domain name renewal.

## How to build it
The application is composed of three parts
  1. Angular single page application for the admin backend
  2. Angular server side rendered application for dynamic content
  3. Cloud functions for serving the app and running background jobs

Build and package the app from the `functions` folder.

```bash
$ cd functions
$ npm run build:dist
$ cd ../dist
$ npm install
$ firebase deploy
```

It's important that you run npm install inside of the dist folder as the build script consolidates the different `package.json` files into a single one that represents all of the app's dependencies.
