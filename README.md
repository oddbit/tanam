# Tanam 🌱 Plug-n-play CMS for websites on Firebase
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/tanam)

## Tanam is a free CMS; both free as in FOSS and as in free ice cream 🍦

![Login screen](/docs/images/tanam-overview.gif)


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

Static websites are increasingly popular for the of performance of serving time. But they are on
the other hand relatively difficult to maintain for a non-technical content creators.

Firebase is a suite of services that offers all elements necessary to serve a CMS... and at
virtually infinitly high performance.

# What is Tanam
Tanam is built and fully powered by Firebase. It transforms your Firebase project to a dynamic content
website backed by a CMS that is completely free; both free as in FOSS and as in free ice cream 🍦

Tanam is providing a platform that server side renders your dynamic content and delivers it with static
site performance straight out of the box. It's a auto-scaling platform that will work just as well for
small personal sites as it will also be able to serve heavy load without breaking a sweat.

The simple way to describe how this is possible is to say that we're using Google's global CDN as our
filesystem for statically generated pages.
All cached content is immediately replaced as you update it. Since we are pre-building
the content, all your URLs will serve instantly as a static website would. Performance only depends
on the size of your page.

The word *tanam* means "to plant" in Indonesian language. It is how we envision Tanam to be:
just plant the CMS into Firebase and let it grow and scale by itself. There is no need to manage
the resources or configure it for performance.


# Does it really cost nothing?
Hosting Tanam can cost you as little as nothing. Firebase has a very generous
[pricing model](https://firebase.google.com/pricing/) with a free tier that is more than enough for most
 Tanam sites.

You must still put your project into the *Blaze plan*, since we're using outgoing HTTP requests to
pre-heat your website's cache. The good thing about the Blaze plan is that it still won't cost you
anything unless you go over the free tier quotas.

Tanam is using fairly little database and cloud function resources since content is only updated
on demand, and as the owner of your website you and your team are the only users that create content.

# Read more
 * [Install and get Tanam for your site](/docs/install.md)
 * [How to develop web templates](/docs/develop-templates.md)
 * [The technical infrastructure](/docs/infrastructure.md)
 * [Screenshots and CMS in action](/docs/in-action.md)
 * [Portfolio](/docs/portfolio.md)


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
