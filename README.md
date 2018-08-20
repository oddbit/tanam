# Tanam 🌱
![License](https://img.shields.io/npm/l/tanam.svg)
![NPM version](https://img.shields.io/npm/v/tanam.svg)
![Total NPM downloads](https://img.shields.io/npm/dt/tanam.svg)
[![Travis build status](https://img.shields.io/travis/oddbit/tanam.svg)](https://travis-ci.org/oddbit/nexudus-js)

A pluggable web based CMS for Firebase.

## Configuration

### Your first user
Before logging in with your first user, you want to make sure that it's only you who get access to your site.

Configure yourself as the owner of the site by running this command in your project root

```bash
firebase functions:config:set tanam.owner=john.doe@example.com
```

Exchange the email `john.doe@example.com` with the email that you will login as the "site owner". Don't worry,
you can add more admin users later. This is just to enable you to login directly after deploying the site.

### Cache
The default values for client/browser cache and server/CDN cache are set in (`routing.ts`)[/src/utils/routing.ts].

Configure alternative caching values with cloud functions config.

```bash
firebase functions:config:set cache.serverAge=12345
firebase functions:config:set cache.clientAge=123
```


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
