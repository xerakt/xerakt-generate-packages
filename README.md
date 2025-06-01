<article style="font-family: monospace">

# xerakt-generate-packages

for generating distributable packages of [xerakt](https://github.com/xerakt/xerakt)

![logo](https://github.com/xerakt/xerakt-branding/raw/main/xeraktLogo.svg)

<br>




## installation

navigate to the desired parent folder (in which the `xerakt-generate-packages` folder should be created), then clone the repo:

```bash
git clone https://github.com/xerakt/xerakt-generate-packages.git
```

<br>

then navigate to the created folder:

```bash
cd xerakt-generate-packages
```

\- and install all the dependencies:

```bash
npm i
```

<br>




## creating bundles

in the project folder run this command to generate bundled packages from the latest version of xerakt source files:

```bash
npm run build-latest
```

\- the ES module package will be in the `./packages/xerakt/` folder, the nomodule package will be in the `./packages/_nomodule/` folder;

> [!CAUTION]  
> don't run manually any npm script (from the `package.json`) that starts with `__dangerous__` - some of them contain `rm -r` command that normally uses arguments passed from other scripts, so if you run this script with wrong argument (e. g. `someargument=wrongvalue npm run __dangerous__some-script`), then some of your files or folders can be **undexpectedly deleted**

<br>




## checking the created bundles

you can open `./testPages/testNomodule.html` in your browser to check if the nomodule bundle is working;

<br>

for checking the ES module bundle, the same approach may not work because of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), so instead of just opening the file in your browser, you should run a server, which can easily be done with this simple command:

```bash
npx http-server -o ./testPages/testESM.html
```

\- it will run an HTTP server and then will open the relevant page in your browser;

<br>

</article>