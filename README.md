# easy-app-cache.js

Client-side caching for the mobile app masses.

## Introduction

easy-app-cache is a super-simple caching library designed for use in HTML5
mobile apps (read: with PhoneGap). EAC is designed with a focus on robustness
and verbosity - where applicable errors are checked for and extra logging can
be turned on to show these errors. The source code is also generously
commented.

## Usage

 1) Include easy-app-cache.js in your project.

```html
<script src="js/easy-app-cache.js"></script>
```

 2) Cache things

EAC has 3 different levels of caching.

 * "Persistant Storage" is caching that remains even after the user has exited
the HTML5 app, and even after they have restared their phone / device. By
default, Persistant Storage is implemented using the HTML5 localStorage API.
 * "Session Storage" is caching that remains until the user closes your HTML5
app. For example, a user might leave your app to take a phone call or use
some other app (however your page is still present in memory). When they
return, session-cached items are still present. Session storage is implemented
using PhoneGap specific features and requires a PhoneGap environment to work.
Without PhoneGap, session storage becomes identical to...
 * "Memory Storage" is caching that exists only until the user leaves your
page. As soon as they browse away from the current page, Memory storage is
destroyed. It lives in the JS engine memory and is implemented using a simple
dictionary.

To cache an object, simply call `appCache.set[P|S|M]()` where you use P for
Persistant storage, S for Session storage and M for Memory storage.

To later retrieve that object, call `appCache.get[P|S|M]()`.

Objects can also be cleared using `appCache.clear[P|S|M]()`.

```js
// Store a persistant object
appCache.setP("persistant-string", "Yo Dawg! This string is totally persistant");

// Store session-life object
appCache.setS("userdetails", {
    name: "Aaron",
    likes_chocolate: false
});

// Retrieve objects using appCache.get*()
console.log(appCache.getP("persistant-string"));
// => Prints "Yo Dawg! This string is totally persistant"

var chocolate_affinity = appCache.getS("userdetails").likes_chocolate;

/* You can pass an optional second 'default' parameter. If the requested
 * object doesn't exist, it will be stored, and that value will be returned.
 */
var likes_apples = appCache.getM("NonexistantObject", true);
// => Returns true

console.log(appCache.getM("NonexistantObject"));
// => Prints true

// Clear objects by key...
appCache.clearS("userdetails");

// ... or blow all objects at a given cache level away
appCache.clearP();

// And if you're feeling exta paranoid, bust all the caches
appCache.bust();

// Everything is gone now

```

## Other options

EAC also allows you to turn logging off (default) or on.

```js
appCache.setVerbose(true);
```

