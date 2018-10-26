# Tanam 🌱 A pluggable CMS for Firebase.
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/nexudus-js)

![Login screen](/doc/images/login.png)


## History
The word *tanam* means "to plant" in Indonesian language. The name comes from the seed of thought that this project was for
about a year before inception. Also because the leading design guidelines for building Tanam is: beauty and simplicity on
surface and power from within.

For anyone exposed to use Tanam, either as a developer that is building a site or a content creator who is sharing creative works,
we want to provide an easy to use platform that allows you to simply create a platform for sharing your thoughts.

It should be as easy as planting a seed and then nurture your site to watch it grow.

We want to remove the need of understanding the technical complexity on which Tanam is fuelling its power.

## Getting started
Setting up Tanam is as easy as just adding a few lines of code to your index.js file in the project's cloud functions folder.
The CMS administration dashboard will immediately and automatically be accessible to manage your site, add and edit content.

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

## Technical details
This section below is purely for technical understanding of Tanam and intended for you who
would like to tweak your setup or to contribute to the platform.

### Cache
The default values for client/browser cache and server/CDN cache are set in
[`src/cache.ts`](src/cache.ts)

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
