<div align="center">

<kbd>
<img style="border-radius:50%" height="150px" src="https://raw.githubusercontent.com/cognetwork-dev/Tsunami/main/public/logo/svg">
</kbd>

<h1>Eclipse</h1>

<h3>[Unfinished] An interception web proxy</h3>

<p>Eclipse is a new interception web proxy that follows TOMP standards</p>

</div>

<p align="center">
<a href="https://repl.it/github/FogNetwork/Eclipse"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/replit2.svg"><img></a>
<a href="https://glitch.com/edit/#!/import/github/FogNetwork/Eclipse"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/glitch2.svg"><img></a>
<a href="https://railway.app/new/template?template=https://github.com/FogNetwork/Eclipse"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/railway2.svg"><img></a>
<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/FogNetwork/Eclipse&branch=main&name=Eclipse"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/koyeb2.svg"><img></a>
</p>

## Setup
**1. Download files**
Download all the folder `/eclipse/` and put it in the top directory under `/eclipse/`

**2. Include script**
In your head or body tag, include a script with `type="module"`

External page:
```html
<script type="module" src="./index.js"></script>
```

Embedded code:
```html
<script type="module">
/*Code here*/
</script>
```

**3. Add Eclipse**
Inside you script import the eclipse script like this
```js
import Eclipse from './eclipse/EC.js';
```

**4. New Eclipse**
To install and setup Eclipse, create a new Eclipse like this
```js
const EC = new Eclipse({
  bare: "/bare/"
})
```

Set the bare server to a valid bare client by changing `"/bare"`

If you want to access this outside the file create a global variable
```js
window.EC = new Eclipse({
  bare: "/bare/"
})
```

**5. Go to page**
Once you setup a new Eclipse, you can access different things

For the examples below the new Eclipse will be named `EC`

Bare - `EC.bare`

Prefix - `EC.prefix`

Get url - `EC.url("https://example.com")`

Search engine - `EC.search("proxy", "https://www.google.com/search?q=%s")`

Change the search engine to any engine with `%s` in place of query

Go to page:
```js
window.location.href = EC.url("https://example.com")
```

Go to page or search:
```js
window.location.href = EC.search("proxy", "https://www.google.com/search?q=%s")
```

**Full Result**
index.html

```html
<script type="module" src="./index.js"></script>
```

index.js
```js
import Eclipse from './eclipse/EC.js';

const EC = new Eclipse({
  bare: "/bare/"
})

window.location.href = EC.search(query, "https://www.google.com/search?q=%s")
```

## To Do
- [x] srcset
- [ ] js rewrites
- [ ] client rewrites
- [ ] more html rewrites
- [ ] ws
- [ ] json rewrites
- [ ] rewrite url all in one object
- [ ] headers export as object
- [ ] hex encoding
