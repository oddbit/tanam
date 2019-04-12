# Tanam 🌱 A plug n play CMS for Firebase
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/nexudus-js)

## Tanam is a free CMS; both free as in FOSS and as in free ice cream 🍦

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

# Read more
 * [Install and get Tanam for your site](/docs/install.md)
 * [How do develop web templates](/docs/develop-templates.md)
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
