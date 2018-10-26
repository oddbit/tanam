# Tanam 🌱 A pluggable CMS for Firebase
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/nexudus-js)

![Login screen](/doc/images/login.png)


## About
The word *tanam* means "to plant" in Indonesian language. The name comes from the seed of thought that
this project was for about a year before inception. Also because the leading design guidelines for
building Tanam is: using the CMS should be as easy as planting a seed and then nurture your site
with good content and just watch it grow and scale by itself.

For anyone exposed to use Tanam, either as a developer that is building a site or a content creator who is sharing creative works,
we want to provide an easy to use platform that allows you to simply create a platform for sharing your thoughts.

We want to remove the need of understanding the technical complexity on which Tanam is fuelling its power.

### What makes Tanam special
Tanam is build and fully powered by Firebase. It allows you to host your own CMS completely free
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

## Getting started
Setting up Tanam is as easy as just adding a few lines of code to your `index.js` file in the
project's cloud functions folder.
The CMS administration dashboard will immediately and automatically be accessible to manage your
site, add and edit content.

### Your first user
Before logging in with your first user, you want to make sure that it's only you who get access to your site.

## Configure your site

### Managing content types
Content types are content structures of your site such as blog posts, events or articles.
You can create any type of content type and associate it with a URL pattern of your own choosing.

![List content types](/doc/images/content-types-list.png)

Each content type is composed by "fields" that describe the inner structure of a content type.
For example, a blog post often has at least a title and a body.

The field types are ranging from simple text fields such as a page title to rich content editor input
where you can compose with custom HTML, image uploads, dates and much more. By specifying a type
properly you help to guide the content creator to be consistent in the writing.

![Edit content type](/doc/images/content-types-edit.png)

### Creating content
The content editor is simple and distraction free and allows you to create rich content with a WYSIWYG
editor.

![Edit blog post](/doc/images/blog-edit.png)

## Building templates
Building a Tanam site is as simple as creating a static HTML website. Actually, you can serve a
completely static site with Tanam.

But the real power comes when you create templates for your content types. Tanam is using
[DustJS](https://github.com/linkedin/dustjs) template engine to parse and replace variables,
which allows you to create dynamic content that is server side rendered. You can even make
arbitrary content lookups and queries from within your template.

For example, the code below would create a bullet list of three upcoming events.

```html
 <ul>
    {@documents collection="event" limit=3 sortOrder="asc" orderBy="eventData"}
    <li>
        <a href="{url}">{data.title}</a>
    </li>
    {/documents}
</ul>
```

## Technical details
This section below is purely for technical understanding of Tanam and intended for you who
would like to tweak your setup or to contribute to the platform.

### Template engine
Tanam is currently using [DustJS](https://github.com/linkedin/dustjs) template engine.
The choice is made from the absolute requirement that helper functions/values support `Promise` values.

What that means is that the following snipped will make a Firebase query, which returns a promise
in an `async` function.

```html
<h1>
{@document path="/blog/IH1XAaBYJcBtgRY0VYOj"}{data.title}{/document}
</h1>
```

At the time of writing, we only know DustJS that provides this functionality.

### Cache
One of the unique features with Tanam is the way that we manage the CDN cache for performance
of dynamic content. The server cache lifetime (CDN) is effectively not very important because
we will purge and renew cache manually when the content is updated.

Every document change will trigger a request for cache removal from CDN followed by a request
to store the new data in CDN. That allows content to always be present on an end node close
to the visitor, wherever in the world they are accessing the website from.

In the illustration below you can see content created and updated in Tanam, symbolized to the
left. Over time (downwards) the content is updated and the old revision is deleted from cache
before new version is created. Clients will see old revision until new is cached.

![Cache visual](/doc/images/cache-visual.png)

The caching strategy will ensure that there is next to no delay between updating content to
when the change is visible.

#### Cache life time
The default values for client/browser cache and server/CDN cache are set in
[`src/cache.ts`](src/cache.ts). As mentioned above, this should not be neccessary to make
changes to, unless you are experiencing any troubles with the default setup. Another use case
might be that you want to try something experimental and prefer to not have several months of
cache as default, in case something should go wrong with removing cache entries.

Configure alternative caching values with cloud functions config. The user provided config
from functions config below will overwrite the system defaults.

```bash
firebase functions:config:set cache.s_max_age=12345
firebase functions:config:set cache.max_age=123
```

See [official documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
for cache headers and their behaviour to understand how your settings will affect the system.
Tanam itself is using the configuration as below

 * `s_max_age` - Sets the `s-maxage` cache header
 * `max_age` - Sets the `max-age` cache header


#### When cache is refreshed
The cache will be refreshed as follows

 * Document change will refresh cache for that URL only
 * Theme changed will refresh cache for **all** site URLs and **all** theme files
 * Template file changed will refresh cache for **all** site URLs using that template

## License
This project is under [Apache License 2.0](LICENSE)

```
   Copyright 2018 oddbit

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
